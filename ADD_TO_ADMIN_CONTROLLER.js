// ============================================================
// ===== controllers/adminController.js (إضافة دوال الموافقات) =====
// ============================================================

// ----- إضافة هذه الدوال إلى adminController.js -----

// ----- جلب طلبات التسجيل المعلقة -----
exports.getPendingRegistrations = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT id, full_name, email, phone, role, status, created_at FROM users WHERE status = "pending"'
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- الموافقة على تسجيل مستخدم -----
exports.approveUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await db.query('UPDATE users SET status = "active" WHERE id = ?', [userId]);
        res.json({ success: true, message: '✅ تم الموافقة على المستخدم' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- رفض تسجيل مستخدم -----
exports.rejectUser = async (req, res) => {
    try {
        const { userId } = req.params;
        await db.query('UPDATE users SET status = "rejected" WHERE id = ?', [userId]);
        res.json({ success: true, message: '❌ تم رفض المستخدم' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};