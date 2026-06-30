const SUPPLIER_SERVICES = [
    // تطبيقية (7)
    { id: 'sup-dashboard', name: 'لوحة التحكم', icon: 'fa-chart-pie', category: 'تطبيقية', description: 'إحصائيات الأدوية والطلبات', url: 'services/sup-dashboard.html' },
    { id: 'sup-medicines', name: 'إدارة الأدوية', icon: 'fa-capsules', category: 'تطبيقية', description: 'إضافة وتعديل الأدوية', url: 'services/sup-medicines.html' },
    { id: 'sup-warehouses', name: 'إدارة المخازن', icon: 'fa-warehouse', category: 'تطبيقية', description: 'مستويات التخزين والإدارة', url: 'services/sup-warehouses.html' },
    { id: 'sup-analytics', name: 'تحليلات المبيعات', icon: 'fa-chart-bar', category: 'تطبيقية', description: 'رسوم بيانية للمبيعات', url: 'services/sup-analytics.html' },
    { id: 'sup-group-purchasing', name: 'الشراء الجماعي', icon: 'fa-handshake', category: 'تطبيقية', description: 'تجميع طلبات لخصومات', url: 'services/sup-group-purchasing.html' },
    { id: 'sup-demand-forecast', name: 'التنبؤ بالطلب', icon: 'fa-brain', category: 'تطبيقية', description: 'تحليل الطلب المستقبلي', url: 'services/sup-demand-forecast.html' },
    { id: 'sup-settings', name: 'إعدادات المورد', icon: 'fa-cog', category: 'تطبيقية', description: 'بيانات الشركة والعروض', url: 'services/sup-settings.html' },
    // ربط (5)
    { id: 'sup-receive-orders', name: 'استقبال طلبات الصيدليات', icon: 'fa-clipboard-list', category: 'ربط', description: 'استقبال طلبات التوريد', url: 'services/sup-receive-orders.html' },
    { id: 'sup-b2b-market', name: 'سوق B2B', icon: 'fa-store-alt', category: 'ربط', description: 'عرض الأدوية الراكدة', url: 'services/sup-b2b-market.html' },
    { id: 'sup-shortage-alerts', name: 'تنبيه النواقص', icon: 'fa-exclamation-triangle', category: 'ربط', description: 'استقبال تنبيهات النقص', url: 'services/sup-shortage-alerts.html' },
    { id: 'sup-dispose-surplus', name: 'تصريف الرواكد', icon: 'fa-tags', category: 'ربط', description: 'دفع الصيدليات لشراء الرواكد', url: 'services/sup-dispose-surplus.html' },
    { id: 'sup-collab-code', name: 'كود التعاون', icon: 'fa-qrcode', category: 'ربط', description: 'كود لربط الصيدليات', url: 'services/sup-collab-code.html' }
];
localStorage.setItem('supplierServices', JSON.stringify(SUPPLIER_SERVICES));
console.log('✅ SUPPLIER_SERVICES loaded! (' + SUPPLIER_SERVICES.length + ' services)');