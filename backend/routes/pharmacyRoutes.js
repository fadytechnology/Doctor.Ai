const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// جلب جميع الصيدليات
router.get('/', auth, async (req, res) => {
    try {
        // هنا هتجيب البيانات من قاعدة البيانات
        res.json({ success: true, message: 'List of pharmacies' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;