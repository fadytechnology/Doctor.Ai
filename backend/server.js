const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.json({ message: '🚀 Doctor.ai API is running', status: 'OK' });
});

app.listen(PORT, async () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    try {
        await db.query('SELECT 1');
        console.log('✅ Database connected successfully');
    } catch (err) {
        console.error('❌ Database connection failed:', err.message);
    }
});
// بعد authRoutes
const orderRoutes = require('./routes/orderRoutes');
const b2bRoutes = require('./routes/b2bRoutes');

// بعد app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/b2b', b2bRoutes);
const profileRoutes = require('./routes/profileRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

app.use('/api/profile', profileRoutes);
app.use('/api/password', passwordRoutes);