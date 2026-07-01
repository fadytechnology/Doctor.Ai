// ============================================================
// ===== نموذج عروض B2B =====
// ============================================================

const db = require('../config/db');

const B2BListing = {
    // إنشاء عرض جديد
    create: async (data) => {
        const {
            provider_id,
            provider_type, // clinic, lab, radiology
            title,
            description,
            service_type,
            price,
            availability,
            valid_until
        } = data;

        const [result] = await db.query(
            `INSERT INTO b2b_listings 
             (provider_id, provider_type, title, description, service_type, price, availability, valid_until)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [provider_id, provider_type, title, description, service_type, price, availability, valid_until]
        );
        return result.insertId;
    },

    // جلب جميع العروض النشطة
    getAllActive: async () => {
        const [rows] = await db.query(
            `SELECT l.*, u.full_name as provider_name, u.phone as provider_phone
             FROM b2b_listings l
             LEFT JOIN users u ON l.provider_id = u.id
             WHERE l.status = 'active' AND (l.valid_until IS NULL OR l.valid_until > NOW())
             ORDER BY l.created_at DESC`
        );
        return rows;
    },

    // جلب عروض مزود معين
    getByProvider: async (providerId) => {
        const [rows] = await db.query(
            `SELECT * FROM b2b_listings WHERE provider_id = ? ORDER BY created_at DESC`,
            [providerId]
        );
        return rows;
    },

    // جلب عرض معين
    getById: async (id) => {
        const [rows] = await db.query(
            `SELECT l.*, u.full_name as provider_name, u.phone as provider_phone
             FROM b2b_listings l
             LEFT JOIN users u ON l.provider_id = u.id
             WHERE l.id = ?`,
            [id]
        );
        return rows[0];
    },

    // تحديث العرض
    update: async (id, data) => {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }
        if (fields.length === 0) return;
        values.push(id);
        await db.query(
            `UPDATE b2b_listings SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
            values
        );
    },

    // حذف عرض
    delete: async (id) => {
        await db.query('DELETE FROM b2b_listings WHERE id = ?', [id]);
    },

    // جلب العروض حسب النوع
    getByType: async (serviceType) => {
        const [rows] = await db.query(
            `SELECT l.*, u.full_name as provider_name
             FROM b2b_listings l
             LEFT JOIN users u ON l.provider_id = u.id
             WHERE l.service_type = ? AND l.status = 'active'
             ORDER BY l.created_at DESC`,
            [serviceType]
        );
        return rows;
    }
};

module.exports = B2BListing;