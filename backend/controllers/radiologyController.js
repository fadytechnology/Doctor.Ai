// ============================================================
// ===== controllers/radiologyController.js =====
// ============================================================

const db = require('../config/db');

// ----- جلب بروفايل المركز -----
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT u.id, u.full_name, u.email, u.phone, r.name, r.address, r.equipment FROM users u JOIN radiology_centers r ON u.id = r.user_id WHERE u.id = ?',
            [req.userId]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب الحجوزات -----
exports.getBookings = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT b.*, u.full_name as patient_name FROM radiology_bookings b JOIN users u ON b.patient_id = u.id WHERE b.radiology_id = (SELECT id FROM radiology_centers WHERE user_id = ?) ORDER BY b.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- رفع تقرير -----
exports.uploadReport = async (req, res) => {
    try {
        const { booking_id, report, images } = req.body;
        if (!booking_id || !report) return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        await db.query(
            'UPDATE radiology_bookings SET report = ?, images = ?, status = ? WHERE id = ? AND radiology_id = (SELECT id FROM radiology_centers WHERE user_id = ?)',
            [report, images || '', 'completed', booking_id, req.userId]
        );
        res.json({ success: true, message: 'تم رفع التقرير' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- مسار اختبار -----
exports.test = async (req, res) => {
    res.json({ success: true, message: '✅ Radiology Controller شغال!' });
};