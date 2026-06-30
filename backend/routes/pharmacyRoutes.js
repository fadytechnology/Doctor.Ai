const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// مسارات الصيدليات - ستُضاف لاحقاً
router.get('/', auth, (req, res) => {
    res.json({ success: true, message: 'Pharmacy routes working' });
});

module.exports = router;