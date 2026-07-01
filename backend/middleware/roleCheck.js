// ============================================================
// ===== ميدل وير التحقق من الصلاحيات حسب الدور =====
// ============================================================

const roleCheck = (allowedRoles) => {
    return (req, res, next) => {
        // التأكد من وجود المستخدم
        if (!req.userId || !req.userRole) {
            return res.status(401).json({
                success: false,
                message: 'غير مصرح، يرجى تسجيل الدخول'
            });
        }

        // التحقق من أن دور المستخدم مسموح به
        if (!allowedRoles.includes(req.userRole)) {
            return res.status(403).json({
                success: false,
                message: `غير مصرح، هذا المسار مخصص لـ: ${allowedRoles.join(' أو ')}`
            });
        }

        next();
    };
};

module.exports = roleCheck;