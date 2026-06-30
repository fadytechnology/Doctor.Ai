// ============================================================
// ===== controllers/supplierController.js =====
// ============================================================

const db = require('../config/db');

// ----- جلب بروفايل المورد -----
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT u.id, u.full_name, u.email, u.phone, s.company_name, s.address, s.license_number FROM users u JOIN suppliers s ON u.id = s.user_id WHERE u.id = ?',
            [req.userId]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب الأدوية المتاحة -----
exports.getMedicines = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM supplier_medicines WHERE supplier_id = (SELECT id FROM suppliers WHERE user_id = ?)',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- استقبال طلب من صيدلية -----
exports.receiveOrder = async (req, res) => {
    try {
        const { pharmacy_id, medicine_id, quantity } = req.body;
        if (!pharmacy_id || !medicine_id || !quantity) {
            return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        }
        await db.query(
            'INSERT INTO supplier_orders (supplier_id, pharmacy_id, medicine_id, quantity, status) VALUES ((SELECT id FROM suppliers WHERE user_id = ?), ?, ?, ?, ?)',
            [req.userId, pharmacy_id, medicine_id, quantity, 'pending']
        );
        res.json({ success: true, message: 'تم استقبال الطلب' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- مسار اختبار -----
exports.test = async (req, res) => {
    res.json({ success: true, message: '✅ Supplier Controller شغال!' });
};