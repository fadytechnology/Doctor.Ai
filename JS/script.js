// ============================================================
// ===== جافا سكريبت العام (يستخدم في كل الصفحات) =====
// ============================================================

function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null || sessionStorage.getItem('currentUser') !== null;
}

function getCurrentUser() {
    let userData = localStorage.getItem('currentUser');
    if (!userData) userData = sessionStorage.getItem('currentUser');
    return userData ? JSON.parse(userData) : null;
}

function getAuthToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function logout() {
    if (confirm('هل أنت متأكد من الخروج من حسابك؟')) {
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        window.location.href = '../index.html';
    }
}

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
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; setTimeout(() => toast.remove(), 300); }, 3000);
}

function getCurrentUserRole() {
    const user = getCurrentUser();
    return user ? user.role : null;
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

function requireRole(requiredRole) {
    if (!requireAuth()) return false;
    const user = getCurrentUser();
    if (!user || user.role !== requiredRole) {
        alert('⚠️ غير مصرح لك بالدخول إلى هذه الصفحة');
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

console.log('✅ Script.js loaded successfully!');