const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
    try {
        const { full_name, email, phone, password, role } = req.body;

        // 1. تحقق من وجود البيانات
        if (!full_name || !email || !phone || !password || !role) {
            return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
        }

        // 2. تحقق من عدم تكرار البريد أو الهاتف
        const existing = await User.findByEmailOrPhone(email);
        if (existing) {
            return res.status(409).json({ success: false, message: 'البريد الإلكتروني أو رقم الهاتف مسجل بالفعل' });
        }

        // 3. تشفير كلمة السر
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. حفظ المستخدم
        const userId = await User.create({
            full_name,
            email,
            phone,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            userId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// تسجيل الدخول
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ success: false, message: 'البريد/الهاتف وكلمة السر مطلوبان' });
        }

        // البحث عن المستخدم
        const user = await User.findByEmailOrPhone(identifier);
        if (!user) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }

        // التحقق من كلمة السر
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }

        // التحقق من حالة الحساب
        if (user.status === 'pending') {
            return res.status(403).json({ success: false, message: 'حسابك قيد المراجعة من قبل الإدارة' });
        }
        if (user.status === 'inactive') {
            return res.status(403).json({ success: false, message: 'حسابك معطل، يرجى التواصل مع الإدارة' });
        }

        // إنشاء توكن JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};