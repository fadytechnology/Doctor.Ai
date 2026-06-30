// ============================================================
// ===== admin.js - الإدارة المركزية (12 خدمة) =====
// ============================================================

const appServices = [
    { id: 'dashboard', icon: 'fa-chart-pie', name: 'لوحة القيادة' },
    { id: 'users', icon: 'fa-users-cog', name: 'إدارة المستخدمين' },
    { id: 'pharmacies', icon: 'fa-prescription-bottle', name: 'إدارة الصيدليات' },
    { id: 'clinics', icon: 'fa-stethoscope', name: 'إدارة العيادات' },
    { id: 'reports', icon: 'fa-chart-bar', name: 'التقارير المركزية' },
    { id: 'ads', icon: 'fa-bullhorn', name: 'إدارة الإعلانات' },
    { id: 'settings', icon: 'fa-cog', name: 'إعدادات المنصة' },
    { id: 'logs', icon: 'fa-history', name: 'سجل النشاطات' }
];

const linkServices = [
    { id: 'approve-pharmacies', icon: 'fa-user-check', name: 'موافقة تسجيل' },
    { id: 'approve-news', icon: 'fa-newspaper', name: 'موافقة نشر أخبار' },
    { id: 'track-medicines', icon: 'fa-search', name: 'تتبع الأدوية' },
    { id: 'billing', icon: 'fa-money-bill-wave', name: 'الفوترة والمقاصة' }
];

const mockData = {
    dashboard: {
        stats: [
            { label: 'إجمالي المستخدمين', value: '156' },
            { label: 'صيدليات نشطة', value: '28' },
            { label: 'عيادات مسجلة', value: '15' },
            { label: 'طلبات اليوم', value: '342' }
        ],
        description: '📊 لوحة القيادة المركزية - نظرة عامة على المنصة'
    },
    users: {
        table: true,
        headers: ['الاسم', 'البريد', 'الدور', 'الحالة'],
        rows: [
            ['أحمد علي', 'ahmed@email.com', 'صيدلي', 'نشط'],
            ['سارة حسن', 'sara@email.com', 'طبيب', 'نشط'],
            ['خالد محمود', 'khaled@email.com', 'مريض', 'نشط']
        ]
    },
    pharmacies: {
        table: true,
        headers: ['اسم الصيدلية', 'المسؤول', 'الحالة', 'التسجيل'],
        rows: [
            ['صيدلية النور', 'أحمد علي', 'موافق', '1/6/2026'],
            ['صيدلية الرحمة', 'سامي فتحي', 'قيد المراجعة', '25/6/2026'],
            ['صيدلية الفردوس', 'نورا إبراهيم', 'موافق', '15/5/2026']
        ]
    },
    clinics: {
        table: true,
        headers: ['اسم العيادة', 'التخصص', 'الحالة', 'التسجيل'],
        rows: [
            ['عيادة السلام', 'طب عام', 'موافق', '10/6/2026'],
            ['عيادة النخبة', 'جلدية', 'قيد المراجعة', '28/6/2026'],
            ['عيادة الأمل', 'أطفال', 'موافق', '5/6/2026']
        ]
    },
    reports: {
        stats: [
            { label: 'إجمالي الإيرادات', value: '45,200 ج.م' },
            { label: 'نمو المستخدمين', value: '+12%' },
            { label: 'أكثر فئة نشاطاً', value: 'الصيدليات' }
        ],
        description: '📈 تقارير وإحصائيات المنصة'
    },
    ads: {
        ads: [
            { title: 'خصم 20% على باراسيتامول', status: 'منشور', date: '28/6/2026' },
            { title: 'عرض جديد من صيدلية النور', status: 'قيد المراجعة', date: '27/6/2026' },
            { title: 'تحديث التطبيق الجديد', status: 'منشور', date: '26/6/2026' }
        ],
        description: '📢 إدارة الإعلانات والأخبار المنشورة'
    },
    settings: {
        info: [
            { label: 'اسم المنصة', value: 'Doctor.ai' },
            { label: 'النسخة', value: 'v3.0' },
            { label: 'حالة المنصة', value: 'نشطة' },
            { label: 'اللغة الافتراضية', value: 'العربية' }
        ]
    },
    logs: {
        table: true,
        headers: ['المستخدم', 'النشاط', 'التاريخ', 'الحالة'],
        rows: [
            ['أحمد علي', 'تسجيل دخول', '28/6/2026 10:30', 'ناجح'],
            ['سارة حسن', 'تحديث ملف', '28/6/2026 9:15', 'ناجح'],
            ['خالد محمود', 'طلب دواء', '27/6/2026 14:45', 'ناجح']
        ]
    },
    'approve-pharmacies': {
        pending: [
            { name: 'صيدلية الرحمة', owner: 'سامي فتحي', date: '25/6/2026', status: 'قيد المراجعة' },
            { name: 'صيدلية الأمل', owner: 'نورا إبراهيم', date: '24/6/2026', status: 'قيد المراجعة' }
        ],
        description: '⏳ طلبات تسجيل صيدليات جديدة تنتظر الموافقة'
    },
    'approve-news': {
        pending: [
            { from: 'صيدلية النور', title: 'عرض جديد على فيتامين C', date: '28/6/2026' },
            { from: 'عيادة السلام', title: 'مواعيد جديدة في العيادة', date: '27/6/2026' }
        ],
        description: '📰 أخبار تنتظر الموافقة للنشر'
    },
    'track-medicines': {
        medicines: [
            { name: 'باراسيتامول', batch: 'B-123', source: 'مورد آمن', status: 'أصلي ✅' },
            { name: 'مضاد حيوي', batch: 'B-456', source: 'مورد مشبوه', status: 'مشبوه ⚠️' }
        ],
        description: '🔍 تتبع الأدوية المغشوشة عبر الباركود'
    },
    'billing': {
        stats: [
            { label: 'إجمالي الإيرادات', value: '45,200 ج.م' },
            { label: 'المستحق للصيدليات', value: '32,000 ج.م' },
            { label: 'عمولة المنصة', value: '13,200 ج.م' }
        ],
        description: '💰 الفوترة والمقاصة المالية بين الأطراف'
    }
};

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

