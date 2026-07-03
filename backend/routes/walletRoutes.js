// backend/routes/walletRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Wallet = require('../models/Wallet');

// الحصول على رصيد المحفظة
router.get('/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const balance = await Wallet.getBalance(userId);
    res.json({ balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// إيداع مبلغ
router.post('/deposit', authenticateToken, async (req, res) => {
  try {
    const { amount, paymentMethod } = req.body;
    const userId = req.user.id;
    const transaction = await Wallet.deposit(userId, amount, paymentMethod);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// سحب مبلغ
router.post('/withdraw', authenticateToken, async (req, res) => {
  try {
    const { amount, bankAccount } = req.body;
    const userId = req.user.id;
    const transaction = await Wallet.withdraw(userId, amount, bankAccount);
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// سجل المعاملات
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const transactions = await Wallet.getTransactions(userId);
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;