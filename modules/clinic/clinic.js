// ============================================================
// ===== جافا سكريبت - صفحة العيادة (بـ Modal متكامل) =====
// ============================================================

// ----- ١. بيانات الخدمات التطبيقية (8 خدمات) -----
const appServices = [
    { id: 'dashboard', icon: 'fa-chart-pie', name: 'لوحة التحكم' },
    { id: 'appointments', icon: 'fa-calendar-alt', name: 'إدارة المواعيد' },
    { id: 'patients', icon: 'fa-users', name: 'إدارة المرضى' },
    { id: 'examinations', icon: 'fa-notes-medical', name: 'الكشوفات الطبية' },
    { id: 'reports', icon: 'fa-file-medical', name: 'التقارير الطبية' },
    { id: 'ehr', icon: 'fa-folder-open', name: 'السجل الطبي الموحد (EHR)' },
    { id: 'settings', icon: 'fa-cog', name: 'إعدادات العيادة' },
    { id: 'treatment-monitor', icon: 'fa-chart-line', name: 'متابعة كفاءة العلاج' }
];

// ----- ٢. بيانات خدمات الربط (6 خدمات) -----
const linkServices = [
    { id: 'prescriptions', icon: 'fa-prescription', name: 'الروشتات الرقمية' },
    { id: 'drug-availability', icon: 'fa-pills', name: 'مؤشر توافر الدواء' },
    { id: 'lab-orders', icon: 'fa-flask', name: 'التوجيه للمختبرات' },
    { id: 'radiology-booking', icon: 'fa-x-ray', name: 'حجز الأشعة' },
    { id: 'collab-code', icon: 'fa-qrcode', name: 'كود التعاون' },
    { id: 'share-ehr', icon: 'fa-share-alt', name: 'مشاركة الملف الطبي' }
];

