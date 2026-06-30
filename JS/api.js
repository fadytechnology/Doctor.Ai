// ============================================================
// ===== طبقة الاتصال بالسيرفر (API Service) =====
// ============================================================

const API_URL = 'http://localhost:5000/api';

// ----- إدارة التوكن -----
function getToken() {
    return localStorage.getItem('token');
}

function setToken(token) {
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
}

// ----- دالة الطلب العامة -----
async function request(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            // لو مفيش توكن وطلب محمي، نرجع error
            return { success: false, message: 'غير مصرح، يرجى تسجيل الدخول' };
        }
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بالسيرفر:', error);
        return { success: false, message: 'تعذر الاتصال بالسيرفر (هل هو شغال على port 5000؟)' };
    }
}

// ============================================================
// ===== دوال المصادقة (Authentication) =====
// ============================================================

// ----- تسجيل حساب جديد -----
async function apiRegister(userData) {
    return request('/auth/register', 'POST', userData);
}

// ----- تسجيل الدخول -----
async function apiLogin(identifier, password) {
    const result = await request('/auth/login', 'POST', { identifier, password });
    if (result.success && result.token) {
        setToken(result.token);
        localStorage.setItem('currentUser', JSON.stringify(result.user));
    }
    return result;
}

// ----- تسجيل الخروج -----
function apiLogout() {
    setToken(null);
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// ----- جلب بيانات المستخدم الحالي (مثال لطلب محمي) -----
async function apiGetProfile() {
    return request('/users/profile', 'GET', null, true);
}

// ============================================================
// ===== تصدير الدوال للاستخدام في الصفحات =====
// ============================================================

// عشان نقدر نستخدمها في الـ HTML العادي (غير module)
window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiLogout = apiLogout;
window.apiGetProfile = apiGetProfile;

console.log('✅ API Service loaded. Server URL:', API_URL);