// backend/routes/b2bRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const db = require('../config/db');

// ===== إنشاء قائمة B2B جديدة =====
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, price, category, contact_info } = req.body;
    const user_id = req.user.id;

    // التحقق من البيانات المطلوبة
    if (!title || !description || !price || !category) {
      return res.status(400).json({ error: 'title, description, price, and category are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO b2b_listings (user_id, title, description, price, category, contact_info, status)
       VALUES (?, ?, ?, ?, ?, ?, 'active')`,
      [user_id, title, description, price, category, contact_info || null]
    );

    res.status(201).json({ 
      id: result.insertId, 
      message: 'B2B listing created successfully' 
    });
  } catch (err) {
    console.error('Create B2B listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== جلب جميع قوائم B2B =====
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT * FROM b2b_listings WHERE status = 'active' ORDER BY created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch B2B listings error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== جلب قائمة B2B معينة =====
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`SELECT * FROM b2b_listings WHERE id = ?`, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('Fetch B2B listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== تحديث قائمة B2B =====
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, category, contact_info, status } = req.body;

    // التحقق من أن المستخدم هو صاحب القائمة (اختياري، حسب الحاجة)
    const [listing] = await db.query(`SELECT user_id FROM b2b_listings WHERE id = ?`, [id]);
    if (listing.length === 0) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    if (listing[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to update this listing.' });
    }

    await db.query(
      `UPDATE b2b_listings 
       SET title = ?, description = ?, price = ?, category = ?, contact_info = ?, status = ?
       WHERE id = ?`,
      [title || listing[0].title, description || listing[0].description, 
       price || listing[0].price, category || listing[0].category,
       contact_info || listing[0].contact_info, status || listing[0].status, id]
    );

    res.json({ message: 'B2B listing updated successfully.' });
  } catch (err) {
    console.error('Update B2B listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

// ===== حذف قائمة B2B =====
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    // التأكد من أن المستخدم هو صاحب القائمة
    const [listing] = await db.query(`SELECT user_id FROM b2b_listings WHERE id = ?`, [id]);
    if (listing.length === 0) {
      return res.status(404).json({ error: 'Listing not found.' });
    }
    if (listing[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to delete this listing.' });
    }

    await db.query(`DELETE FROM b2b_listings WHERE id = ?`, [id]);
    res.json({ message: 'B2B listing deleted successfully.' });
  } catch (err) {
    console.error('Delete B2B listing error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;