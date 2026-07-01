const db = require('../config/db');
const ActivityLog = {
  create: async (userId, action, type, details) => {
    await db.query('INSERT INTO activity_logs (user_id, action, type, details) VALUES (?, ?, ?, ?)', [userId, action, type, details]);
  },
  getAll: async (limit = 100) => {
    const [rows] = await db.query('SELECT l.*, u.full_name as user_name FROM activity_logs l LEFT JOIN users u ON l.user_id = u.id ORDER BY l.created_at DESC LIMIT ?', [limit]);
    return rows;
  }
};
module.exports = ActivityLog;