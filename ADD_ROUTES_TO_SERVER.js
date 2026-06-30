// ============================================================
// ===== أضف هذه المسارات في server.js =====
// ============================================================

const prescriptionRoutes = require('./routes/prescriptionRoutes');
const labOrderRoutes = require('./routes/labOrderRoutes');
const walletRoutes = require('./routes/walletRoutes');

app.use('/api/prescriptions', prescriptionRoutes);
app.use('/api/lab-orders', labOrderRoutes);
app.use('/api/wallet', walletRoutes);