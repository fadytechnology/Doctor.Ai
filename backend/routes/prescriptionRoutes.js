// backend/routes/prescriptionRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Prescription = require('../models/Prescription');

// إنشاء وصفة جديدة
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { patientId, medications, notes } = req.body;
    const doctorId = req.user.id;
    const newPrescription = await Prescription.create({
      doctorId,
      patientId,
      medications,
      notes,
    });
    res.status(201).json(newPrescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب وصفات مريض
router.get('/patient/:patientId', authenticateToken, async (req, res) => {
  try {
    const { patientId } = req.params;
    const prescriptions = await Prescription.findByPatient(patientId);
    res.json(prescriptions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب وصفة معينة
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const prescription = await Prescription.findById(id);
    if (!prescription) return res.status(404).json({ error: 'Prescription not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// تحديث وصفة
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updated = await Prescription.update(id, updates);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// حذف وصفة
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Prescription.delete(id);
    res.json({ message: 'Prescription deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;