// ----- ٣. بيانات وهمية (Mock Data) -----
const mockData = {
    // ----- تطبيقية -----
    dashboard: {
        stats: [
            { label: 'مرضى اليوم', value: '6' },
            { label: 'مواعيد قادمة', value: '4' },
            { label: 'كشوفات اليوم', value: '8' },
            { label: 'إجمالي المرضى', value: '42' }
        ],
        description: '📊 ملخص نشاط العيادة اليوم'
    },
    appointments: {
        table: true,
        headers: ['المريض', 'التاريخ', 'الوقت', 'الحالة'],
        rows: [
            ['محمد علي', '28/6/2026', '10:30 ص', 'قادم'],
            ['سارة حسن', '28/6/2026', '12:00 م', 'في الانتظار'],
            ['خالد محمود', '28/6/2026', '2:30 م', 'مؤجل'],
            ['نورا أحمد', '29/6/2026', '11:00 ص', 'جديد']
        ]
    },
    patients: {
        table: true,
        headers: ['الاسم', 'العمر', 'آخر زيارة', 'الهاتف'],
        rows: [
            ['محمد علي', '45', '20/6/2026', '01001234567'],
            ['سارة حسن', '32', '15/6/2026', '01008765432'],
            ['خالد محمود', '58', '10/6/2026', '01005556677'],
            ['نورا أحمد', '27', '25/6/2026', '01009998888']
        ]
    },
    examinations: {
        table: true,
        headers: ['المريض', 'التشخيص', 'التاريخ', 'الدواء'],
        rows: [
            ['محمد علي', 'إنفلونزا', '20/6/2026', 'باراسيتامول'],
            ['سارة حسن', 'ارتفاع ضغط', '15/6/2026', 'أملوديبين'],
            ['خالد محمود', 'سكري نوع 2', '10/6/2026', 'ميتفورمين']
        ]
    },
    reports: {
        reports: [
            { title: 'تقرير تحليل دم - محمد علي', date: '20/6/2026', status: 'جاهز' },
            { title: 'تقرير أشعة صدر - سارة حسن', date: '18/6/2026', status: 'قيد المراجعة' },
            { title: 'تقرير تحليل سكر - خالد محمود', date: '15/6/2026', status: 'جاهز' }
        ]
    },
    ehr: {
        patient: 'محمد علي (45 سنة)',
        info: [
            { label: 'الأمراض المزمنة', value: 'لا يوجد' },
            { label: 'الحساسية', value: 'بنسلين' },
            { label: 'الأدوية السابقة', value: 'باراسيتامول, مضاد حيوي' },
            { label: 'آخر كشف', value: 'إنفلونزا (20/6/2026)' }
        ],
        description: '📋 التاريخ الطبي الكامل للمريض'
    },
    settings: {
        info: [
            { label: 'اسم العيادة', value: 'عيادة السلام' },
            { label: 'التخصص', value: 'طب عام' },
            { label: 'ساعات العمل', value: '9 ص - 9 م' },
            { label: 'العنوان', value: 'القاهرة، مصر الجديدة' }
        ]
    },
    'treatment-monitor': {
        table: true,
        headers: ['المريض', 'الدواء', 'الالتزام', 'آخر صرف'],
        rows: [
            ['محمد علي', 'باراسيتامول', 'ملتزم ✅', '22/6/2026'],
            ['سارة حسن', 'أملوديبين', 'غير ملتزم ❌', '10/6/2026'],
            ['خالد محمود', 'ميتفورمين', 'ملتزم ✅', '18/6/2026']
        ]
    },

    // ----- ربط -----
    prescriptions: {
        table: true,
        headers: ['المريض', 'الدواء', 'الصيدلية', 'الحالة'],
        rows: [
            ['محمد علي', 'باراسيتامول', 'صيدلية النور', 'مرسلة ✅'],
            ['سارة حسن', 'أملوديبين', 'صيدلية الرحمة', 'قيد المراجعة'],
            ['نورا أحمد', 'فيتامين D', 'صيدلية النور', 'مرسلة ✅']
        ]
    },
    'drug-availability': {
        pharmacies: [
            { name: 'صيدلية النور (2.5 كم)', meds: 'باراسيتامول: متوفر, أموكسيسيلين: متوفر' },
            { name: 'صيدلية الرحمة (4.0 كم)', meds: 'باراسيتامول: متوفر, أنسولين: ناقص' }
        ],
        description: '🔍 تحقق من توفر الأدوية في الصيدليات القريبة'
    },
    'lab-orders': {
        table: true,
        headers: ['المريض', 'التحليل', 'المعمل', 'الحالة'],
        rows: [
            ['محمد علي', 'صورة دم كاملة', 'معمل المختبر', 'قيد التنفيذ'],
            ['سارة حسن', 'وظائف كبد', 'معمل الأمل', 'جاهز']
        ]
    },
    'radiology-booking': {
        bookings: [
            { patient: 'خالد محمود', type: 'أشعة مقطعية', date: '30/6/2026', status: 'مؤكد' },
            { patient: 'نورا أحمد', type: 'أشعة عادية', date: '29/6/2026', status: 'قيد الانتظار' }
        ],
        description: '📅 حجوزات الأشعة القادمة'
    },
    'collab-code': {
        code: 'CL-2024-001',
        description: 'شارك هذا الكود مع مرضاك لربطهم بعيادتك',
        instructions: 'ضع الكود في عيادتك أو أرسله للمرضى'
    },
    'share-ehr': {
        requests: [
            { patient: 'محمد علي', doctor: 'د. خالد', status: 'موافقة' },
            { patient: 'سارة حسن', doctor: 'د. أحمد', status: 'قيد الانتظار' }
        ],
        description: '📤 طلبات مشاركة الملف الطبي'
    }
};

// ----- ٤. عرض الخدمات -----
function renderServices() {
    const appGrid = document.getElementById('appServices');
    const linkGrid = document.getElementById('linkServices');

    appGrid.innerHTML = '';
    appServices.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `<i class="fas ${s.icon}"></i><h4>${s.name}</h4>`;
        card.onclick = () => openService('app', s.id, s.name);
        appGrid.appendChild(card);
    });

    linkGrid.innerHTML = '';
    linkServices.forEach(s => {
        const card = document.createElement('div');
        card.className = 'service-card link-card';
        card.innerHTML = `<i class="fas ${s.icon}"></i><h4>${s.name}</h4>`;
        card.onclick = () => openService('link', s.id, s.name);
        linkGrid.appendChild(card);
    });
}

// ----- ٥. فتح الخدمة (Modal) -----
function openService(type, id, name) {
    const modal = document.getElementById('serviceModal');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    title.textContent = name;
    body.innerHTML = generateServiceContent(id);

    modal.classList.add('show');
    modal.style.display = 'flex';
}

