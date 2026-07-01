// ============================================================
// ===== كونترولر المصادقة (تسجيل الدخول والتسجيل) =====
// ============================================================

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ===== دالة مساعدة لإنشاء مستخدم افتراضي =====
async function seedDefaultUsers() {
    try {
        const count = await User.count();
        if (count === 0) {
            console.log('🌱 لا يوجد مستخدمين، جاري إنشاء مستخدمين افتراضيين...');

            const users = [
                {
                    full_name: 'مدير النظام',
                    email: 'admin@doctor.ai',
                    phone: '01000000000',
                    password: await bcrypt.hash('admin123', 10),
                    role: 'admin',
                    status: 'active'
                },
                {
                    full_name: 'مريض تجريبي',
                    email: 'patient@doctor.ai',
                    phone: '01234567890',
                    password: await bcrypt.hash('123456', 10),
                    role: 'patient',
                    status: 'active'
                },
                {
                    full_name: 'صيدلي تجريبي',
                    email: 'pharmacy@doctor.ai',
                    phone: '01111111111',
                    password: await bcrypt.hash('pharmacy123', 10),
                    role: 'pharmacy',
                    status: 'active'
                }
            ];

            for (const user of users) {
                await User.create(user);
            }

            console.log('✅ تم إنشاء المستخدمين الافتراضيين بنجاح!');
            console.log('📝 Admin: admin@doctor.ai / admin123');
            console.log('📝 Patient: 01234567890 / 123456');
            console.log('📝 Pharmacy: 01111111111 / pharmacy123');
        }
    } catch (error) {
        console.error('⚠️ فشل في إنشاء المستخدمين الافتراضيين:', error.message);
    }
}

// ===== تسجيل مستخدم جديد =====
exports.register = async (req, res) => {
    try {
        const { full_name, email, phone, password, role } = req.body;

        if (!full_name || !email || !phone || !password || !role) {
            return res.status(400).json({
                success: false,
                message: 'جميع الحقول مطلوبة'
            });
        }

        const existing = await User.findByEmailOrPhone(email);
        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'البريد الإلكتروني أو رقم الهاتف مسجل بالفعل'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
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
        console.error('❌ خطأ في التسجيل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== تسجيل الدخول =====
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: 'البريد/الهاتف وكلمة السر مطلوبان'
            });
        }

        const user = await User.findByEmailOrPhone(identifier);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        if (user.status === 'pending') {
            return res.status(403).json({
                success: false,
                message: 'حسابك قيد المراجعة من قبل الإدارة'
            });
        }
        if (user.status === 'inactive') {
            return res.status(403).json({
                success: false,
                message: 'حسابك معطل، يرجى التواصل مع الإدارة'
            });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'doctor_ai_secret_2026',
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
                role: user.role,
                pharmacy_code: user.pharmacy_code
            }
        });
    } catch (error) {
        console.error('❌ خطأ في تسجيل الدخول:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب بيانات المستخدم الحالي =====
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }
        res.json({
            success: true,
            user
        });
    } catch (error) {
        console.error('❌ خطأ في جلب البروفايل:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== تشغيل البذور عند تحميل الكونترولر =====
seedDefaultUsers().catch(console.error);