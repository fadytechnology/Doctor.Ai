// ============================================================
// ===== controllers/patientController.js =====
// ============================================================

const db = require('../config/db');

// ----- جلب بروفايل Patient -----
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, full_name, email, phone, role FROM users WHERE id = ?',
            [req.userId]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- مسار تجريبي للاختبار -----
exports.test = async (req, res) => {
    res.json({ success: true, message: '✅ Patient Controller شغال!' });
};
