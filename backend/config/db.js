// ============================================================
// ===== اتصال قاعدة البيانات =====
// ============================================================

const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'doctor_ai_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
});

const promisePool = pool.promise();

// اختبار الاتصال
(async function testConnection() {
    try {
        await promisePool.query('SELECT 1');
        console.log('✅ MySQL متصل بنجاح');
    } catch (error) {
        console.error('❌ فشل الاتصال بـ MySQL:', error.message);
    }
})();

module.exports = promisePool;