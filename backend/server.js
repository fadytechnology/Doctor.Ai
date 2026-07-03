// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== المسارات الأساسية (اللي شغالة 100%) =====
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

// ===== المسارات الجديدة (علقها دلوقتي) =====
// const orderRoutes = require('./routes/orderRoutes');
// const b2bRoutes = require('./routes/b2bRoutes');
// const prescriptionRoutes = require('./routes/prescriptionRoutes');
// const labOrderRoutes = require('./routes/labOrderRoutes');
// const walletRoutes = require('./routes/walletRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const passwordRoutes = require('./routes/passwordRoutes');
// const adminRoutes = require('./routes/adminRoutes');
// const clinicRoutes = require('./routes/clinicRoutes');
// const labRoutes = require('./routes/labRoutes');
// const patientRoutes = require('./routes/patientRoutes');
// const pharmacyRoutes = require('./routes/pharmacyRoutes');
// const radiologyRoutes = require('./routes/radiologyRoutes');
// const supplierRoutes = require('./routes/supplierRoutes');
// const notificationRoutes = require('./routes/notificationRoutes');

// ===== تعريف المسارات =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// ===== المسارات الجديدة (علقها) =====
// app.use('/api/orders', orderRoutes);
// app.use('/api/b2b', b2bRoutes);
// app.use('/api/prescriptions', prescriptionRoutes);
// app.use('/api/lab-orders', labOrderRoutes);
// app.use('/api/wallet', walletRoutes);

// ===== خدمة الملفات الثابتة =====
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});