function openService(type, id, name) {
    const modal = document.getElementById('serviceModal');
    document.getElementById('modalTitle').textContent = name;
    document.getElementById('modalBody').innerHTML = generateContent(id);
    modal.classList.add('show');
    modal.style.display = 'flex';
}

function generateContent(serviceId) {
    const data = mockData[serviceId];
    if (!data) return `<div class="empty-state"><i class="fas fa-cog"></i><p>قيد التطوير</p></div>`;
    if (data.stats) {
        return data.stats.map(s => `<div class="modal-stat"><span class="stat-label">${s.label}</span><span class="stat-value">${s.value}</span></div>`).join('') +
            (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }
    if (data.table && data.headers && data.rows) {
        let html = `<table class="mock-table"><thead><tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;
        data.rows.forEach(row => { html += `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`; });
        html += `</tbody></table>`;
        return html;
    }
    if (data.info) {
        return data.info.map(i => `<div class="modal-stat"><span class="stat-label">${i.label}</span><span class="stat-value">${i.value}</span></div>`).join('');
    }
    if (data.ads) {
        return data.ads.map(a => `<div class="modal-stat"><span class="stat-label">${a.title}</span><span class="stat-value">${a.status} (${a.date})</span></div>`).join('') +
            (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }
    if (data.pending) {
        let html = `<table class="mock-table"><thead><tr><th>الاسم</th><th>المسؤول</th><th>التاريخ</th><th>الحالة</th></tr></thead><tbody>`;
        data.pending.forEach(p => { html += `<tr><td>${p.name}</td><td>${p.owner || p.from}</td><td>${p.date}</td><td><span class="badge-status yellow">${p.status || 'قيد المراجعة'}</span></td></tr>`; });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }
    if (data.medicines) {
        let html = `<table class="mock-table"><thead><tr><th>الدواء</th><th>الدفعة</th><th>المصدر</th><th>الحالة</th></tr></thead><tbody>`;
        data.medicines.forEach(m => { html += `<tr><td>${m.name}</td><td>${m.batch}</td><td>${m.source}</td><td><span class="badge-status ${m.status.includes('✅') ? 'green' : 'red'}">${m.status}</span></td></tr>`; });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }
    return `<div class="empty-state"><i class="fas fa-file-alt"></i><p>بيانات غير متوفرة</p></div>`;
}

function closeModal() { const modal = document.getElementById('serviceModal'); modal.classList.remove('show'); setTimeout(() => { modal.style.display = 'none'; }, 300); }

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
function clearSearch() { document.getElementById('searchInput').value = ''; filterServices(''); }

function navigateTo(page) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const pages = ['home', 'users', 'pharmacies', 'clinics', 'more'];
    const index = pages.indexOf(page);
    if (index !== -1) document.querySelectorAll('.nav-item')[index].classList.add('active');
    alert(`📍 التنقل إلى: ${page}`);
}

function logout() {
    if (confirm('هل أنت متأكد من الخروج؟')) { localStorage.clear(); sessionStorage.clear(); window.location.href = '../../index.html'; }
}

function showSplash() {
    const splash = document.getElementById('splashScreen');
    splash.classList.add('show');
    setTimeout(() => { splash.classList.remove('show'); splash.classList.add('hide'); setTimeout(() => { splash.style.display = 'none'; }, 600); }, 2000);
}

document.addEventListener('DOMContentLoaded', function() { showSplash(); renderServices(); console.log('✅ Admin Module Loaded (12 services)'); });

window.openService = openService;
window.closeModal = closeModal;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;