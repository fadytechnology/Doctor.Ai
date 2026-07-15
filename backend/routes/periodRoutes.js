// backend/routes/periodRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// تسجيل بداية دورة جديدة
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const { start_date, cycle_length, symptoms } = req.body;
        if (!start_date) {
            return res.status(400).json({ error: 'تاريخ بداية الدورة مطلوب' });
        }
        const [result] = await db.query(
            'INSERT INTO period_tracker (user_id, start_date, cycle_length, symptoms) VALUES (?, ?, ?, ?)',
            [userId, start_date, cycle_length || 28, symptoms || null]
        );
        res.status(201).json({ success: true, message: 'تم تسجيل الدورة', id: result.insertId });
    } catch (err) {
        console.error('❌ خطأ في تسجيل الدورة:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب تاريخ الدورات السابقة
router.get('/history', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT * FROM period_tracker WHERE user_id = ? ORDER BY start_date DESC',
            [userId]
        );
        res.json({ success: true, data: rows });
    } catch (err) {
        console.error('❌ خطأ في جلب تاريخ الدورات:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// جلب الموعد المتوقع للدورة القادمة
router.get('/next', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const [rows] = await db.query(
            'SELECT start_date, cycle_length FROM period_tracker WHERE user_id = ? ORDER BY start_date DESC LIMIT 1',
            [userId]
        );
        if (rows.length === 0) {
            return res.json({ success: true, data: null, message: 'لا توجد بيانات كافية للتوقع' });
        }
        const last = rows[0];
        const nextDate = new Date(last.start_date);
        nextDate.setDate(nextDate.getDate() + (last.cycle_length || 28));
        res.json({ success: true, data: { next_start_date: nextDate.toISOString().split('T')[0] } });
    } catch (err) {
        console.error('❌ خطأ في جلب الموعد المتوقع:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;