// ----- ٦. توليد المحتوى الديناميكي -----
function generateServiceContent(serviceId) {
    const data = mockData[serviceId];
    if (!data) {
        return `<div class="empty-state"><i class="fas fa-cog"></i><p>هذه الخدمة قيد التطوير</p></div>`;
    }

    // Stats
    if (data.stats) {
        return data.stats.map(s =>
            `<div class="modal-stat"><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>`
        ).join('') + (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }

    // Table
    if (data.table && data.headers && data.rows) {
        let html = `<table class="mock-table"><thead><tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
        data.rows.forEach(row => {
            html += `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
        });
        html += `</tbody></table>`;
        return html;
    }

    // Reports
    if (data.reports) {
        return data.reports.map(r =>
            `<div class="modal-stat"><span class="stat-label">${r.title}</span><span class="stat-value">${r.date} (${r.status})</span></div>`
        ).join('');
    }

    // Info (EHR / Settings)
    if (data.info) {
        let html = data.patient ? `<p style="font-weight:600;color:#0d9488;margin-bottom:10px;">👤 ${data.patient}</p>` : '';
        html += data.info.map(i =>
            `<div class="modal-stat"><span class="stat-label">${i.label}</span><span class="stat-value">${i.value}</span></div>`
        ).join('');
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }

    // Pharmacies (drug-availability)
    if (data.pharmacies) {
        return data.pharmacies.map(p =>
            `<div class="modal-stat"><span class="stat-label">${p.name}</span><span class="stat-value">${p.meds}</span></div>`
        ).join('') + (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }

    // Bookings
    if (data.bookings) {
        let html = `<table class="mock-table"><thead><tr><th>المريض</th><th>النوع</th><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>`;
        data.bookings.forEach(b => {
            html += `<tr><td>${b.patient}</td><td>${b.type}</td><td>${b.date}</td><td><span class="badge-status ${b.status === 'مؤكد' ? 'green' : 'yellow'}">${b.status}</span></td></tr>`;
        });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }

    // Collab code
    if (data.code) {
        return `
            <div style="text-align:center;padding:20px 0;">
                <div style="font-size:32px;font-weight:800;color:#0d9488;background:#d1fae5;padding:16px;border-radius:16px;display:inline-block;">${data.code}</div>
                <p style="margin-top:16px;color:#64748b;">${data.description}</p>
                <p style="font-size:13px;color:#94a3b8;margin-top:8px;">${data.instructions || ''}</p>
            </div>
        `;
    }

    // Share EHR
    if (data.requests) {
        let html = `<table class="mock-table"><thead><tr><th>المريض</th><th>الطبيب</th><th>الحالة</th></tr></thead><tbody>`;
        data.requests.forEach(r => {
            html += `<tr><td>${r.patient}</td><td>${r.doctor}</td><td><span class="badge-status ${r.status === 'موافقة' ? 'green' : 'yellow'}">${r.status}</span></td></tr>`;
        });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }

    return `<div class="empty-state"><i class="fas fa-file-alt"></i><p>بيانات الخدمة غير متوفرة</p></div>`;
}

// ----- ٧. إغلاق الـ Modal -----
function closeModal() {
    const modal = document.getElementById('serviceModal');
    modal.classList.remove('show');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
}

// ----- ٨. البحث -----
function filterServices(query) {
    const q = query.trim().toLowerCase();
    const clearBtn = document.getElementById('clearSearchBtn');
    if (q.length > 0) clearBtn.classList.add('visible');
    else clearBtn.classList.remove('visible');

    document.querySelectorAll('#appServices .service-card, #linkServices .service-card').forEach(card => {
        const name = card.querySelector('h4').textContent.toLowerCase();
        if (name.includes(q)) card.classList.remove('hidden');
        else card.classList.add('hidden');
    });
}

function clearSearch() {
    document.getElementById('searchInput').value = '';
    filterServices('');
}

// ----- ٩. تنقل وخروج -----
function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    const pages = ['home', 'appointments', 'patients', 'exams', 'more'];
    const index = pages.indexOf(page);
    if (index !== -1) navItems[index].classList.add('active');
    alert(`📍 التنقل إلى: ${page}`);
}

function logout() {
    if (confirm('هل أنت متأكد من الخروج؟')) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '../../index.html';
    }
}

// ----- ١٠. شاشة الترحيب والوقت -----
function updateStatusTime() {
    const now = new Date();
    const time = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('statusTime').textContent = time;
}

function showSplash() {
    const splash = document.getElementById('splashScreen');
    splash.classList.add('show');
    setTimeout(() => {
        splash.classList.remove('show');
        splash.classList.add('hide');
        setTimeout(() => { splash.style.display = 'none'; }, 600);
    }, 2000);
}

// ----- ١١. تحميل الصفحة -----
document.addEventListener('DOMContentLoaded', function() {
    updateStatusTime();
    setInterval(updateStatusTime, 30000);
    showSplash();
    renderServices();
    console.log('✅ Clinic Dashboard (14 Services) loaded!');
});

// تصدير الدوال
window.openService = openService;
window.closeModal = closeModal;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;