// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // استيراد الاتصال بقاعدة البيانات

// ============================================================
// 1. دالة مساعدة لجلب الملف الشخصي حسب الدور
// ============================================================
async function getProfileByRole(userId, role) {
    let tableName = '';
    let idField = 'user_id';
    switch (role) {
        case 'pharmacy':
            tableName = 'pharmacies';
            break;
        case 'doctor':
            tableName = 'clinics';
            break;
        case 'lab':
            tableName = 'labs';
            break;
        case 'radiology':
            tableName = 'radiology_centers';
            break;
        case 'supplier':
            tableName = 'suppliers';
            break;
        default:
            return null; // مريض أو أي دور تاني
    }
    if (!tableName) return null;
    const [rows] = await db.query(`SELECT * FROM ${tableName} WHERE user_id = ?`, [userId]);
    return rows.length > 0 ? rows[0] : null;
}

// ============================================================
// 2. تسجيل الدخول (محدث)
// ============================================================
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ error: 'البريد الإلكتروني أو رقم الهاتف وكلمة المرور مطلوبة' });
        }

        // البحث عن المستخدم
        const [users] = await db.query(
            'SELECT * FROM users WHERE email = ? OR phone = ?',
            [identifier, identifier]
        );
        if (users.length === 0) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }

        const user = users[0];
        // التحقق من كلمة المرور
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'بيانات الدخول غير صحيحة' });
        }

        // جلب الملف الشخصي حسب الدور
        const profile = await getProfileByRole(user.id, user.role);

        // إنشاء التوكن
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        // إخفاء كلمة المرور
        const { password: _, ...userData } = user;

        res.json({
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: userData,
            profile: profile // بيانات الصيدلية/العيادة/المعمل إن وجدت
        });

    } catch (err) {
        console.error('❌ خطأ في تسجيل الدخول:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 3. جلب بيانات المستخدم الحالي (Me)
// ============================================================
router.get('/me', async (req, res) => {
    try {
        // استخراج التوكن من الهيدر
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'غير مصرح به، يرجى تسجيل الدخول' });
        }
        const token = authHeader.split(' ')[1];

        // التحقق من التوكن
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        } catch (err) {
            return res.status(403).json({ error: 'توكن غير صالح أو منتهي الصلاحية' });
        }

        const userId = decoded.id;
        const [users] = await db.query(
            'SELECT id, full_name, email, phone, role, status, latitude, longitude, address FROM users WHERE id = ?',
            [userId]
        );
        if (users.length === 0) {
            return res.status(404).json({ error: 'المستخدم غير موجود' });
        }

        const user = users[0];
        // جلب الملف الشخصي حسب الدور
        const profile = await getProfileByRole(user.id, user.role);

        res.json({
            user: user,
            profile: profile
        });

    } catch (err) {
        console.error('❌ خطأ في جلب البيانات:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 4. تسجيل مستخدم جديد (مع إمكانية تسجيل صيدلي/عيادة - اختياري)
// ============================================================
router.post('/register', async (req, res) => {
    try {
        const { full_name, email, phone, password, role, ...extraData } = req.body;

        if (!full_name || !email || !password || !role) {
            return res.status(400).json({ error: 'الاسم، البريد، كلمة المرور، والدور مطلوبة' });
        }

        // التحقق من عدم وجود المستخدم
        const [existing] = await db.query('SELECT id FROM users WHERE email = ? OR phone = ?', [email, phone]);
        if (existing.length > 0) {
            return res.status(409).json({ error: 'البريد الإلكتروني أو رقم الهاتف مسجل بالفعل' });
        }

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 10);

        // إدراج المستخدم
        const [result] = await db.query(
            `INSERT INTO users (full_name, email, phone, password, role, status)
             VALUES (?, ?, ?, ?, ?, 'active')`,
            [full_name, email, phone, hashedPassword, role]
        );
        const userId = result.insertId;

        // إذا كان المستخدم صيدلي أو عيادة، نضيف بياناته في الجدول المخصص (اختياري)
        if (role === 'pharmacy' && extraData.pharmacy_name) {
            await db.query(
                `INSERT INTO pharmacies (user_id, pharmacy_name, license_number, address, phone)
                 VALUES (?, ?, ?, ?, ?)`,
                [userId, extraData.pharmacy_name, extraData.license_number || 'TEMP', extraData.address || '', extraData.phone || '']
            );
        } else if ((role === 'doctor') && extraData.clinic_name) {
            await db.query(
                `INSERT INTO clinics (user_id, clinic_name, license_number, address, phone, specialty)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [userId, extraData.clinic_name, extraData.license_number || 'TEMP', extraData.address || '', extraData.phone || '', extraData.specialty || '']
            );
        }

        // إنشاء التوكن للمستخدم الجديد
        const token = jwt.sign(
            { id: userId, email, role },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: { id: userId, full_name, email, phone, role }
        });

    } catch (err) {
        console.error('❌ خطأ في التسجيل:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;