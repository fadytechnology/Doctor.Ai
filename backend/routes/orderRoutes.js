// ============================================================
// ===== مسارات الطلبات =====
// ============================================================

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const {
    createOrder,
    getPatientOrders,
    getPharmacyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders
} = require('../controllers/orderController');

// ===== مسارات المرضى =====
router.post('/', auth, roleCheck(['patient']), createOrder);
router.get('/patient', auth, roleCheck(['patient']), getPatientOrders);

// ===== مسارات الصيادلة =====
router.get('/pharmacy', auth, roleCheck(['pharmacy']), getPharmacyOrders);

// ===== مسار للمدير =====
router.get('/all', auth, roleCheck(['admin']), getAllOrders);

// ===== مسارات مشتركة =====
router.get('/:id', auth, getOrderById);
router.put('/:id/status', auth, updateOrderStatus);

module.exports = router;