// ============================================================
// ===== جافا سكريبت - صفحة المريض (Mobile App) =====
// ============================================================

// ----- ١. بيانات الخدمات الذاتية (22 خدمة مع تصنيفات) -----
const selfServices = [
    // 🩺 الصحة العامة والحيوية
    { id: 'biometric', icon: 'fa-user-md', name: 'الملف البيومتري', category: 'health', catName: '🩺 الصحة العامة' },
    { id: 'ai-report', icon: 'fa-robot', name: 'التقرير الذكي', category: 'health', catName: '🩺 الصحة العامة' },
    { id: 'symptoms', icon: 'fa-head-side-virus', name: 'أرشيف الأعراض', category: 'health', catName: '🩺 الصحة العامة' },
    { id: 'vault', icon: 'fa-cloud-upload-alt', name: 'الخزنة الطبية', category: 'health', catName: '🩺 الصحة العامة' },
    { id: 'ice', icon: 'fa-phone-alt', name: 'كارت الطوارئ', category: 'health', catName: '🩺 الصحة العامة' },

    // 🥗 التغذية واللياقة
    { id: 'calories', icon: 'fa-utensils', name: 'حاسبة السعرات', category: 'nutrition', catName: '🥗 التغذية' },
    { id: 'water', icon: 'fa-tint', name: 'رادار المياه', category: 'nutrition', catName: '🥗 التغذية' },
    { id: 'meal-planner', icon: 'fa-apple-alt', name: 'مقترح الوجبات', category: 'nutrition', catName: '🥗 التغذية' },
    { id: 'sugar-detox', icon: 'fa-cookie-bite', name: 'تحدي السكريات', category: 'nutrition', catName: '🥗 التغذية' },
    { id: 'fasting', icon: 'fa-clock', name: 'الصيام المتقطع', category: 'nutrition', catName: '🥗 التغذية' },

    // 💊 الأدوية والتداخلات
    { id: 'dosage', icon: 'fa-calculator', name: 'حاسبة الجرعات', category: 'meds', catName: '💊 الأدوية' },
    { id: 'interaction', icon: 'fa-exclamation-triangle', name: 'كاشف التداخلات', category: 'meds', catName: '💊 الأدوية' },
    { id: 'alternatives', icon: 'fa-exchange-alt', name: 'مذكر البدائل', category: 'meds', catName: '💊 الأدوية' },
    { id: 'guide', icon: 'fa-book-medical', name: 'دليل الأدوية', category: 'meds', catName: '💊 الأدوية' },
    { id: 'medication', icon: 'fa-pills', name: 'منظم الأدوية', category: 'meds', catName: '💊 الأدوية' },

    // 🧠 الصحة النفسية
    { id: 'mood', icon: 'fa-smile', name: 'متابع المزاج', category: 'mental', catName: '🧠 الصحة النفسية' },
    { id: 'breathing', icon: 'fa-wind', name: 'تمارين التنفس', category: 'mental', catName: '🧠 الصحة النفسية' },
    { id: 'sleep', icon: 'fa-moon', name: 'منبه النوم', category: 'mental', catName: '🧠 الصحة النفسية' },

    // 👩 صحة المرأة والطفل
    { id: 'period', icon: 'fa-female', name: 'الدورة الشهرية', category: 'women', catName: '👩 صحة المرأة' },
    { id: 'baby', icon: 'fa-baby', name: 'رعاية الطفل', category: 'women', catName: '👩 صحة المرأة' },
    { id: 'vaccines', icon: 'fa-syringe', name: 'سجل التطعيمات', category: 'women', catName: '👩 صحة المرأة' },

    // 📊 أدوات وتخطيط
    { id: 'cost', icon: 'fa-coins', name: 'حاسبة التكلفة', category: 'tools', catName: '📊 أدوات' },
    { id: 'steps', icon: 'fa-shoe-prints', name: 'عداد الخطوات', category: 'tools', catName: '📊 أدوات' },
    { id: 'chatbot', icon: 'fa-comment-medical', name: 'المساعد الطبي', category: 'tools', catName: '📊 أدوات' }
];

// ----- ٢. بيانات خدمات الربط (10 خدمات) -----
const linkServices = [
    { id: 'network', icon: 'fa-users', name: 'شبكتي الصحية' },
    { id: 'store', icon: 'fa-store', name: 'الطلب السريع' },
    { id: 'wallet', icon: 'fa-wallet', name: 'المحفظة الذكية' },
    { id: 'ocr-scan', icon: 'fa-camera', name: 'فحص الروشتات' },
    { id: 'appointment', icon: 'fa-calendar-check', name: 'حجز موعد' },
    { id: 'lab', icon: 'fa-flask', name: 'طلب تحليل' },
    { id: 'radiology', icon: 'fa-x-ray', name: 'طلب أشعة' },
    { id: 'share', icon: 'fa-share-alt', name: 'مشاركة الملف' },
    { id: 'reminder', icon: 'fa-bell', name: 'منبه العلاج' },
    { id: 'compliance', icon: 'fa-chart-line', name: 'متابعة العلاج' }
];

