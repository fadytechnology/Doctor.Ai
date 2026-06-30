const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.get('/', auth, (req, res) => {
    res.json({ success: true, message: 'Supplier routes working' });
});

module.exports = router;