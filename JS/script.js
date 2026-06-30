// ============================================================
// ===== جافا سكريبت العام (يستخدم في كل الصفحات) =====
// ============================================================

// ----- ١. التحقق من حالة المستخدم (هل هو مسجل الدخول؟) -----
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null || sessionStorage.getItem('currentUser') !== null;
}

// ----- ٢. جلب بيانات المستخدم الحالي -----
function getCurrentUser() {
    let userData = localStorage.getItem('currentUser');
    if (!userData) {
        userData = sessionStorage.getItem('currentUser');
    }
    return userData ? JSON.parse(userData) : null;
}

// ----- ٣. جلب التوكن -----
function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

// ----- ٤. تسجيل الخروج (يودي للصفحة الرئيسية) -----
function logout() {
    if (confirm('هل أنت متأكد من الخروج من حسابك؟')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('rememberMe');
        window.location.href = 'index.html';
    }
}

// ----- ٥. التوجيه حسب الفئة -----
function redirectToRoleDashboard(role) {
    const roleMap = {
        'patient': '../modules/patient/index.html',
        'pharmacy': '../modules/pharmacy/index.html',
        'clinic': '../modules/clinic/index.html',
        'lab': '../modules/lab/index.html',
        'radiology': '../modules/radiology/index.html',
        'supplier': '../modules/supplier/index.html',
        'admin': '../modules/admin/index.html'
    };
    const url = roleMap[role] || '../modules/patient/index.html';
    window.location.href = url;
}

// ----- ٦. رسالة تأكيد (Toast) -----
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 14px 24px;
        border-radius: 12px;
        color: #fff;
        font-size: 14px;
        font-weight: 600;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.15);
        animation: slideUp 0.4s ease;
        background: ${type === 'success' ? '#0d9488' : type === 'warning' ? '#d97706' : '#ef4444'};
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ----- ٧. تحميل الهيدر والفوتر تلقائياً -----
function loadSharedComponent(elementId, filePath, callback) {
    fetch(filePath)
        .then(response => response.text())
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
            if (callback) callback();
        })
        .catch(err => console.error(`خطأ في تحميل ${filePath}:`, err));
}

// ----- ٨. جلب دور المستخدم الحالي -----
function getCurrentUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

// ----- ٩. التحقق من أن المستخدم مسجل دخول -----
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'auth/login.html';
        return false;
    }
    return true;
}

// ----- ١٠. التحقق من دور معين (مثل admin) -----
function requireRole(requiredRole) {
    if (!requireAuth()) return false;
    const user = getCurrentUser();
    if (!user || user.role !== requiredRole) {
        alert('⚠️ غير مصرح لك بالدخول إلى هذه الصفحة');
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

// ----- ١١. دوال مساعدة للنماذج -----
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function isValidEgyptianPhone(phone) {
    const regex = /^01[0-9]{9}$/;
    return regex.test(phone);
}

function isValidPassword(password) {
    return password.length >= 8;
}

console.log('✅ Script.js loaded successfully! (Full version with admin support)');