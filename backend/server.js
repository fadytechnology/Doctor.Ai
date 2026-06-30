const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ميدل وير
app.use(cors());
app.use(express.json());

// المسارات
app.use('/api/auth', authRoutes);

// مسار اختبار
app.get('/api/test', (req, res) => {
    res.json({ success: true, message: '🚀 السيرفر شغال وقاعدة البيانات متصلة!' });
});

// تشغيل السيرفر
app.listen(PORT, () => {
    console.log(`🚀 خادم Doctor.ai شغال على http://localhost:${PORT}`);
    console.log(`📡 اختبره: http://localhost:${PORT}/api/test`);
});