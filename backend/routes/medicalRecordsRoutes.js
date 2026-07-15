// backend/routes/medicalRecordsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM medical_records WHERE patient_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب الملفات الطبية:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, summary, file_url, source_type, source_id } = req.body;
        if (!title) return res.status(400).json({ error: 'عنوان الملف مطلوب' });
        const [result] = await db.query(
            'INSERT INTO medical_records (patient_id, title, summary, file_url, source_type, source_id) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, title, summary || null, file_url || null, source_type || 'doctor_note', source_id || null]
        );
        res.status(201).json({ success: true, message: 'تم إضافة الملف الطبي بنجاح', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في إضافة ملف طبي:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const [existing] = await db.query(
            'SELECT id FROM medical_records WHERE id = ? AND patient_id = ?',
            [id, userId]
        );
        if (existing.length === 0) return res.status(404).json({ error: 'الملف غير موجود أو لا ينتمي لك' });
        await db.query('DELETE FROM medical_records WHERE id = ?', [id]);
        res.json({ success: true, message: 'تم حذف الملف الطبي بنجاح' });
    } catch (err) {
        console.error('❌ خطأ في حذف ملف طبي:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;
