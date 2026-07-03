// backend/routes/labOrderRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const LabOrder = require('../models/LabOrder');

// إنشاء طلب مختبر جديد
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { patientId, tests, notes } = req.body;
    const doctorId = req.user.id;
    const newOrder = await LabOrder.create({ doctorId, patientId, tests, notes });
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب جميع طلبات المختبر لمريض
router.get('/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const orders = await LabOrder.findByPatient(patientId);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب طلب محدد
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await LabOrder.findById(id);
    if (!order) return res.status(404).json({ error: 'Lab order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تحديث حالة الطلب (مثل pending, completed, cancelled)
router.patch('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await LabOrder.updateStatus(id, status);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;