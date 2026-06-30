const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.json({ success: true, message: 'Radiology routes working' });
});

module.exports = router;