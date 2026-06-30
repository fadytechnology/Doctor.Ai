// ============================================================
// ===== supplier.js - مورد (12 خدمة) =====
// ============================================================

const appServices = [
    { id: 'dashboard', icon: 'fa-chart-pie', name: 'لوحة التحكم' },
    { id: 'medicines', icon: 'fa-capsules', name: 'إدارة الأدوية' },
    { id: 'warehouses', icon: 'fa-warehouse', name: 'إدارة المخازن' },
    { id: 'analytics', icon: 'fa-chart-bar', name: 'تحليلات المبيعات' },
    { id: 'group-purchasing', icon: 'fa-handshake', name: 'الشراء الجماعي' },
    { id: 'demand-forecast', icon: 'fa-brain', name: 'التنبؤ بالطلب' },
    { id: 'settings', icon: 'fa-cog', name: 'إعدادات المورد' }
];

const linkServices = [
    { id: 'receive-orders', icon: 'fa-clipboard-list', name: 'استقبال طلبات' },
    { id: 'b2b-market', icon: 'fa-store-alt', name: 'سوق B2B' },
    { id: 'shortage-alerts', icon: 'fa-exclamation-triangle', name: 'تنبيه النواقص' },
    { id: 'dispose-surplus', icon: 'fa-tags', name: 'تصريف الرواكد' },
    { id: 'collab-code', icon: 'fa-qrcode', name: 'كود التعاون' }
];

