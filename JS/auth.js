// ============================================================
// ===== جافا سكريبت - صفحات الدخول والتسجيل =====
// ============================================================

// ----- ١. إظهار/إخفاء كلمة السر -----
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = button.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// ----- ٢. معالج تسجيل الدخول -----
function handleLogin(e) {
    e.preventDefault();

    const loginField = document.getElementById('loginField').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('rememberMe').checked;

    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    // إخفاء الرسائل القديمة
    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // التحقق من الحقول
    if (!loginField || !password) {
        showAuthError('يرجى ملء جميع الحقول');
        return;
    }

    // جلب المستخدمين من localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // البحث عن مستخدم
    const user = users.find(u =>
        (u.email === loginField || u.phone === loginField) &&
        u.password === password
    );

    if (!user) {
        showAuthError('❌ البريد الإلكتروني أو كلمة السر غير صحيحة');
        return;
    }

    // تسجيل الدخول ناجح
    showAuthSuccess(`✅ مرحباً ${user.fullName || user.email}`);

    // حفظ بيانات المستخدم الحالي
    const userData = {
        id: user.id,
        fullName: user.fullName || user.email,
        email: user.email,
        phone: user.phone,
        role: user.role || 'patient',
        pharmacyCode: user.pharmacyCode || null,
        createdAt: user.createdAt || new Date().toISOString()
    };

    // حفظ في localStorage (مع خيار تذكرني)
    if (rememberMe) {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        // حفظ التذكر لمدة 30 يوم
        localStorage.setItem('rememberMe', 'true');
    } else {
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.removeItem('rememberMe');
        // نستخدم sessionStorage عشان يفضل مسجل طول الجلسة
        sessionStorage.setItem('currentUser', JSON.stringify(userData));
    }

    // توجيه حسب الفئة بعد 1.5 ثانية
    setTimeout(() => {
        const role = user.role || 'patient';
        redirectToRoleDashboard(role);
    }, 1200);
}

// ----- ٣. معالج إنشاء حساب جديد -----
function handleSignup(e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const termsCheck = document.getElementById('termsCheck').checked;

    const errorMsg = document.getElementById('errorMsg');
    const successMsg = document.getElementById('successMsg');

    errorMsg.style.display = 'none';
    successMsg.style.display = 'none';

    // ١. التحقق من الحقول
    if (!fullName || !email || !phone || !password || !confirmPassword) {
        showAuthError('❌ يرجى ملء جميع الحقول');
        return;
    }

    // ٢. التحقق من الموافقة على الشروط
    if (!termsCheck) {
        showAuthError('❌ يرجى الموافقة على الشروط والأحكام');
        return;
    }

    // ٣. التحقق من تطابق كلمة السر
    if (password !== confirmPassword) {
        showAuthError('❌ كلمة السر وتأكيدها غير متطابقين');
        return;
    }

    // ٤. التحقق من طول كلمة السر
    if (password.length < 8) {
        showAuthError('❌ كلمة السر يجب أن تكون 8 أحرف على الأقل');
        return;
    }

    // ٥. التحقق من رقم الهاتف (مصري)
    if (!isValidEgyptianPhone(phone)) {
        showAuthError('❌ رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01');
        return;
    }

    // ٦. التحقق من صحة البريد
    if (!isValidEmail(email)) {
        showAuthError('❌ البريد الإلكتروني غير صحيح');
        return;
    }

    // ٧. حفظ في localStorage (محاكاة قاعدة البيانات)
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // التحقق من عدم تكرار البريد أو الهاتف
    if (users.find(u => u.email === email)) {
        showAuthError('❌ هذا البريد الإلكتروني مسجل بالفعل');
        return;
    }
    if (users.find(u => u.phone === phone)) {
        showAuthError('❌ رقم الهاتف هذا مسجل بالفعل');
        return;
    }

    // إنشاء مستخدم جديد
    const newUser = {
        id: Date.now(),
        fullName,
        email,
        phone,
        role,
        password,
        pharmacyCode: null, // للمريض: كود الصيدلي المرتبط
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // رسالة نجاح
    showAuthSuccess(`✅ تم إنشاء الحساب بنجاح! مرحباً ${fullName}`);

    // إعادة تعيين النموذج
    document.getElementById('signupForm').reset();

    // توجيه إلى صفحة الدخول بعد 2 ثانية
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// ----- ٤. وظائف مساعدة للرسائل -----
function showAuthError(message) {
    const errorMsg = document.getElementById('errorMsg');
    errorMsg.textContent = message;
    errorMsg.style.display = 'block';
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 4000);
}

function showAuthSuccess(message) {
    const successMsg = document.getElementById('successMsg');
    successMsg.textContent = message;
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 4000);
}

// ----- ٥. التحقق من الجلسة (إذا كان المستخدم مسجل بالفعل) -----
function checkSession() {
    // التحقق من localStorage أولاً
    let user = localStorage.getItem('currentUser');
    if (user) {
        // إذا كان في localStorage ووجدناه، نوجهه للوحة المناسبة
        try {
            const userData = JSON.parse(user);
            if (userData && userData.role) {
                // نوجهه فوراً
                const role = userData.role;
                // نستخدم redirectToRoleDashboard من script.js
                if (typeof redirectToRoleDashboard === 'function') {
                    redirectToRoleDashboard(role);
                } else {
                    // نسخة احتياطية
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
            }
        } catch (e) {
            // لو في خطأ في الـ JSON، نتجاهل
        }
        return true;
    }

    // إذا لم نجد في localStorage، نبحث في sessionStorage
    const sessionUser = sessionStorage.getItem('currentUser');
    if (sessionUser) {
        try {
            const userData = JSON.parse(sessionUser);
            if (userData && userData.role) {
                const role = userData.role;
                if (typeof redirectToRoleDashboard === 'function') {
                    redirectToRoleDashboard(role);
                } else {
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
            }
        } catch (e) {}
        return true;
    }

    return false;
}

// ----- ٦. تشغيل التحقق عند تحميل الصفحة (للصفحات العامة) -----
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من الجلسة فقط إذا كنا في صفحة الدخول أو التسجيل
    const currentPage = window.location.pathname;
    if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
        // نتحقق إذا كان المستخدم مسجل بالفعل، نوجهه للوحة
        const user = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (user) {
            try {
                const userData = JSON.parse(user);
                if (userData && userData.role) {
                    // توجيه حسب الفئة
                    const roleMap = {
                        'patient': '../modules/patient/index.html',
                        'pharmacy': '../modules/pharmacy/index.html',
                        'clinic': '../modules/clinic/index.html',
                        'lab': '../modules/lab/index.html',
                        'radiology': '../modules/radiology/index.html',
                        'supplier': '../modules/supplier/index.html',
                        'admin': '../modules/admin/index.html'
                    };
                    const url = roleMap[userData.role] || '../modules/patient/index.html';
                    window.location.href = url;
                }
            } catch (e) {}
        }
    }

    console.log('✅ Auth.js loaded successfully!');
});