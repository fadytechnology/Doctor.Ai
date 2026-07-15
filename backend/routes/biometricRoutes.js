// backend/routes/biometricRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// جلب أحدث قياس
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM biometric_measurements WHERE user_id = ? ORDER BY created_at DESC LIMIT 1',
            [userId]
        );
        res.json({ success: true, data: rows[0] || null });
    } catch (err) {
        console.error('❌ خطأ في جلب القياسات:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// حفظ قياس جديد
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { weight, height, blood_pressure_systolic, blood_pressure_diastolic, sugar, heart_rate, oxygen } = req.body;
        if (!weight && !height && !blood_pressure_systolic && !sugar) {
            return res.status(400).json({ error: 'يجب إدخال قياس واحد على الأقل' });
        }
        const [result] = await db.query(
            'INSERT INTO biometric_measurements (user_id, weight, height, blood_pressure_systolic, blood_pressure_diastolic, sugar, heart_rate, oxygen) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, weight || null, height || null, blood_pressure_systolic || null, blood_pressure_diastolic || null, sugar || null, heart_rate || null, oxygen || null]
        );
        res.status(201).json({ success: true, message: 'تم حفظ القياس بنجاح', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في حفظ القياس:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب تاريخ القياسات
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit = 30, type = 'weight' } = req.query;
        const allowedTypes = ['weight', 'height', 'blood_pressure_systolic', 'blood_pressure_diastolic', 'sugar', 'heart_rate', 'oxygen'];
        if (!allowedTypes.includes(type)) {
            return res.status(400).json({ error: 'نوع القياس غير صحيح' });
        }
        const [rows] = await db.query(
            'SELECT created_at, ' + type + ' as value FROM biometric_measurements WHERE user_id = ? AND ' + type + ' IS NOT NULL ORDER BY created_at DESC LIMIT ?',
            [userId, parseInt(limit)]
        );
        rows.reverse();
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب تاريخ القياسات:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;
