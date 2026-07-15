// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const PORT = process.env.PORT || 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===== استيراد المسارات =====
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const statsRoutes = require('./routes/statsRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const chatRoutes = require('./routes/chatRoutes');

// ===== تعريف المسارات (API) =====
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/chat', chatRoutes);

// ===== المسارات المعلقة (يمكن تفعيلها لاحقاً) =====
// app.use('/api/orders', require('./routes/orderRoutes'));
// app.use('/api/b2b', require('./routes/b2bRoutes'));
// app.use('/api/prescriptions', require('./routes/prescriptionRoutes'));
// app.use('/api/lab-orders', require('./routes/labOrderRoutes'));
// app.use('/api/wallet', require('./routes/walletRoutes'));
// app.use('/api/profile', require('./routes/profileRoutes'));
// app.use('/api/password', require('./routes/passwordRoutes'));
// app.use('/api/admin', require('./routes/adminRoutes'));
// app.use('/api/clinic', require('./routes/clinicRoutes'));
// app.use('/api/lab', require('./routes/labRoutes'));
// app.use('/api/patient', require('./routes/patientRoutes'));
// app.use('/api/pharmacy', require('./routes/pharmacyRoutes'));
// app.use('/api/radiology', require('./routes/radiologyRoutes'));
// app.use('/api/supplier', require('./routes/supplierRoutes'));
// app.use('/api/notifications', require('./routes/notificationRoutes'));

// ===== خدمة الملفات الثابتة (لـ Frontend) =====
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ============================================================
// ===== Socket.io - الشات الفوري =====
// ============================================================
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// تخزين المستخدمين المتصلين
const onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('🟢 مستخدم متصل:', socket.id);

    socket.on('user-online', (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(`✅ المستخدم ${userId} متصل الآن`);
        io.emit('online-users', Array.from(onlineUsers.keys()));
    });

    socket.on('join-room', ({ roomId, userId }) => {
        socket.join(roomId);
        console.log(`📌 المستخدم ${userId} انضم للغرفة ${roomId}`);
    });

    socket.on('send-message', async ({ roomId, senderId, message, type = 'text' }) => {
        try {
            const db = require('./config/db');
            const [result] = await db.query(
                `INSERT INTO chat_messages (room_id, sender_id, message_type, content, is_read, created_at)
                 VALUES (?, ?, ?, ?, false, NOW())`,
                [roomId, senderId, type, message]
            );
            io.to(roomId).emit('receive-message', {
                id: result.insertId,
                senderId,
                message,
                type,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            console.error('❌ خطأ في حفظ الرسالة:', err);
        }
    });

    socket.on('mark-read', async ({ roomId, userId }) => {
        try {
            const db = require('./config/db');
            await db.query(
                `UPDATE chat_messages SET is_read = true
                 WHERE room_id = ? AND sender_id != ? AND is_read = false`,
                [roomId, userId]
            );
        } catch (err) {
            console.error('❌ خطأ في تحديث حالة القراءة:', err);
        }
    });

    socket.on('disconnect', () => {
        let disconnectedUser = null;
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                disconnectedUser = userId;
                onlineUsers.delete(userId);
                break;
            }
        }
        if (disconnectedUser) {
            console.log(`🔴 المستخدم ${disconnectedUser} غير متصل`);
            io.emit('online-users', Array.from(onlineUsers.keys()));
        }
    });
});

// ============================================================
// ===== تشغيل Scheduler (المهام المجدولة) =====
// ============================================================
const { startScheduler } = require('./services/notificationScheduler');
const biometricRoutes = require('./routes/biometricRoutes');
const medicalRecordsRoutes = require('./routes/medicalRecordsRoutes');
const medicationRoutes = require('./routes/medicationRoutes');
const caloriesRoutes = require('./routes/caloriesRoutes');
const periodRoutes = require('./routes/periodRoutes');
const babyRoutes = require('./routes/babyRoutes');
startScheduler();

// ============================================================
// ===== بدء تشغيل السيرفر (استخدام server.listen فقط) =====
// ============================================================
app.use('/api/biometric', biometricRoutes);
app.use('/api/medical-records', medicalRecordsRoutes);
app.use('/api/medications', medicationRoutes);
app.use('/api/calories', caloriesRoutes);
app.use('/api/period', periodRoutes);
app.use('/api/baby', babyRoutes);
server.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`✅ Socket.io is ready for real-time chat`);
});