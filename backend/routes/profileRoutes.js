const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { updateProfile } = require('../controllers/profileController');
router.put('/', auth, updateProfile);
module.exports = router;