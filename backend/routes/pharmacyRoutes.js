// ============================================================
// ===== routes/pharmacyRoutes.js =====
// ============================================================

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const pharmacyController = require('../controllers/pharmacyController');

// جميع المسارات محمية بـ auth
router.get('/profile', auth, pharmacyController.getProfile);
router.get('/inventory', auth, pharmacyController.getInventory);
router.post('/inventory', auth, pharmacyController.addInventoryItem);
router.get('/orders', auth, pharmacyController.getOrders);
router.put('/orders/:orderId/status', auth, pharmacyController.updateOrderStatus);

module.exports = router;