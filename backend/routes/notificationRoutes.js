const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const { sendNotification, getUserNotifications, markRead } = require('../controllers/notificationController');
router.post('/', auth, roleCheck(['admin']), sendNotification);
router.get('/', auth, getUserNotifications);
router.put('/:id', auth, markRead);
module.exports = router;