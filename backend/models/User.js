// ============================================================
// ===== نموذج المستخدم =====
// ============================================================

const db = require('../config/db');

const User = {
    // إنشاء مستخدم جديد
    create: async (userData) => {
        const { full_name, email, phone, password, role } = userData;
        const status = role === 'admin' ? 'active' : 'pending';
        const [result] = await db.query(
            `INSERT INTO users (full_name, email, phone, password, role, status)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [full_name, email, phone, password, role, status]
        );
        return result.insertId;
    },

    // البحث بالإيميل أو الهاتف
    findByEmailOrPhone: async (identifier) => {
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );
        return rows[0];
    },

    // البحث بالـ ID
    findById: async (id) => {
        const [rows] = await db.query(
            'SELECT id, full_name, email, phone, role, status, pharmacy_code, created_at FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    },

    // تحديث الحالة
    updateStatus: async (id, status) => {
        await db.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    },

    // جلب جميع المستخدمين
    findAll: async () => {
        const [rows] = await db.query(
            'SELECT id, full_name, email, phone, role, status, created_at FROM users'
        );
        return rows;
    },

    // جلب المستخدمين حسب الدور
    findByRole: async (role) => {
        const [rows] = await db.query(
            'SELECT id, full_name, email, phone, status, created_at FROM users WHERE role = ?',
            [role]
        );
        return rows;
    },

    // حذف مستخدم
    delete: async (id) => {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
    },

    // تحديث بيانات المستخدم
    update: async (id, data) => {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && key !== 'id' && key !== 'password') {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        if (fields.length === 0) return;
        values.push(id);
        await db.query(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values);
    },

    // دالة مساعدة للتحقق من وجود مستخدمين
    count: async () => {
        const [rows] = await db.query('SELECT COUNT(*) as total FROM users');
        return rows[0].total;
    }
};

module.exports = User;