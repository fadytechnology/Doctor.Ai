const CLINIC_SERVICES = [
    // تطبيقية (8)
    { id: 'cl-dashboard', name: 'لوحة التحكم', icon: 'fa-chart-pie', category: 'تطبيقية', description: 'إحصائيات المواعيد والمرضى', url: 'services/cl-dashboard.html' },
    { id: 'cl-appointments', name: 'إدارة المواعيد', icon: 'fa-calendar-alt', category: 'تطبيقية', description: 'جدولة وإدارة المواعيد', url: 'services/cl-appointments.html' },
    { id: 'cl-patients', name: 'إدارة المرضى', icon: 'fa-users', category: 'تطبيقية', description: 'عرض وتعديل بيانات المرضى', url: 'services/cl-patients.html' },
    { id: 'cl-examinations', name: 'الكشوفات الطبية', icon: 'fa-notes-medical', category: 'تطبيقية', description: 'تسجيل الكشوفات والتشخيصات', url: 'services/cl-examinations.html' },
    { id: 'cl-reports', name: 'التقارير الطبية', icon: 'fa-file-medical', category: 'تطبيقية', description: 'رفع وعرض تقارير المرضى', url: 'services/cl-reports.html' },
    { id: 'cl-ehr', name: 'السجل الطبي الموحد (EHR)', icon: 'fa-folder-open', category: 'تطبيقية', description: 'استعراض تاريخ المريض', url: 'services/cl-ehr.html' },
    { id: 'cl-settings', name: 'إعدادات العيادة', icon: 'fa-cog', category: 'تطبيقية', description: 'تعديل بيانات العيادة', url: 'services/cl-settings.html' },
    { id: 'cl-treatment-monitor', name: 'متابعة العلاج', icon: 'fa-chart-line', category: 'تطبيقية', description: 'مراقبة التزام المريض', url: 'services/cl-treatment-monitor.html' },
    // ربط (6)
    { id: 'cl-prescriptions', name: 'الروشتات الرقمية', icon: 'fa-prescription', category: 'ربط', description: 'كتابة وإرسال الروشتات', url: 'services/cl-prescriptions.html' },
    { id: 'cl-drug-availability', name: 'مؤشر توافر الدواء', icon: 'fa-pills', category: 'ربط', description: 'معرفة توفر الدواء بالصيدليات', url: 'services/cl-drug-availability.html' },
    { id: 'cl-lab-orders', name: 'التوجيه للمختبرات', icon: 'fa-flask', category: 'ربط', description: 'إرسال طلبات التحاليل', url: 'services/cl-lab-orders.html' },
    { id: 'cl-radiology-booking', name: 'حجز الأشعة', icon: 'fa-x-ray', category: 'ربط', description: 'حجز مواعيد الأشعة', url: 'services/cl-radiology-booking.html' },
    { id: 'cl-collab-code', name: 'كود التعاون', icon: 'fa-qrcode', category: 'ربط', description: 'كود لربط المرضى', url: 'services/cl-collab-code.html' },
    { id: 'cl-share-ehr', name: 'مشاركة الملف الطبي', icon: 'fa-share-alt', category: 'ربط', description: 'مشاركة الملف مع الطبيب', url: 'services/cl-share-ehr.html' }
];
localStorage.setItem('clinicServices', JSON.stringify(CLINIC_SERVICES));
console.log('✅ CLINIC_SERVICES loaded! (' + CLINIC_SERVICES.length + ' services)');