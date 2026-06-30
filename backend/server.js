// ============================================================
// ===== خادم Doctor.ai - النسخة النهائية =====
// ============================================================

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pharmacyRoutes = require('./routes/pharmacyRoutes');
const clinicRoutes = require('./routes/clinicRoutes');
const labRoutes = require('./routes/labRoutes');
const radiologyRoutes = require('./routes/radiologyRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===== الميدل وير =====
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ===== اختبار الاتصال بقاعدة البيانات =====
(async function testDB() {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');
    } catch (error) {
        console.error('❌ فشل الاتصال بقاعدة البيانات:', error.message);
    }
})();

// ===== المسارات (APIs) =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/pharmacy', pharmacyRoutes);
app.use('/api/clinic', clinicRoutes);
app.use('/api/lab', labRoutes);
app.use('/api/radiology', radiologyRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/admin', adminRoutes);

// ===== مسار الاختبار =====
app.get('/api/test', (req, res) => {
    res.json({
        success: true,
        message: '🚀 خادم Doctor.ai شغال!',
        time: new Date().toISOString()
    });
});

// ===== مسار للصحة (Health Check) =====
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', uptime: process.uptime() });
});

// ===== التعامل مع الأخطاء =====
app.use((err, req, res, next) => {
    console.error('❌ خطأ:', err.stack);
    res.status(500).json({
        success: false,
        message: 'حدث خطأ في السيرفر'
    });
});

// ===== تشغيل السيرفر =====
app.listen(PORT, () => {
    console.log(`🚀 خادم Doctor.ai شغال على http://localhost:${PORT}`);
    console.log(`📡 اختبره: http://localhost:${PORT}/api/test`);
});