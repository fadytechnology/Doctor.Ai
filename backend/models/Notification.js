const db = require('../config/db');
const Notification = {
  create: async (userId, title, message, link) => {
    await db.query('INSERT INTO notifications (user_id, title, message, link) VALUES (?, ?, ?, ?)', [userId, title, message, link]);
  },
  getByUser: async (userId) => {
    const [rows] = await db.query('SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return rows;
  }
};
module.exports = Notification;