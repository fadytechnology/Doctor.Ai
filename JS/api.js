// ============================================================
// ===== طبقة الاتصال بالسيرفر (API Service) =====
// ============================================================

const API_URL = 'http://localhost:5000/api';

// ----- إدارة التوكن -----
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

// ----- دالة الطلب العامة -----
async function request(endpoint, method = 'GET', body = null, requiresAuth = false) {
    const headers = { 'Content-Type': 'application/json' };

    if (requiresAuth) {
        const token = getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        } else {
            return { success: false, message: 'غير مصرح، يرجى تسجيل الدخول' };
        }
    }

    const options = { method, headers };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);

        if (!response.ok) {
            const errorText = await response.text();
            return {
                success: false,
                message: `خطأ في السيرفر (${response.status})`,
                details: errorText
            };
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('❌ خطأ في الاتصال بالسيرفر:', error);
        return {
            success: false,
            message: 'تعذر الاتصال بالسيرفر. تأكد من تشغيله على http://localhost:5000'
        };
    }
}

// ============================================================
// ===== دوال المصادقة =====
// ============================================================

async function apiRegister(userData) {
    return request('/auth/register', 'POST', userData);
}

async function apiLogin(identifier, password, remember = false) {
    const result = await request('/auth/login', 'POST', { identifier, password });

    if (result.success && result.token) {
        setToken(result.token, remember);
        const userStr = JSON.stringify(result.user);
        if (remember) {
            localStorage.setItem('currentUser', userStr);
            sessionStorage.removeItem('currentUser');
        } else {
            sessionStorage.setItem('currentUser', userStr);
            localStorage.removeItem('currentUser');
        }
    }
    return result;
}

function apiLogout() {
    setToken(null);
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = '/index.html';
}

// ============================================================
// ===== دوال الطلبات (Orders) - المهمة =====
// ============================================================

// ----- إنشاء طلب جديد (للمريض) -----
async function apiCreateOrder(orderData) {
    return request('/orders', 'POST', orderData, true);
}

// ----- جلب طلبات الصيدلي -----
async function apiGetPharmacyOrders() {
    return request('/pharmacy/orders', 'GET', null, true);
}

// ----- تحديث حالة طلب (للصيدلي) -----
async function apiUpdateOrderStatus(orderId, status) {
    return request(`/orders/${orderId}/status`, 'PUT', { status }, true);
}

// ----- جلب طلبات المريض -----
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

function isLoggedIn() {
    return getToken() !== null && getCurrentUser() !== null;
}

// ============================================================
// ===== تصدير الدوال للاستخدام في الـ HTML =====
// ============================================================

window.apiRegister = apiRegister;
window.apiLogin = apiLogin;
window.apiLogout = apiLogout;
window.apiCreateOrder = apiCreateOrder;
window.apiGetPharmacyOrders = apiGetPharmacyOrders;
window.apiUpdateOrderStatus = apiUpdateOrderStatus;
window.apiGetPatientOrders = apiGetPatientOrders;
window.getCurrentUser = getCurrentUser;
window.isLoggedIn = isLoggedIn;

console.log('✅ API Service loaded. Server:', API_URL);