const mockData = {
    dashboard: {
        stats: [
            { label: 'أدوية متاحة', value: '24' },
            { label: 'طلبات اليوم', value: '8' },
            { label: 'مخازن نشطة', value: '3' },
            { label: 'رواكد للبيع', value: '5' }
        ],
        description: '📊 ملخص نشاط المورد'
    },
    medicines: {
        table: true,
        headers: ['الدواء', 'الكمية', 'السعر', 'المخزن'],
        rows: [
            ['باراسيتامول', '1000 شريط', '12 ج.م', 'مخزن 1'],
            ['أموكسيسيلين', '500 شريط', '30 ج.م', 'مخزن 1'],
            ['فيتامين C', '2000 علبة', '8 ج.م', 'مخزن 2'],
            ['أنسولين', '100 زجاجة', '150 ج.م', 'مخزن 2']
        ]
    },
    warehouses: {
        table: true,
        headers: ['المخزن', 'الموقع', 'السعة', 'المستخدم'],
        rows: [
            ['مخزن 1', 'القاهرة', '80%', '5000 وحدة'],
            ['مخزن 2', 'الإسكندرية', '45%', '3000 وحدة'],
            ['مخزن 3', 'الجيزة', '60%', '2000 وحدة']
        ]
    },
    analytics: {
        stats: [
            { label: 'أعلى مبيعات (منتج)', value: 'باراسيتامول' },
            { label: 'أعلى شهر مبيعات', value: 'مارس 2026' },
            { label: 'إجمالي المبيعات', value: '245,000 ج.م' }
        ],
        description: '📈 تحليلات المبيعات والأداء'
    },
    'group-purchasing': {
        offers: [
            { name: 'باراسيتامول', qty: '5000 شريط', discount: '15%', price: '10 ج.م' },
            { name: 'أموكسيسيلين', qty: '2000 شريط', discount: '10%', price: '27 ج.م' }
        ],
        description: '🛒 عروض الشراء الجماعي المتاحة'
    },
    'demand-forecast': {
        forecast: [
            { med: 'باراسيتامول', current: '1000', predicted: '1500', change: '+50%' },
            { med: 'أموكسيسيلين', current: '500', predicted: '600', change: '+20%' },
            { med: 'فيتامين C', current: '2000', predicted: '1800', change: '-10%' }
        ],
        description: '🔮 التنبؤ بالطلب المستقبلي'
    },
    settings: {
        info: [
            { label: 'اسم الشركة', value: 'مورد الأدوية المتميز' },
            { label: 'الرخصة', value: 'رقم 12345' },
            { label: 'ساعات العمل', value: '9 ص - 5 م' }
        ]
    },
    'receive-orders': {
        table: true,
        headers: ['الصيدلية', 'المنتج', 'الكمية', 'الحالة'],
        rows: [
            ['صيدلية النور', 'باراسيتامول', '100 شريط', 'قيد التجهيز'],
            ['صيدلية الرحمة', 'أموكسيسيلين', '50 شريط', 'جاهز للشحن']
        ]
    },
    'b2b-market': {
        listings: [
            { pharmacy: 'صيدلية الحكمة', offer: 'أنسولين 50 زجاجة', price: '120 ج.م' },
            { pharmacy: 'صيدلية الفردوس', offer: 'مضاد حيوي 200 شريط', price: '25 ج.م' }
        ],
        description: '🤝 سوق B2B - تبادل الأدوية بين الموردين'
    },
    'shortage-alerts': {
        alerts: [
            { med: 'أموكسيسيلين', from: 'صيدلية النور', status: 'ناقص' },
            { med: 'أنسولين', from: 'صيدلية الرحمة', status: 'نفد بالكامل' }
        ],
        description: '⚠️ تنبيهات النواقص من الصيدليات'
    },
    'dispose-surplus': {
        surplus: [
            { med: 'فيتامين D', qty: '500 علبة', expiry: '3 أشهر', discount: '30%' },
            { med: 'أسبرين', qty: '1000 شريط', expiry: 'شهران', discount: '20%' }
        ],
        description: '🏷️ تصريف الأدوية الراكدة بخصومات'
    },
    'collab-code': {
        code: 'SUP-2024-001',
        description: 'شارك هذا الكود مع الصيدليات للربط',
        instructions: 'يتيح للصيدليات طلب التوريد مباشرة'
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
    if (data.offers) {
        let html = `<table class="mock-table"><thead><tr><th>المنتج</th><th>الكمية</th><th>الخصم</th><th>السعر</th></tr></thead><tbody>`;
        data.offers.forEach(o => { html += `<tr><td>${o.name}</td><td>${o.qty}</td><td>${o.discount}</td><td>${o.price}</td></tr>`; });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }
    if (data.forecast) {
        let html = `<table class="mock-table"><thead><tr><th>الدواء</th><th>الحالي</th><th>المتوقع</th><th>التغيير</th></tr></thead><tbody>`;
        data.forecast.forEach(f => { html += `<tr><td>${f.med}</td><td>${f.current}</td><td>${f.predicted}</td><td>${f.change}</td></tr>`; });
        html += `</tbody></table>`;
        if (data.description) html += `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>`;
        return html;
    }
    if (data.listings) {
        return data.listings.map(l => `<div class="modal-stat"><span class="stat-label">${l.pharmacy}</span><span class="stat-value">${l.offer} - ${l.price}</span></div>`).join('') +
            (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }
    if (data.alerts) {
        return data.alerts.map(a => `<div class="modal-stat"><span class="stat-label">${a.med}</span><span class="stat-value">${a.from}: ${a.status}</span></div>`).join('') +
            (data.description ? `<p style="margin-top:12px;font-size:13px;color:#64748b;">${data.description}</p>` : '');
    }
    if (data.surplus) {
        let html = `<table class="mock-table"><thead><tr><th>الدواء</th><th>الكمية</th><th>الصلاحية</th><th>الخصم</th></tr></thead><tbody>`;
        data.surplus.forEach(s => { html += `<tr><td>${s.med}</td><td>${s.qty}</td><td>${s.expiry}</td><td>${s.discount}</td></tr>`; });
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
    const pages = ['home', 'medicines', 'orders', 'warehouses', 'more'];
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

document.addEventListener('DOMContentLoaded', function() { showSplash(); renderServices(); console.log('✅ Supplier Module Loaded (12 services)'); });

window.openService = openService;
window.closeModal = closeModal;
window.navigateTo = navigateTo;
window.logout = logout;
window.filterServices = filterServices;
window.clearSearch = clearSearch;