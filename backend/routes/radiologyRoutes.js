// ============================================================
// ===== routes/radiologyRoutes.js =====
// ============================================================

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/radiologyController');

router.get('/profile', auth, controller.getProfile);
router.get('/test', auth, controller.test);

module.exports = router;
