const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const controller = require('../controllers/walletController');

router.get('/', auth, controller.getWallet);
router.post('/add', auth, controller.addPoints);
router.post('/redeem', auth, controller.redeemPoints);

module.exports = router;