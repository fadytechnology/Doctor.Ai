const RADIOLOGY_SERVICES = [
    // تطبيقية (6)
    { id: 'rad-dashboard', name: 'لوحة التحكم', icon: 'fa-chart-pie', category: 'تطبيقية', description: 'إحصائيات الحجوزات والتقارير', url: 'services/rad-dashboard.html' },
    { id: 'rad-bookings', name: 'إدارة الحجوزات', icon: 'fa-calendar-check', category: 'تطبيقية', description: 'جدولة وإدارة المواعيد', url: 'services/rad-bookings.html' },
    { id: 'rad-reports', name: 'إدارة التقارير', icon: 'fa-file-alt', category: 'تطبيقية', description: 'رفع وعرض تقارير الأشعة', url: 'services/rad-reports.html' },
    { id: 'rad-images', name: 'صور الأشعة', icon: 'fa-image', category: 'تطبيقية', description: 'رفع وعرض صور الأشعة', url: 'services/rad-images.html' },
    { id: 'rad-send', name: 'إرسال التقارير', icon: 'fa-paper-plane', category: 'تطبيقية', description: 'إرسال التقارير للأطباء', url: 'services/rad-send.html' },
    { id: 'rad-settings', name: 'إعدادات المركز', icon: 'fa-cog', category: 'تطبيقية', description: 'بيانات المركز والأجهزة', url: 'services/rad-settings.html' },
    // ربط (5)
    { id: 'rad-receive-bookings', name: 'استقبال حجوزات', icon: 'fa-clipboard-list', category: 'ربط', description: 'استقبال حجوزات من العيادات', url: 'services/rad-receive-bookings.html' },
    { id: 'rad-send-to-patient', name: 'إرسال للمريض والطبيب', icon: 'fa-user-md', category: 'ربط', description: 'إرسال التقارير مباشرة', url: 'services/rad-send-to-patient.html' },
    { id: 'rad-cloud-archive', name: 'الأرشفة السحابية', icon: 'fa-cloud-upload-alt', category: 'ربط', description: 'رفع الصور على ملف المريض', url: 'services/rad-cloud-archive.html' },
    { id: 'rad-collab-code', name: 'كود التعاون', icon: 'fa-qrcode', category: 'ربط', description: 'كود لربط المرضى', url: 'services/rad-collab-code.html' }
];
localStorage.setItem('radiologyServices', JSON.stringify(RADIOLOGY_SERVICES));
console.log('✅ RADIOLOGY_SERVICES loaded! (' + RADIOLOGY_SERVICES.length + ' services)');