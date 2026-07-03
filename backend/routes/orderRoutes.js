// backend/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');

// ===== إنشاء طلب جديد =====
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { patient_id, items, total, notes } = req.body;
    const user_id = req.user.id; // المستخدم الحالي (من التوكن)

    // التحقق من البيانات المطلوبة
    if (!patient_id || !items || !total) {
      return res.status(400).json({ error: 'patient_id, items, and total are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO orders (user_id, patient_id, items, total, notes, status)
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, patient_id, JSON.stringify(items), total, notes]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'Order created successfully' 
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== جلب جميع طلبات المستخدم الحالي =====
router.get('/my-orders', authenticateToken, async (req, res) => {
  try {
    const user_id = req.user.id;
    const [rows] = await db.query(
      `SELECT * FROM orders WHERE user_id = ? OR patient_id = ? ORDER BY created_at DESC`,
      [user_id, user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch orders error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== جلب طلب معين =====
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM orders WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch order error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== تحديث حالة الطلب =====
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: 'Status is required.' });
    }

    await db.query(`UPDATE orders SET status = ? WHERE id = ?`, [status, id]);
    res.json({ message: 'Order status updated successfully.' });
  } catch (err) {
    console.error('Update order status error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;