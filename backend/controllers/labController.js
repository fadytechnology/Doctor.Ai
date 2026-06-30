// ============================================================
// ===== controllers/labController.js =====
// ============================================================

const db = require('../config/db');

// ----- جلب بروفايل المعمل -----
exports.getProfile = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT u.id, u.full_name, u.email, u.phone, l.name, l.address, l.certificate FROM users u JOIN labs l ON u.id = l.user_id WHERE u.id = ?',
            [req.userId]
        );
        if (rows.length === 0) return res.status(404).json({ success: false, message: 'غير موجود' });
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب العينات -----
exports.getSamples = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT s.*, u.full_name as patient_name FROM lab_samples s JOIN users u ON s.patient_id = u.id WHERE s.lab_id = (SELECT id FROM labs WHERE user_id = ?) ORDER BY s.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- تسجيل نتيجة تحليل -----
exports.addResult = async (req, res) => {
    try {
        const { sample_id, result, notes } = req.body;
        if (!sample_id || !result) return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        await db.query(
            'UPDATE lab_samples SET result = ?, notes = ?, status = ? WHERE id = ? AND lab_id = (SELECT id FROM labs WHERE user_id = ?)',
            [result, notes || '', 'completed', sample_id, req.userId]
        );
        res.json({ success: true, message: 'تم تسجيل النتيجة' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- مسار اختبار -----
exports.test = async (req, res) => {
    res.json({ success: true, message: '✅ Lab Controller شغال!' });
};