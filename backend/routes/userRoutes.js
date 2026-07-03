// backend/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');

// ===== جلب جميع المستخدمين (للمشرفين فقط) =====
router.get('/', authenticateToken, async (req, res) => {
  try {
    // التحقق من أن المستخدم الحالي هو admin (اختياري)
    const [rows] = await db.query(
      `SELECT id, full_name, email, phone, role, status, created_at 
       FROM users 
       ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== جلب مستخدم معين =====
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      `SELECT id, full_name, email, phone, role, status, created_at 
       FROM users 
       WHERE id = ?`,
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== تحديث بيانات المستخدم =====
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, phone, role, status } = req.body;

    // التأكد من أن المستخدم يحدث نفسه أو أنه admin
    if (parseInt(id) !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this user.' });
    }

    // بناء استعلام التحديث ديناميكياً
    const fields = [];
    const values = [];
    if (full_name) { fields.push('full_name = ?'); values.push(full_name); }
    if (phone) { fields.push('phone = ?'); values.push(phone); }
    if (role) { fields.push('role = ?'); values.push(role); }
    if (status) { fields.push('status = ?'); values.push(status); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update.' });
    }

    values.push(id);
    await db.query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({ message: 'User updated successfully.' });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== حذف مستخدم =====
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // منع المستخدم من حذف نفسه
    if (parseInt(id) === req.user.id) {
      return res.status(403).json({ error: 'You cannot delete your own account.' });
    }

    await db.query(`DELETE FROM users WHERE id = ?`, [id]);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;