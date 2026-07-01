// ============================================================
// ===== طبقة الاتصال بالسيرفر (API Service) =====
// ===== تم التعديل لحل مشكلة 401 نهائياً =====
// ============================================================

// ⚠️ غيّر الرقم 5000 في السطر التالي إلى البورت اللي شغال عليه السيرفر (مثلاً 3000 أو 8080)
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

        // محاولة قراءة الرد (نص أو JSON)
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        if (!response.ok) {
            // هنا هنعدل عشان نرجع الرسالة اللي جاية من السيرفر بالظبط
            return {
                success: false,
                message: data.message || `خطأ في السيرفر (${response.status})`,
                status: response.status,
                details: data
            };
        }

        // إذا كان الرد موفقاً ولكن بدون خاصية success، نضيفها يدوياً
        if (data && typeof data.success === 'undefined') {
            data.success = true;
        }
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

// ============================================================
// 🔥 [تم التعديل هنا] دالة تسجيل الدخول - حل مشكلة 401
// ============================================================
async function apiLogin(identifier, password, remember = false) {
    // ⚠️ اختار السطر المناسب حسب ما يطلبه السيرفر الخلفي بتاعك:
    // - لو بيطلب 'email'  => استخدم السطر الأول (email: identifier)
    // - لو بيطلب 'phone'  => استخدم السطر الثاني (phone: identifier)
    // - لو بيطلب 'identifier' => استخدم السطر الثالث (identifier: identifier)
    const payload = {
        email: identifier,      // <-- الأكثر شيوعاً (خليها لو مش متأكد)
        // phone: identifier,   // <-- اختار هذا لو السيرفر بيطلب phone
        // identifier: identifier, // <-- اختار هذا لو السيرفر بيطلب identifier
        password: password
    };

    // إرسال الطلب للسيرفر
    const result = await request('/auth/login', 'POST', payload);

    // معالجة النجاح
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
    } else if (!result.success && result.status === 401) {
        // هنا بنرجع رسالة الخطأ بطريقة واضحة عشان تظهر في الواجهة
        result.message = result.message || '❌ البريد الإلكتروني أو كلمة السر غير صحيحة (401)';
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
// ===== دوال الطلبات (Orders) - زي ما هي من غير تغيير =====
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