const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/prescriptionController');

router.post('/', auth, controller.createPrescription);
router.get('/clinic', auth, controller.getClinicPrescriptions);
router.get('/patient', auth, controller.getPatientPrescriptions);
router.get('/pharmacy', auth, controller.getPharmacyPrescriptions);
router.put('/:id/status', auth, controller.updatePrescriptionStatus);
router.get('/test', auth, controller.test);

module.exports = router;