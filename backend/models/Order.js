// ============================================================
// ===== نموذج الطلبات =====
// ============================================================

const db = require('../config/db');

const Order = {
    // إنشاء طلب جديد
    create: async (orderData) => {
        const {
            patient_id,
            pharmacy_id,
            items, // JSON array
            total_amount,
            notes,
            prescription_url
        } = orderData;

        const [result] = await db.query(
            `INSERT INTO orders 
             (patient_id, pharmacy_id, items, total_amount, status, notes, prescription_url)
             VALUES (?, ?, ?, ?, 'pending', ?, ?)`,
            [patient_id, pharmacy_id, JSON.stringify(items), total_amount, notes, prescription_url]
        );
        return result.insertId;
    },

    // جلب طلبات المريض
    getPatientOrders: async (patientId) => {
        const [rows] = await db.query(
            `SELECT o.*, u.full_name as pharmacy_name 
             FROM orders o
             LEFT JOIN users u ON o.pharmacy_id = u.id
             WHERE o.patient_id = ?
             ORDER BY o.created_at DESC`,
            [patientId]
        );
        return rows;
    },

    // جلب طلبات الصيدلي
    getPharmacyOrders: async (pharmacyId) => {
        const [rows] = await db.query(
            `SELECT o.*, u.full_name as patient_name, u.phone as patient_phone
             FROM orders o
             LEFT JOIN users u ON o.patient_id = u.id
             WHERE o.pharmacy_id = ?
             ORDER BY o.created_at DESC`,
            [pharmacyId]
        );
        return rows;
    },

    // جلب طلب معين
    getById: async (orderId) => {
        const [rows] = await db.query(
            `SELECT o.*, 
                    p.full_name as patient_name, p.phone as patient_phone,
                    ph.full_name as pharmacy_name, ph.phone as pharmacy_phone
             FROM orders o
             LEFT JOIN users p ON o.patient_id = p.id
             LEFT JOIN users ph ON o.pharmacy_id = ph.id
             WHERE o.id = ?`,
            [orderId]
        );
        return rows[0];
    },

    // تحديث حالة الطلب
    updateStatus: async (orderId, status, updatedBy) => {
        await db.query(
            `UPDATE orders SET status = ?, updated_by = ?, updated_at = NOW()
             WHERE id = ?`,
            [status, updatedBy, orderId]
        );
    },

    // جلب جميع الطلبات (للمدير)
    getAll: async () => {
        const [rows] = await db.query(
            `SELECT o.*, 
                    p.full_name as patient_name,
                    ph.full_name as pharmacy_name
             FROM orders o
             LEFT JOIN users p ON o.patient_id = p.id
             LEFT JOIN users ph ON o.pharmacy_id = ph.id
             ORDER BY o.created_at DESC`
        );
        return rows;
    },

    // جلب الطلبات حسب الحالة
    getByStatus: async (status) => {
        const [rows] = await db.query(
            `SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC`,
            [status]
        );
        return rows;
    },

    // تحديث بيانات الطلب
    update: async (orderId, data) => {
        const fields = [];
        const values = [];
        for (const [key, value] of Object.entries(data)) {
            if (value !== undefined && key !== 'id') {
                fields.push(`${key} = ?`);
                values.push(key === 'items' ? JSON.stringify(value) : value);
            }
        }
        if (fields.length === 0) return;
        values.push(orderId);
        await db.query(
            `UPDATE orders SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
            values
        );
    },

    // حذف طلب
    delete: async (orderId) => {
        await db.query('DELETE FROM orders WHERE id = ?', [orderId]);
    }
};

module.exports = Order;