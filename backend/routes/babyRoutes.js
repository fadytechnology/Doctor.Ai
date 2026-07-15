// backend/routes/babyRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// إضافة طفل جديد
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { baby_name, birth_date, weight, height } = req.body;
        if (!baby_name || !birth_date) {
            return res.status(400).json({ error: 'اسم الطفل وتاريخ الميلاد مطلوبة' });
        }
        const [result] = await db.query(
            'INSERT INTO baby_care (user_id, baby_name, birth_date, weight, height) VALUES (?, ?, ?, ?, ?)',
            [userId, baby_name, birth_date, weight || null, height || null]
        );
        res.status(201).json({ success: true, message: 'تم إضافة الطفل', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في إضافة طفل:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب بيانات الأطفال
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM baby_care WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب بيانات الأطفال:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// تسجيل تطعيم جديد
router.post('/vaccination', authenticateToken, async (req, res) => {
    try {
        const { baby_id, vaccine_name, date_given, next_due_date, notes } = req.body;
        if (!baby_id || !vaccine_name) {
            return res.status(400).json({ error: 'معرف الطفل واسم التطعيم مطلوبة' });
        }
        const [result] = await db.query(
            'INSERT INTO baby_vaccinations (baby_id, vaccine_name, date_given, next_due_date, notes) VALUES (?, ?, ?, ?, ?)',
            [baby_id, vaccine_name, date_given || null, next_due_date || null, notes || null]
        );
        res.status(201).json({ success: true, message: 'تم تسجيل التطعيم', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في تسجيل تطعيم:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب التطعيمات القادمة
router.get('/vaccinations/upcoming', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT v.*, b.baby_name FROM baby_vaccinations v JOIN baby_care b ON v.baby_id = b.id WHERE b.user_id = ? AND (v.next_due_date >= CURDATE() OR v.next_due_date IS NULL) ORDER BY v.next_due_date ASC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب التطعيمات القادمة:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;
