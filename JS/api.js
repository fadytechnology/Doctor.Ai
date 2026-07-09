// ============================================================
// ===== طبقة الاتصال بالسيرفر (API Service) =====
// ===== متوافقة مع الـ Backend الجديد (JWT + Roles) =====
// ============================================================

const API_URL = 'http://localhost:5000/api';

// ===== إدارة التوكن =====
function getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
}

function setToken(token, remember = false) {
    if (token) {
        if (remember) {
            localStorage.setItem('token', token);
            sessionStorage.removeItem('token');
        } else {
            sessionStorage.setItem('token', token);
            localStorage.removeItem('token');
        }
    } else {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }
}

// ===== دالة الطلب العامة (مع معالجة الأخطاء) =====
async function request(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = getToken();
        if (!token) {
            return { success: false, message: 'غير مصرح، يرجى تسجيل الدخول' };
        }
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            return {
                success: false,
                message: data.message || `خطأ في السيرفر (${response.status})`,
                status: response.status,
                details: data
            };
        }

        if (data && typeof data.success === 'undefined') {
            data.success = true;
        }
        return data;

    } catch (error) {
        console.error('❌ فشل الاتصال بالسيرفر:', error);
        return {
            success: false,
            message: 'تعذر الاتصال بالسيرفر. تأكد من تشغيله على http://localhost:5000'
        };
    }
}

// ============================================================
// ===== دوال المصادقة (متوافقة مع authRoutes.js) =====
// ============================================================

/**
 * تسجيل مستخدم جديد
 */
async function apiRegister(userData) {
    return request('/auth/register', 'POST', userData);
}

/**
 * تسجيل الدخول - يرسل identifier (إيميل أو هاتف) وكلمة مرور
 * ويخزن التوكن وبيانات المستخدم
 */
async function apiLogin(identifier, password, remember = false) {
    // 🔥 السيرفر ينتظر identifier وليس email أو phone
    const payload = {
        identifier: identifier,
        password: password
    };

    const result = await request('/auth/login', 'POST', payload);

    if (result.success && result.token) {
        setToken(result.token, remember);
        // تخزين بيانات المستخدم
        const userStr = JSON.stringify(result.user);
        if (remember) {
            localStorage.setItem('currentUser', userStr);
            sessionStorage.removeItem('currentUser');
        } else {
            sessionStorage.setItem('currentUser', userStr);
            localStorage.removeItem('currentUser');
        }
        // تخزين البروفايل الإضافي (لو موجود)
        if (result.profile) {
            const profileStr = JSON.stringify(result.profile);
            if (remember) {
                localStorage.setItem('userProfile', profileStr);
                sessionStorage.removeItem('userProfile');
            } else {
                sessionStorage.setItem('userProfile', profileStr);
                localStorage.removeItem('userProfile');
            }
        }
    } else if (!result.success && result.status === 401) {
        result.message = result.message || '❌ البريد/الهاتف أو كلمة السر غير صحيحة (401)';
    }

    return result;
}

/**
 * تسجيل الخروج
 */
function apiLogout() {
    setToken(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    localStorage.removeItem('userProfile');
    sessionStorage.removeItem('userProfile');
    window.location.href = '../../index.html';
}

// ============================================================
// ===== دوال الإحصائيات (Stats) =====
// ============================================================

/**
 * جلب الإحصائيات حسب دور المستخدم
 */
async function apiGetStats() {
    return request('/stats', 'GET', null, true);
}

// ============================================================
// ===== دوال الطلبات (Orders) =====
// ============================================================

async function apiCreateOrder(orderData) {
    return request('/orders', 'POST', orderData, true);
}

async function apiGetPharmacyOrders() {
    return request('/pharmacy/orders', 'GET', null, true);
}

async function apiUpdateOrderStatus(orderId, status) {
    return request(`/orders/${orderId}/status`, 'PUT', { status }, true);
}

async function apiGetPatientOrders() {
    return request('/patient/orders', 'GET', null, true);
}

// ============================================================
// ===== دوال مساعدة =====
// ============================================================

function getCurrentUser() {
    let user = localStorage.getItem('currentUser');
    if (!user) user = sessionStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
}

function getUserProfile() {
    let profile = localStorage.getItem('userProfile');
    if (!profile) profile = sessionStorage.getItem('userProfile');
    return profile ? JSON.parse(profile) : null;
}

function isLoggedIn() {
    return getToken() !== null && getCurrentUser() !== null;
}

// ============================================================
// ===== تصدير الدوال =====
// ============================================================

window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiLogout = apiLogout;
window.apiGetStats = apiGetStats;
window.apiCreateOrder = apiCreateOrder;
window.apiGetPharmacyOrders = apiGetPharmacyOrders;
window.apiUpdateOrderStatus = apiUpdateOrderStatus;
window.apiGetPatientOrders = apiGetPatientOrders;
window.getCurrentUser = getCurrentUser;
window.getUserProfile = getUserProfile;
window.isLoggedIn = isLoggedIn;

console.log('✅ API Service (متوافق مع السيرفر الجديد) جاهز!');