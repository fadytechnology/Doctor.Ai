// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ============================================================
// 1. إنشاء غرفة محادثة جديدة (أو جلب الموجودة)
// ============================================================
router.post('/room', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { participantId } = req.body;

        if (!participantId) {
            return res.status(400).json({ error: 'معرف المشارك مطلوب' });
        }

        // البحث عن غرفة موجودة بين المستخدمين
        let [room] = await db.query(
            `SELECT id, room_name FROM chat_rooms
             WHERE (participant_1 = ? AND participant_2 = ?)
                OR (participant_1 = ? AND participant_2 = ?)`,
            [userId, participantId, participantId, userId]
        );

        if (room.length === 0) {
            // إنشاء غرفة جديدة
            const roomName = `room_${Math.min(userId, participantId)}_${Math.max(userId, participantId)}`;
            const [result] = await db.query(
                `INSERT INTO chat_rooms (room_name, participant_1, participant_2)
                 VALUES (?, ?, ?)`,
                [roomName, userId, participantId]
            );
            room = [{ id: result.insertId, room_name: roomName }];
        }

        res.json({
            success: true,
            roomId: room[0].id,
            roomName: room[0].room_name
        });
    } catch (err) {
        console.error('❌ خطأ في إنشاء غرفة:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 2. جلب رسائل غرفة معينة
// ============================================================
router.get('/messages/:roomId', authenticateToken, async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.user.id;

        // التحقق من أن المستخدم عضو في الغرفة
        const [room] = await db.query(
            `SELECT id FROM chat_rooms
             WHERE id = ? AND (participant_1 = ? OR participant_2 = ?)`,
            [roomId, userId, userId]
        );
        if (room.length === 0) {
            return res.status(403).json({ error: 'غير مصرح لك بدخول هذه الغرفة' });
        }

        const [messages] = await db.query(
            `SELECT id, sender_id, message_type, content, is_read, created_at
             FROM chat_messages
             WHERE room_id = ?
             ORDER BY created_at ASC
             LIMIT 100`,
            [roomId]
        );

        res.json({ success: true, messages });
    } catch (err) {
        console.error('❌ خطأ في جلب الرسائل:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 3. جلب قائمة المحادثات (الغرف) للمستخدم الحالي
// ============================================================
router.get('/rooms', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const [rooms] = await db.query(
            `SELECT
                r.id as room_id,
                r.room_name,
                r.participant_1,
                r.participant_2,
                u.full_name as participant_name,
                u.role as participant_role,
                (SELECT content FROM chat_messages
                 WHERE room_id = r.id
                 ORDER BY created_at DESC LIMIT 1) as last_message,
                (SELECT created_at FROM chat_messages
                 WHERE room_id = r.id
                 ORDER BY created_at DESC LIMIT 1) as last_message_time,
                (SELECT COUNT(*) FROM chat_messages
                 WHERE room_id = r.id AND sender_id != ? AND is_read = false) as unread_count
             FROM chat_rooms r
             JOIN users u ON (u.id = r.participant_1 OR u.id = r.participant_2)
             WHERE (r.participant_1 = ? OR r.participant_2 = ?)
               AND u.id != ?
             GROUP BY r.id
             ORDER BY last_message_time DESC`,
            [userId, userId, userId, userId]
        );

        res.json({ success: true, rooms });
    } catch (err) {
        console.error('❌ خطأ في جلب الغرف:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;