// ----- ٣. توليد الخدمات المصنفة -----
function renderCategories() {
    const container = document.getElementById('selfServicesCategories');
    container.innerHTML = '';

    // تجميع حسب التصنيف
    const categories = {};
    selfServices.forEach(service => {
        if (!categories[service.category]) {
            categories[service.category] = {
                name: service.catName,
                services: []
            };
        }
        categories[service.category].services.push(service);
    });

    // عرض كل تصنيف
    Object.keys(categories).forEach(key => {
        const cat = categories[key];
        const catDiv = document.createElement('div');
        catDiv.className = 'service-category';
        catDiv.dataset.category = key;

        catDiv.innerHTML = `
            <div class="category-header">
                <span class="cat-title">${cat.name}</span>
                <span class="cat-count">${cat.services.length}</span>
            </div>
            <div class="services-grid">
                ${cat.services.map(s => `
                    <div class="service-card" data-id="${s.id}" onclick="openService('self', '${s.id}', '${s.name}')">
                        <i class="fas ${s.icon}"></i>
                        <h4>${s.name}</h4>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(catDiv);
    });
}

// ----- ٤. توليد خدمات الربط -----
function renderLinkServices() {
    const grid = document.getElementById('linkServices');
    grid.innerHTML = '';
    linkServices.forEach(service => {
        const card = document.createElement('div');
        card.className = 'service-card link-card';
        card.innerHTML = `
            <i class="fas ${service.icon}"></i>
            <h4>${service.name}</h4>
        `;
        card.onclick = () => openService('link', service.id, service.name);
        grid.appendChild(card);
    });
}

// ----- ٥. فتح الخدمة -----
function openService(type, id, name) {
    const typeLabel = type === 'self' ? '🟢 خدمة ذاتية' : '🟡 خدمة ربط';
    alert(`📱 ${typeLabel}\n\n${name}\n\n🔜 سيتم فتح هذه الخدمة في الإصدار القادم.`);
    console.log(`📱 فتح: ${name} (${id})`);
}

// ----- ٦. البحث في الخدمات -----
function filterServices(query) {
    const q = query.trim().toLowerCase();
    const clearBtn = document.getElementById('clearSearchBtn');

    if (q.length > 0) {
        clearBtn.classList.add('visible');
    } else {
        clearBtn.classList.remove('visible');
    }

    // البحث في الخدمات الذاتية
    document.querySelectorAll('.service-category').forEach(cat => {
        const cards = cat.querySelectorAll('.service-card');
        let hasVisible = false;
        cards.forEach(card => {
            const name = card.querySelector('h4').textContent.toLowerCase();
            if (name.includes(q)) {
                card.classList.remove('hidden');
                hasVisible = true;
            } else {
                card.classList.add('hidden');
            }
        });
        if (hasVisible) {
            cat.classList.remove('category-hidden');
        } else {
            cat.classList.add('category-hidden');
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

// ----- ٧. التنقل في الشريط السفلي -----
function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    const pages = ['home', 'services', 'network', 'profile', 'map'];
    const index = pages.indexOf(page);
    if (index !== -1) {
        navItems[index].classList.add('active');
    }
    alert(`📍 التنقل إلى: ${page} (سيتم ربطه قريباً)`);
}

// ----- ٨. تسجيل الخروج -----
function logout() {
    if (confirm('هل أنت متأكد من الخروج من حسابك؟')) {
        localStorage.clear();
        sessionStorage.clear();
        // روح للصفحة الرئيسية
        window.location.href = '/index.html';
    }
}

// ----- ٩. تحديث الوقت في شريط الحالة -----
function updateStatusTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('statusTime').textContent = time;
}

// ----- ١٠. شاشة الترحيب -----
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

// ----- ١١. تحميل الصفحة -----
document.addEventListener('DOMContentLoaded', function() {
    // تحديث الوقت
    updateStatusTime();
    setInterval(updateStatusTime, 30000);

    // عرض شاشة الترحيب
    showSplash();

    // توليد الخدمات
    renderCategories();
    renderLinkServices();

    console.log('✅ Patient App (Mobile) loaded successfully!');
    console.log(`📊 ${selfServices.length} خدمة ذاتية مصنفة + ${linkServices.length} خدمة ربط`);
});

// تصدير الدوال
window.openService = openService;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;