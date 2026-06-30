// ============================================================
// ===== radiology.js - مركز الأشعة (11 خدمة) =====
// ============================================================

const appServices = [
    { id: 'dashboard', icon: 'fa-chart-pie', name: 'لوحة التحكم' },
    { id: 'bookings', icon: 'fa-calendar-check', name: 'إدارة الحجوزات' },
    { id: 'reports', icon: 'fa-file-alt', name: 'إدارة التقارير' },
    { id: 'images', icon: 'fa-image', name: 'صور الأشعة' },
    { id: 'send-reports', icon: 'fa-paper-plane', name: 'إرسال التقارير' },
    { id: 'settings', icon: 'fa-cog', name: 'إعدادات المركز' }
];

const linkServices = [
    { id: 'receive-bookings', icon: 'fa-clipboard-list', name: 'استقبال حجوزات' },
    { id: 'send-to-patient', icon: 'fa-user-md', name: 'إرسال للمريض والطبيب' },
    { id: 'cloud-archive', icon: 'fa-cloud-upload-alt', name: 'الأرشفة السحابية' },
    { id: 'collab-code', icon: 'fa-qrcode', name: 'كود التعاون' }
];

const mockData = {
    dashboard: {
        stats: [
            { label: 'حجوزات اليوم', value: '8' },
            { label: 'قيد التنفيذ', value: '5' },
            { label: 'تقارير جاهزة', value: '3' },
            { label: 'صور مؤرشفة', value: '12' }
        ],
        description: '📊 ملخص نشاط مركز الأشعة'
    },
    bookings: {
        table: true,
        headers: ['المريض', 'النوع', 'التاريخ', 'الحالة'],
        rows: [
            ['محمد علي', 'أشعة مقطعية', '28/6/2026', 'قيد التنفيذ'],
            ['سارة حسن', 'أشعة عادية', '28/6/2026', 'جاهز'],
            ['خالد محمود', 'رنين مغناطيسي', '27/6/2026', 'مرسل']
        ]
    },
    reports: {
        table: true,
        headers: ['المريض', 'التقرير', 'التاريخ', 'الحالة'],
        rows: [
            ['محمد علي', 'تقرير الأشعة المقطعية', '28/6/2026', 'جاهز'],
            ['سارة حسن', 'تقرير الأشعة العادية', '28/6/2026', 'قيد الكتابة']
        ]
    },
    images: {
        table: true,
        headers: ['المريض', 'نوع الصورة', 'التاريخ', 'الحالة'],
        rows: [
            ['محمد علي', 'مقطعية (3 صور)', '28/6/2026', 'مرفوعة'],
            ['سارة حسن', 'عادية (2 صور)', '27/6/2026', 'مرفوعة']
        ]
    },
    'send-reports': {
        table: true,
        headers: ['المريض', 'مرسل لـ', 'التاريخ', 'الحالة'],
        rows: [
            ['محمد علي', 'د. خالد', '28/6/2026', 'مرسل ✅'],
            ['سارة حسن', 'المريض', '27/6/2026', 'مرسل ✅']
        ]
    },
    settings: {
        info: [
            { label: 'اسم المركز', value: 'مركز الأشعة الحديث' },
            { label: 'الأجهزة', value: 'مقطعي, عادي, رنين' },
            { label: 'ساعات العمل', value: '8 ص - 10 م' }
        ]
    },
    'receive-bookings': {
        table: true,
        headers: ['الطبيب', 'المريض', 'النوع', 'الحالة'],
        rows: [
            ['د. خالد', 'محمد علي', 'مقطعية', 'قيد المراجعة'],
            ['د. سارة', 'نورا أحمد', 'عادية', 'مؤكد']
        ]
    },
    'send-to-patient': {
        table: true,
        headers: ['المريض', 'المرسل', 'التاريخ', 'الحالة'],
        rows: [
            ['محمد علي', 'د. خالد', '28/6/2026', 'مرسل'],
            ['سارة حسن', 'المريض', '27/6/2026', 'مرسل']
        ]
    },
    'cloud-archive': {
        archives: [
            { patient: 'محمد علي', date: '20/6/2026', files: 'صور + تقرير' },
            { patient: 'سارة حسن', date: '15/6/2026', files: 'صور + تقرير' }
        ],
        description: '📁 الملفات المؤرشفة في السحابة'
    },
    'collab-code': {
        code: 'RAD-2024-001',
        description: 'شارك هذا الكود مع العيادات والمرضى للربط',
        instructions: 'يظهر الكود في الفواتير والتقارير'
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
    if (data.archives) {
        let html = `<table class="mock-table"><thead><tr><th>المريض</th><th>التاريخ</th><th>الملفات</th></tr></thead><tbody>`;
        data.archives.forEach(a => { html += `<tr><td>${a.patient}</td><td>${a.date}</td><td>${a.files}</td></tr>`; });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }
    if (data.code) {
        return `<div style="text-align:center;padding:20px 0;"><div style="font-size:32px;font-weight:800;color:#0d9488;background:#d1fae5;padding:16px;border-radius:16px;display:inline-block;">${data.code}</div><p style="margin-top:16px;color:#64748b;">${data.description}</p><p style="font-size:13px;color:#94a3b8;margin-top:8px;">${data.instructions || ''}</p></div>`;
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
    const pages = ['home', 'bookings', 'reports', 'images', 'more'];
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

document.addEventListener('DOMContentLoaded', function() { showSplash(); renderServices(); console.log('✅ Radiology Module Loaded (11 services)'); });

window.openService = openService;
window.closeModal = closeModal;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;