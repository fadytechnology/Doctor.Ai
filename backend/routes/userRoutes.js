const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// مسارات المستخدمين - ستُضاف لاحقاً
router.get('/me', auth, (req, res) => {
    res.json({ success: true, message: 'User routes working' });
});

module.exports = router;