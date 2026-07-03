// backend/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// إنشاء تجمع اتصالات (Connection Pool) لقاعدة البيانات
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'doctor_ai_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// اختبار الاتصال (اختياري ولكن مفيد)
(async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully!');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  }
})();

module.exports = pool;