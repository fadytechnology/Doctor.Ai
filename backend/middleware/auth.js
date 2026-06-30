// ============================================================
// ===== ميدل وير المصادقة (التحقق من JWT) =====
// ============================================================

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'غير مصرح، يرجى تسجيل الدخول'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'doctor_ai_secret_2026');
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'توكن غير صالح أو منتهي الصلاحية'
        });
    }
};