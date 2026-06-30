// ============================================================
// ===== controllers/prescriptionController.js =====
// ============================================================

const db = require('../config/db');

// ----- كتابة روشتة جديدة (للعيادة) -----
exports.createPrescription = async (req, res) => {
    try {
        const { patient_id, pharmacy_id, diagnosis, drugs, notes } = req.body;
        if (!patient_id || !diagnosis) {
            return res.status(400).json({ success: false, message: 'البيانات ناقصة' });
        }

        const clinic_id = await db.query('SELECT id FROM clinics WHERE user_id = ?', [req.userId]);
        if (clinic_id[0].length === 0) {
            return res.status(404).json({ success: false, message: 'العيادة غير موجودة' });
        }

        const [result] = await db.query(
            'INSERT INTO prescriptions (clinic_id, patient_id, pharmacy_id, diagnosis, notes, status) VALUES (?, ?, ?, ?, ?, ?)',
            [clinic_id[0][0].id, patient_id, pharmacy_id || null, diagnosis, notes || '', 'pending']
        );

        const prescriptionId = result.insertId;

        // إضافة الأدوية
        if (drugs && drugs.length > 0) {
            for (const drug of drugs) {
                await db.query(
                    'INSERT INTO prescription_items (prescription_id, drug_id, quantity, dosage) VALUES (?, ?, ?, ?)',
                    [prescriptionId, drug.drug_id, drug.quantity || 1, drug.dosage || '']
                );
            }
        }

        res.json({ success: true, message: '✅ تم إضافة الروشتة', prescriptionId });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب روشتات العيادة -----
exports.getClinicPrescriptions = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT p.*, u.full_name as patient_name FROM prescriptions p JOIN users u ON p.patient_id = u.id WHERE p.clinic_id = (SELECT id FROM clinics WHERE user_id = ?) ORDER BY p.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب روشتات المريض -----
exports.getPatientPrescriptions = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT p.*, c.name as clinic_name FROM prescriptions p JOIN clinics c ON p.clinic_id = c.id WHERE p.patient_id = ? ORDER BY p.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- جلب روشتات الصيدلي -----
exports.getPharmacyPrescriptions = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT p.*, u.full_name as patient_name, c.name as clinic_name FROM prescriptions p JOIN users u ON p.patient_id = u.id JOIN clinics c ON p.clinic_id = c.id WHERE p.pharmacy_id = (SELECT id FROM pharmacies WHERE user_id = ?) ORDER BY p.created_at DESC',
            [req.userId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- تحديث حالة الروشتة (للصيدلي) -----
exports.updatePrescriptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const validStatuses = ['pending', 'approved', 'dispensed', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'حالة غير صالحة' });
        }

        await db.query(
            'UPDATE prescriptions SET status = ? WHERE id = ? AND pharmacy_id = (SELECT id FROM pharmacies WHERE user_id = ?)',
            [status, id, req.userId]
        );
        res.json({ success: true, message: '✅ تم تحديث حالة الروشتة' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- مسار اختبار -----
exports.test = async (req, res) => {
    res.json({ success: true, message: '✅ Prescription Controller شغال!' });
};