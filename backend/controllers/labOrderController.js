// ============================================================
// ===== controllers/labOrderController.js =====
// ============================================================

const db = require('../config/db');

// ----- طلب تحليل جديد (من العيادة) -----
exports.createLabOrder = async (req, res) => {
    try {
        const { patient_id, test_type, notes } = req.body;
        if (!patient_id || !test_type) {
            return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        }

        const [result] = await db.query(
            'INSERT INTO lab_orders (clinic_id, patient_id, test_type, status, notes) VALUES ((SELECT id FROM clinics WHERE user_id = ?), ?, ?, ?, ?)',
            [req.userId, patient_id, test_type, 'pending', notes || '']
        );

        res.json({ success: true, message: '✅ تم إرسال طلب التحليل', orderId: result.insertId });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب طلبات التحليل للمعمل -----
exports.getLabOrders = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT lo.*, u.full_name as patient_name FROM lab_orders lo JOIN users u ON lo.patient_id = u.id WHERE lo.lab_id = (SELECT id FROM labs WHERE user_id = ?) ORDER BY lo.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- تحديث نتيجة التحليل -----
exports.updateLabResult = async (req, res) => {
    try {
        const { id } = req.params;
        const { result } = req.body;
        await db.query(
            'UPDATE lab_orders SET result = ?, status = ? WHERE id = ? AND lab_id = (SELECT id FROM labs WHERE user_id = ?)',
            [result, 'completed', id, req.userId]
        );
        res.json({ success: true, message: '✅ تم تحديث النتيجة' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- طلب أشعة جديد (من العيادة) -----
exports.createRadiologyOrder = async (req, res) => {
    try {
        const { patient_id, scan_type, notes } = req.body;
        if (!patient_id || !scan_type) {
            return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        }

        const [result] = await db.query(
            'INSERT INTO radiology_orders (clinic_id, patient_id, scan_type, status, notes) VALUES ((SELECT id FROM clinics WHERE user_id = ?), ?, ?, ?, ?)',
            [req.userId, patient_id, scan_type, 'pending', notes || '']
        );

        res.json({ success: true, message: '✅ تم إرسال طلب الأشعة', orderId: result.insertId });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب طلبات الأشعة لمركز الأشعة -----
exports.getRadiologyOrders = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT ro.*, u.full_name as patient_name FROM radiology_orders ro JOIN users u ON ro.patient_id = u.id WHERE ro.radiology_id = (SELECT id FROM radiology_centers WHERE user_id = ?) ORDER BY ro.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- تحديث تقرير الأشعة -----
exports.updateRadiologyReport = async (req, res) => {
    try {
        const { id } = req.params;
        const { report, images } = req.body;
        await db.query(
            'UPDATE radiology_orders SET report = ?, images = ?, status = ? WHERE id = ? AND radiology_id = (SELECT id FROM radiology_centers WHERE user_id = ?)',
            [report, images || '', 'completed', id, req.userId]
        );
        res.json({ success: true, message: '✅ تم تحديث التقرير' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};