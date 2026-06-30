const db = require('../config/db');

const User = {
    // إنشاء مستخدم جديد
    create: async (userData) => {
        const { full_name, email, phone, password, role } = userData;
        const [result] = await db.query(
            'INSERT INTO users (full_name, email, phone, password, role, status) VALUES (?, ?, ?, ?, ?, ?)',
            [full_name, email, phone, password, role, role === 'admin' ? 'active' : 'pending']
        );
        return result.insertId;
    },

    // البحث عن مستخدم بالإيميل أو رقم الهاتف
    findByEmailOrPhone: async (identifier) => {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );
        return rows[0];
    },

    // جلب مستخدم بـ ID
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, full_name, email, phone, role, status FROM users WHERE id = ?', [id]);
        return rows[0];
    },

    // تحديث حالة المستخدم
    updateStatus: async (id, status) => {
        await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    }
};

module.exports = User;