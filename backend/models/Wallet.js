// backend/models/Wallet.js
const db = require('../config/db');

class Wallet {
  static async getBalance(userId) {
    const [rows] = await db.query('SELECT balance FROM wallets WHERE user_id = ?', [userId]);
    if (rows.length === 0) {
      await db.query('INSERT INTO wallets (user_id, balance) VALUES (?, 0)', [userId]);
      return 0;
    }
    return rows[0].balance;
  }

  static async deposit(userId, amount, paymentMethod) {
    await db.query('UPDATE wallets SET balance = balance + ? WHERE user_id = ?', [amount, userId]);
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, type, amount, method, status, created_at) VALUES (?, "deposit", ?, ?, "completed", NOW())',
      [userId, amount, paymentMethod]
    );
    return { transactionId: result.insertId, message: 'Deposit successful' };
  }

  static async withdraw(userId, amount, bankAccount) {
    const balance = await this.getBalance(userId);
    if (balance < amount) throw new Error('Insufficient balance');
    await db.query('UPDATE wallets SET balance = balance - ? WHERE user_id = ?', [amount, userId]);
    const [result] = await db.query(
      'INSERT INTO transactions (user_id, type, amount, bank_account, status, created_at) VALUES (?, "withdraw", ?, ?, "pending", NOW())',
      [userId, amount, bankAccount]
    );
    return { transactionId: result.insertId, message: 'Withdrawal request submitted' };
  }

  static async getTransactions(userId) {
    const [rows] = await db.query('SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  }
}

module.exports = Wallet;node server.js