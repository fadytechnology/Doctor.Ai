// ============================================================
// ===== controllers/pharmacyController.js =====
// ============================================================

const db = require('../config/db');

// ----- جلب بيانات الصيدلي (البروفايل) -----
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT u.id, u.full_name, u.email, u.phone, p.name, p.address, p.working_hours FROM users u JOIN pharmacies p ON u.id = p.user_id WHERE u.id = ?',
            [req.userId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ success: false, message: 'الصيدلي غير موجود' });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ خطأ في جلب بروفايل الصيدلي:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب جميع منتجات الصيدلي (المخزون) -----
exports.getInventory = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT d.id, d.name, d.active_substance, pi.quantity, pi.price, pi.expiry_date
             FROM pharmacy_inventory pi
             JOIN drugs d ON pi.drug_id = d.id
             JOIN pharmacies p ON pi.pharmacy_id = p.id
             WHERE p.user_id = ?`,
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ في جلب المخزون:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- إضافة منتج جديد للمخزون -----
exports.addInventoryItem = async (req, res) => {
    try {
        const { drug_id, quantity, price, expiry_date } = req.body;
        if (!drug_id || !quantity || !price) {
            return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        }
        // جلب pharmacy_id من user_id
        const [pharmacy] = await db.query('SELECT id FROM pharmacies WHERE user_id = ?', [req.userId]);
        if (pharmacy.length === 0) {
            return res.status(404).json({ success: false, message: 'الصيدلية غير موجودة' });
        }
        const pharmacy_id = pharmacy[0].id;

        // إضافة أو تحديث الكمية (UPSERT)
        await db.query(
            `INSERT INTO pharmacy_inventory (pharmacy_id, drug_id, quantity, price, expiry_date)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), price = VALUES(price), expiry_date = VALUES(expiry_date)`,
            [pharmacy_id, drug_id, quantity, price, expiry_date || null]
        );
        res.json({ success: true, message: 'تم إضافة المنتج بنجاح' });
    } catch (error) {
        console.error('❌ خطأ في إضافة منتج:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب طلبات الصيدلي (من قاعدة البيانات) -----
exports.getOrders = async (req, res) => {
    try {
        const [rows] = await db.query(
            `SELECT o.id, o.patient_id, u.full_name AS patient_name, o.drug_id, d.name AS drug_name,
                    o.quantity, o.total_price, o.status, o.created_at
             FROM orders o
             JOIN users u ON o.patient_id = u.id
             LEFT JOIN drugs d ON o.drug_id = d.id
             WHERE o.pharmacy_id = (SELECT id FROM pharmacies WHERE user_id = ?)
             ORDER BY o.created_at DESC`,
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ في جلب الطلبات:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- تحديث حالة طلب (للصيدلي) -----
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'processing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
        }
        // التحقق من أن الطلب خاص بهذا الصيدلي
        const [order] = await db.query(
            `SELECT o.id FROM orders o
             JOIN pharmacies p ON o.pharmacy_id = p.id
             WHERE o.id = ? AND p.user_id = ?`,
            [orderId, req.userId]
        );
        if (order.length === 0) {
            return res.status(403).json({ success: false, message: 'غير مصرح لك' });
        }
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
        res.json({ success: true, message: 'تم تحديث الحالة' });
    } catch (error) {
        console.error('❌ خطأ في تحديث حالة الطلب:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};