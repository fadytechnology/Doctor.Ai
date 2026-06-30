// ============================================================
// ===== lab.js - معمل (11 خدمة) =====
// ============================================================

// ----- خدمات تطبيقية (6) -----
const appServices = [
    { id: 'dashboard', icon: 'fa-chart-pie', name: 'لوحة التحكم' },
    { id: 'samples', icon: 'fa-vial', name: 'إدارة العينات' },
    { id: 'tests', icon: 'fa-flask', name: 'إدارة التحاليل' },
    { id: 'results', icon: 'fa-file-medical', name: 'عرض النتائج' },
    { id: 'appointments', icon: 'fa-calendar-alt', name: 'مواعيد السحب' },
    { id: 'settings', icon: 'fa-cog', name: 'إعدادات المعمل' }
];

// ----- خدمات ربط (5) -----
const linkServices = [
    { id: 'receive-orders', icon: 'fa-clipboard-list', name: 'استقبال طلبات' },
    { id: 'send-results', icon: 'fa-paper-plane', name: 'إرسال النتائج' },
    { id: 'critical-alerts', icon: 'fa-exclamation-triangle', name: 'إشعارات حرجة' },
    { id: 'collab-code', icon: 'fa-qrcode', name: 'كود التعاون' },
    { id: 'cloud-archive', icon: 'fa-cloud-upload-alt', name: 'الأرشفة السحابية' }
];

// ----- بيانات وهمية -----
const mockData = {
    dashboard: {
        stats: [
            { label: 'عينات اليوم', value: '18' },
            { label: 'قيد التحليل', value: '7' },
            { label: 'نتائج جاهزة', value: '5' },
            { label: 'نتائج حرجة', value: '2' }
        ],
        description: '📊 ملخص نشاط المعمل اليوم'
    },
    samples: {
        table: true,
        headers: ['المريض', 'التحليل', 'الحالة', 'التاريخ'],
        rows: [
            ['محمد علي', 'صورة دم كاملة', 'قيد التحليل', '28/6/2026'],
            ['سارة حسن', 'وظائف كبد', 'جاهز', '27/6/2026'],
            ['خالد محمود', 'سكر تراكمي', 'مرسل', '26/6/2026']
        ]
    },
    tests: {
        table: true,
        headers: ['التحليل', 'السعر', 'المدة', 'متاح'],
        rows: [
            ['صورة دم كاملة', '150 ج.م', 'ساعتان', 'نعم'],
            ['وظائف كبد', '200 ج.م', '3 ساعات', 'نعم'],
            ['سكر تراكمي', '100 ج.م', 'ساعة', 'نعم'],
            ['هرمونات', '300 ج.م', 'يوم', 'نعم']
        ]
    },
    results: {
        table: true,
        headers: ['المريض', 'التحليل', 'النتيجة', 'الحالة'],
        rows: [
            ['محمد علي', 'صورة دم', 'طبيعي', '✅ جاهز'],
            ['سارة حسن', 'وظائف كبد', 'مرتفع', '⚠️ غير طبيعي'],
            ['خالد محمود', 'سكر', 'طبيعي', '✅ جاهز']
        ]
    },
    appointments: {
        table: true,
        headers: ['المريض', 'التاريخ', 'الوقت', 'الحالة'],
        rows: [
            ['نورا أحمد', '29/6/2026', '10:00 ص', 'مؤكد'],
            ['علي محمود', '29/6/2026', '12:00 م', 'قيد الانتظار']
        ]
    },
    settings: {
        info: [
            { label: 'اسم المعمل', value: 'معمل المختبر' },
            { label: 'الشهادات', value: 'ISO 15189' },
            { label: 'ساعات العمل', value: '8 ص - 8 م' }
        ]
    },
    'receive-orders': {
        table: true,
        headers: ['الطبيب', 'المريض', 'التحليل', 'الحالة'],
        rows: [
            ['د. خالد', 'محمد علي', 'صورة دم', 'قيد الاستلام'],
            ['د. سارة', 'نورا أحمد', 'وظائف كبد', 'تم الاستلام']
        ]
    },
    'send-results': {
        table: true,
        headers: ['المريض', 'التحليل', 'مرسل لـ', 'الحالة'],
        rows: [
            ['محمد علي', 'صورة دم', 'المريض', 'مرسل ✅'],
            ['سارة حسن', 'وظائف كبد', 'د. خالد', 'مرسل ✅']
        ]
    },
    'critical-alerts': {
        alerts: [
            { patient: 'سارة حسن', test: 'وظائف كبد', result: 'مرتفع جداً', doctor: 'د. خالد' },
            { patient: 'خالد محمود', test: 'سكر', result: '400 مجم/دل', doctor: 'د. أحمد' }
        ],
        description: '⚠️ نتائج حرجة تحتاج تدخل فوري'
    },
    'collab-code': {
        code: 'LAB-2024-001',
        description: 'شارك هذا الكود مع العيادات والمرضى للربط',
        instructions: 'يظهر الكود في الفواتير والتقارير'
    },
    'cloud-archive': {
        archives: [
            { patient: 'محمد علي', date: '20/6/2026', files: '3 ملفات' },
            { patient: 'سارة حسن', date: '15/6/2026', files: '2 ملفات' }
        ],
        description: '📁 الملفات المؤرشفة في السحابة'
    }
};

// ----- عرض الخدمات -----
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
    if (data.alerts) {
        return data.alerts.map(a => `<div class="modal-stat"><span class="stat-label">${a.patient}</span><span class="stat-value">${a.test}: ${a.result} (طبيب: ${a.doctor})</span></div>`).join('') +
            (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }
    if (data.code) {
        return `<div style="text-align:center;padding:20px 0;"><div style="font-size:32px;font-weight:800;color:#0d9488;background:#d1fae5;padding:16px;border-radius:16px;display:inline-block;">${data.code}</div><p style="margin-top:16px;color:#64748b;">${data.description}</p><p style="font-size:13px;color:#94a3b8;margin-top:8px;">${data.instructions || ''}</p></div>`;
    }
    if (data.archives) {
        let html = `<table class="mock-table"><thead><tr><th>المريض</th><th>التاريخ</th><th>الملفات</th></tr></thead><tbody>`;
        data.archives.forEach(a => { html += `<tr><td>${a.patient}</td><td>${a.date}</td><td>${a.files}</td></tr>`; });
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
    const pages = ['home', 'samples', 'results', 'patients', 'more'];
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

document.addEventListener('DOMContentLoaded', function() { showSplash(); renderServices(); console.log('✅ Lab Module Loaded (11 services)'); });

window.openService = openService;
window.closeModal = closeModal;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;