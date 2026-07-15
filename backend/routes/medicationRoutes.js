// backend/routes/medicationRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM medications WHERE patient_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب الأدوية:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, dose, frequency, notes, reminder_time } = req.body;
        if (!name || !dose || !frequency) {
            return res.status(400).json({ error: 'اسم الدواء، الجرعة، والتكرار مطلوبة' });
        }
        const [result] = await db.query(
            'INSERT INTO medications (patient_id, name, dose, frequency, notes, reminder_time) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, name, dose, frequency, notes || null, reminder_time || null]
        );
        res.status(201).json({ success: true, message: 'تم إضافة الدواء بنجاح', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في إضافة دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { name, dose, frequency, notes, reminder_time } = req.body;
        const [existing] = await db.query(
            'SELECT id FROM medications WHERE id = ? AND patient_id = ?',
            [id, userId]
        );
        if (existing.length === 0) return res.status(404).json({ error: 'الدواء غير موجود أو لا ينتمي لك' });
        const fields = [];
        const values = [];
        if (name) { fields.push('name = ?'); values.push(name); }
        if (dose) { fields.push('dose = ?'); values.push(dose); }
        if (frequency) { fields.push('frequency = ?'); values.push(frequency); }
        if (notes !== undefined) { fields.push('notes = ?'); values.push(notes); }
        if (reminder_time !== undefined) { fields.push('reminder_time = ?'); values.push(reminder_time); }
        if (fields.length === 0) return res.status(400).json({ error: 'لا توجد بيانات للتحديث' });
        values.push(id);
        await db.query('UPDATE medications SET ' + fields.join(', ') + ' WHERE id = ?', values);
        res.json({ success: true, message: 'تم تحديث الدواء بنجاح' });
    } catch (err) {
        console.error('❌ خطأ في تحديث دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const [existing] = await db.query(
            'SELECT id FROM medications WHERE id = ? AND patient_id = ?',
            [id, userId]
        );
        if (existing.length === 0) return res.status(404).json({ error: 'الدواء غير موجود أو لا ينتمي لك' });
        await db.query('DELETE FROM medications WHERE id = ?', [id]);
        res.json({ success: true, message: 'تم حذف الدواء بنجاح' });
    } catch (err) {
        console.error('❌ خطأ في حذف دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

router.patch('/:id/take', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const [existing] = await db.query(
            'SELECT id FROM medications WHERE id = ? AND patient_id = ?',
            [id, userId]
        );
        if (existing.length === 0) return res.status(404).json({ error: 'الدواء غير موجود أو لا ينتمي لك' });
        await db.query('UPDATE medications SET last_taken_at = NOW() WHERE id = ?', [id]);
        res.json({ success: true, message: 'تم تسجيل أخذ الجرعة' });
    } catch (err) {
        console.error('❌ خطأ في تسجيل أخذ الجرعة:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;
