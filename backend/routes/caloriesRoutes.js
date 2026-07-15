// backend/routes/caloriesRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// البحث عن طعام
router.get('/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ error: 'يرجى إدخال اسم الطعام (حرفان على الأقل)' });
        }
        const [rows] = await db.query(
            'SELECT * FROM foods WHERE name LIKE ? ORDER BY name ASC LIMIT 20',
            ['%' + q.trim() + '%']
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في البحث عن طعام:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// تسجيل وجبة
router.post('/log', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { food_id, quantity, meal_type, log_date } = req.body;
        if (!food_id || !quantity) {
            return res.status(400).json({ error: 'معرف الطعام والكمية مطلوبة' });
        }
        const [result] = await db.query(
            'INSERT INTO daily_food_log (user_id, food_id, quantity, meal_type, log_date) VALUES (?, ?, ?, ?, ?)',
            [userId, food_id, quantity, meal_type || 'snack', log_date || new Date().toISOString().split('T')[0]]
        );
        res.status(201).json({ success: true, message: 'تم تسجيل الوجبة', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في تسجيل الوجبة:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب سعرات يوم معين
router.get('/daily', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { date } = req.query;
        const targetDate = date || new Date().toISOString().split('T')[0];
        const [rows] = await db.query(
            'SELECT f.name, f.calories_per_unit, l.quantity, l.meal_type, (f.calories_per_unit * l.quantity) as total_calories FROM daily_food_log l JOIN foods f ON l.food_id = f.id WHERE l.user_id = ? AND l.log_date = ?',
            [userId, targetDate]
        );
        const total = rows.reduce((sum, row) => sum + parseFloat(row.total_calories || 0), 0);
        res.json({ success: true, data: rows, total_calories: total, date: targetDate });
    } catch (err) {
        console.error('❌ خطأ في جلب سعرات اليوم:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب سعرات الأسبوع (لرسم بياني)
router.get('/week', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT log_date, SUM(f.calories_per_unit * l.quantity) as total FROM daily_food_log l JOIN foods f ON l.food_id = f.id WHERE l.user_id = ? AND l.log_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) GROUP BY log_date ORDER BY log_date ASC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب سعرات الأسبوع:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;
