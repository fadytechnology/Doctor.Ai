// ============================================================
// ===== وظائف مساعدة (Utils) =====
// ============================================================

// ----- ١. تنسيق التاريخ -----
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-EG', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// ----- ٢. تنسيق الوقت -----
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ar-EG', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ----- ٣. توليد رقم عشوائي (كود تعاون مثلاً) -----
function generateRandomCode(prefix = '', length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = prefix;
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// ----- ٤. التحقق من صحة البريد الإلكتروني -----
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// ----- ٥. التحقق من صحة رقم الهاتف المصري -----
function isValidEgyptianPhone(phone) {
    const regex = /^01[0-9]{9}$/;
    return regex.test(phone);
}

// ----- ٦. تحديث الإحصائيات في صفحات الفئات (وظيفة قابلة لإعادة الاستخدام) -----
function updateStats(statId, value) {
    const element = document.getElementById(statId);
    if (element) {
        element.textContent = value;
    }
}

console.log('✅ Utils.js loaded successfully!');