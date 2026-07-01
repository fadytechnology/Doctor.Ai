const db = require('../config/db');

const ResetToken = {
    create: async (userId, token, expiresAt) => {
        await db.query(
            'INSERT INTO reset_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [userId, token, expiresAt]
        );
    },
    findByToken: async (token) => {
        const [rows] = await db.query(
            'SELECT * FROM reset_tokens WHERE token = ? AND expires_at > NOW()',
            [token]
        );
        return rows[0];
    },
    delete: async (token) => {
        await db.query('DELETE FROM reset_tokens WHERE token = ?', [token]);
    }
};
module.exports = ResetToken;