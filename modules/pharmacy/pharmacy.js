// ============================================================
// ===== جافا سكريبت - صفحة الصيدلي =====
// ============================================================

// ----- ١. بيانات الخدمات التطبيقية (9 خدمات) -----
const appServices = [
    { id: 'dashboard', icon: 'fa-chart-pie', name: 'لوحة التحكم' },
    { id: 'inventory', icon: 'fa-boxes', name: 'إدارة المخزون' },
    { id: 'orders', icon: 'fa-shopping-cart', name: 'إدارة الطلبات' },
    { id: 'store', icon: 'fa-store', name: 'المتجر الإلكتروني' },
    { id: 'loyalty', icon: 'fa-gem', name: 'نظام الولاء' },
    { id: 'analytics', icon: 'fa-chart-bar', name: 'تحليلات المبيعات' },
    { id: 'alerts', icon: 'fa-bell', name: 'تنبيهات المخزون' },
    { id: 'settings', icon: 'fa-cog', name: 'إعدادات الصيدلية' },
    { id: 'customers', icon: 'fa-users', name: 'إدارة العملاء' }
];

// ----- ٢. بيانات خدمات الربط (8 خدمات) -----
const linkServices = [
    { id: 'receive-orders', icon: 'fa-clipboard-list', name: 'استقبال الطلبات' },
    { id: 'collab-code', icon: 'fa-qrcode', name: 'كود التعاون' },
    { id: 'b2b', icon: 'fa-handshake', name: 'سوق B2B' },
    { id: 'shortage-alerts', icon: 'fa-exclamation-triangle', name: 'تنبيه النواقص' },
    { id: 'news', icon: 'fa-bullhorn', name: 'نشر أخبار وعروض' },
    { id: 'prescriptions', icon: 'fa-prescription', name: 'الروشتات الرقمية' },
    { id: 'cashback', icon: 'fa-wallet', name: 'كاش باك الولاء' },
    { id: 'track-meds', icon: 'fa-search', name: 'تتبع الأدوية' }
];

// ----- ٣. توليد الخدمات في الصفحة -----
function renderServices() {
    const appGrid = document.getElementById('appServices');
    const linkGrid = document.getElementById('linkServices');

    // الخدمات التطبيقية
    appGrid.innerHTML = '';
    appServices.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `
            <i class="fas ${service.icon}"></i>
            <h4>${service.name}</h4>
        `;
        card.onclick = () => openService('app', service.id, service.name);
        appGrid.appendChild(card);
    });

    // خدمات الربط
    linkGrid.innerHTML = '';
    linkServices.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card link-card';
        card.innerHTML = `
            <i class="fas ${service.icon}"></i>
            <h4>${service.name}</h4>
        `;
        card.onclick = () => openService('link', service.id, service.name);
        linkGrid.appendChild(card);
    });
}

// ----- ٤. فتح الخدمة -----
function openService(type, id, name) {
    const typeLabel = type === 'app' ? '🟢 خدمة تطبيقية' : '🟡 خدمة ربط';
    alert(`📱 ${typeLabel}\n\n${name}\n\n🔜 سيتم فتح هذه الخدمة في الإصدار القادم.\n\n📌 معرف الخدمة: ${id}`);
    console.log(`📱 فتح: ${name} (${id}) - نوع: ${type}`);
}

// ----- ٥. البحث في الخدمات -----
function filterServices(query) {
    const q = query.trim().toLowerCase();
    const clearBtn = document.getElementById('clearSearchBtn');

    if (q.length > 0) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }

    // البحث في الخدمات التطبيقية
    document.querySelectorAll('#appServices .service-card').forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        if (name.includes(q)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });

    // البحث في خدمات الربط
    document.querySelectorAll('#linkServices .service-card').forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        if (name.includes(q)) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterServices('');
}

// ----- ٦. التنقل في الشريط السفلي -----
function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    const pages = ['home', 'orders', 'inventory', 'patients', 'more'];
    const index = pages.indexOf(page);
    if (index !== -1) {
        navItems[index].classList.add('active');
    }
    alert(`📍 التنقل إلى: ${page} (سيتم ربطه قريباً)`);
}

// ----- ٧. تسجيل الخروج (يودي للصفحة الرئيسية) -----
function logout() {
    if (confirm('هل أنت متأكد من الخروج من حسابك؟')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../../index.html';
    }
}

// ----- ٨. تحديث الوقت في شريط الحالة -----
function updateStatusTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('statusTime').textContent = time;
}

// ----- ٩. شاشة الترحيب -----
function showSplash() {
    const splash = document.getElementById('splashScreen');
    splash.classList.add('show');
    setTimeout(() => {
        splash.classList.remove('show');
        splash.classList.add('hide');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 600);
    }, 2000);
}

// ----- ١٠. تحميل الصفحة -----
document.addEventListener('DOMContentLoaded', function() {
    updateStatusTime();
    setInterval(updateStatusTime, 30000);
    showSplash();
    renderServices();
    console.log('✅ Pharmacy Dashboard loaded successfully!');
    console.log(`📊 ${appServices.length} خدمة تطبيقية + ${linkServices.length} خدمة ربط = ${appServices.length + linkServices.length} خدمة`);
});

// تصدير الدوال
window.openService = openService;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;