const LAB_SERVICES = [
    // تطبيقية (6)
    { id: 'lab-dashboard', name: 'لوحة التحكم', icon: 'fa-chart-pie', category: 'تطبيقية', description: 'إحصائيات العينات والنتائج', url: 'services/lab-dashboard.html' },
    { id: 'lab-samples', name: 'إدارة العينات', icon: 'fa-vial', category: 'تطبيقية', description: 'تسجيل واستلام العينات', url: 'services/lab-samples.html' },
    { id: 'lab-tests', name: 'إدارة التحاليل', icon: 'fa-flask', category: 'تطبيقية', description: 'تسجيل نتائج التحاليل', url: 'services/lab-tests.html' },
    { id: 'lab-results', name: 'عرض النتائج', icon: 'fa-file-medical', category: 'تطبيقية', description: 'عرض النتائج مع التصنيف', url: 'services/lab-results.html' },
    { id: 'lab-appointments', name: 'مواعيد السحب', icon: 'fa-calendar-alt', category: 'تطبيقية', description: 'جدولة مواعيد سحب العينات', url: 'services/lab-appointments.html' },
    { id: 'lab-settings', name: 'إعدادات المعمل', icon: 'fa-cog', category: 'تطبيقية', description: 'بيانات المعمل والشهادات', url: 'services/lab-settings.html' },
    // ربط (5)
    { id: 'lab-receive-orders', name: 'استقبال طلبات التحاليل', icon: 'fa-clipboard-list', category: 'ربط', description: 'استقبال طلبات من العيادات', url: 'services/lab-receive-orders.html' },
    { id: 'lab-send-results', name: 'إرسال النتائج', icon: 'fa-paper-plane', category: 'ربط', description: 'إرسال النتائج للمريض والطبيب', url: 'services/lab-send-results.html' },
    { id: 'lab-critical-alerts', name: 'إشعارات النتائج الحرجة', icon: 'fa-exclamation-triangle', category: 'ربط', description: 'تنبيه فوري للطبيب', url: 'services/lab-critical-alerts.html' },
    { id: 'lab-collab-code', name: 'كود التعاون', icon: 'fa-qrcode', category: 'ربط', description: 'كود لربط المرضى', url: 'services/lab-collab-code.html' },
    { id: 'lab-cloud-archive', name: 'الأرشفة السحابية', icon: 'fa-cloud-upload-alt', category: 'ربط', description: 'رفع النتائج على ملف المريض', url: 'services/lab-cloud-archive.html' }
];
localStorage.setItem('labServices', JSON.stringify(LAB_SERVICES));
console.log('✅ LAB_SERVICES loaded! (' + LAB_SERVICES.length + ' services)');