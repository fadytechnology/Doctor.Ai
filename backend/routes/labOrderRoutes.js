const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/labOrderController');

router.post('/lab', auth, controller.createLabOrder);
router.get('/lab', auth, controller.getLabOrders);
router.put('/lab/:id', auth, controller.updateLabResult);
router.post('/radiology', auth, controller.createRadiologyOrder);
router.get('/radiology', auth, controller.getRadiologyOrders);
router.put('/radiology/:id', auth, controller.updateRadiologyReport);

module.exports = router;