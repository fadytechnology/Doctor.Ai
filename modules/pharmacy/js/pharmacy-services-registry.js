// ============================================================
// ===== سجل خدمات الصيدلي (17 خدمة) - النسخة الكاملة =====
// ============================================================

const PHARMACY_SERVICES = [
    // ===== خدمات تطبيقية (9) =====
    {
        id: 'ph-dashboard',
        name: 'لوحة التحكم',
        icon: 'fa-chart-pie',
        category: 'تطبيقية',
        description: 'عرض إحصائيات الطلبات والعملاء والمخزون',
        url: 'services/ph-dashboard.html',
        fields: [],
        compute: function() {
            return { message: '📊 لوحة التحكم - إحصائيات الصيدلية' };
        }
    },
    {
        id: 'ph-inventory',
        name: 'إدارة المخزون',
        icon: 'fa-boxes',
        category: 'تطبيقية',
        description: 'إضافة، تعديل، حذف المنتجات مع الكمية والصلاحية',
        url: 'services/ph-inventory.html',
        fields: [],
        compute: function() {
            return { message: '📦 إدارة المخزون - منتجات الصيدلية' };
        }
    },
    {
        id: 'ph-orders',
        name: 'إدارة الطلبات',
        icon: 'fa-shopping-cart',
        category: 'تطبيقية',
        description: 'عرض الطلبات الواردة وتحديث حالتها',
        url: 'services/ph-orders.html',
        fields: [],
        compute: function() {
            return { message: '📋 إدارة الطلبات - طلبات المرضى' };
        }
    },
    {
        id: 'ph-store',
        name: 'المتجر الإلكتروني',
        icon: 'fa-store',
        category: 'تطبيقية',
        description: 'عرض المنتجات للمرضى المربوطين',
        url: 'services/ph-store.html',
        fields: [],
        compute: function() {
            return { message: '🛒 المتجر الإلكتروني - منتجاتك للعملاء' };
        }
    },
    {
        id: 'ph-loyalty',
        name: 'نظام الولاء والنقاط',
        icon: 'fa-gem',
        category: 'تطبيقية',
        description: 'إدارة نقاط العملاء وقواعد الكاش باك',
        url: 'services/ph-loyalty.html',
        fields: [],
        compute: function() {
            return { message: '💎 نظام الولاء - نقاط العملاء' };
        }
    },
    {
        id: 'ph-analytics',
        name: 'تحليلات المبيعات',
        icon: 'fa-chart-bar',
        category: 'تطبيقية',
        description: 'رسوم بيانية للمبيعات وأفضل المنتجات',
        url: 'services/ph-analytics.html',
        fields: [],
        compute: function() {
            return { message: '📊 تحليلات المبيعات - أداء الصيدلية' };
        }
    },
    {
        id: 'ph-alerts',
        name: 'تنبيهات المخزون',
        icon: 'fa-bell',
        category: 'تطبيقية',
        description: 'إشعارات عند نفاد أو انتهاء صلاحية منتج',
        url: 'services/ph-alerts.html',
        fields: [],
        compute: function() {
            return { message: '🔔 تنبيهات المخزون - منتجات تحتاج اهتمام' };
        }
    },
    {
        id: 'ph-settings',
        name: 'إعدادات الصيدلية',
        icon: 'fa-cog',
        category: 'تطبيقية',
        description: 'تعديل بيانات الصيدلية وساعات العمل والنقاط',
        url: 'services/ph-settings.html',
        fields: [],
        compute: function() {
            return { message: '⚙️ إعدادات الصيدلية - بياناتك الشخصية' };
        }
    },
    {
        id: 'ph-customers',
        name: 'إدارة العملاء',
        icon: 'fa-users',
        category: 'تطبيقية',
        description: 'عرض قائمة العملاء المربوطين ونقاطهم',
        url: 'services/ph-customers.html',
        fields: [],
        compute: function() {
            return { message: '👥 إدارة العملاء - مرضاك المربوطين' };
        }
    },

    // ===== خدمات ربط (8) =====
    {
        id: 'ph-receive-orders',
        name: 'استقبال الطلبات',
        icon: 'fa-clipboard-list',
        category: 'ربط',
        description: 'استقبال طلبات الأدوية من المرضى المربوطين',
        url: 'services/ph-receive-orders.html',
        fields: [],
        compute: function() {
            return { message: '📥 استقبال الطلبات - طلبات جديدة من مرضاك' };
        }
    },
    {
        id: 'ph-collab-code',
        name: 'كود التعاون',
        icon: 'fa-qrcode',
        category: 'ربط',
        description: 'إصدار كود فريد للصيدلية لربط المرضى',
        url: 'services/ph-collab-code.html',
        fields: [],
        compute: function() {
            return { message: '🔑 كود التعاون - شاركه مع مرضاك' };
        }
    },
    {
        id: 'ph-b2b',
        name: 'سوق B2B',
        icon: 'fa-handshake',
        category: 'ربط',
        description: 'تبادل الأدوية الراكدة والناقصة مع صيدليات أخرى',
        url: 'services/ph-b2b.html',
        fields: [],
        compute: function() {
            return { message: '🤝 سوق B2B - تبادل الأدوية مع الصيدليات' };
        }
    },
    {
        id: 'ph-shortage-alerts',
        name: 'تنبيه النواقص',
        icon: 'fa-exclamation-triangle',
        category: 'ربط',
        description: 'إشعار عند نقص دواء محدد في السوق',
        url: 'services/ph-shortage-alerts.html',
        fields: [],
        compute: function() {
            return { message: '⚠️ تنبيه النواقص - أدوية ناقصة في السوق' };
        }
    },
    {
        id: 'ph-news',
        name: 'نشر أخبار وعروض',
        icon: 'fa-bullhorn',
        category: 'ربط',
        description: 'نشر إعلانات وعروض للعملاء المربوطين',
        url: 'services/ph-news.html',
        fields: [],
        compute: function() {
            return { message: '📢 نشر أخبار وعروض - تواصل مع عملائك' };
        }
    },
    {
        id: 'ph-prescriptions',
        name: 'الروشتات الرقمية',
        icon: 'fa-prescription',
        category: 'ربط',
        description: 'استقبال الروشتات مباشرة من العيادات',
        url: 'services/ph-prescriptions.html',
        fields: [],
        compute: function() {
            return { message: '📝 الروشتات الرقمية - روشتات من العيادات' };
        }
    },
    {
        id: 'ph-cashback',
        name: 'كاش باك الولاء',
        icon: 'fa-wallet',
        category: 'ربط',
        description: 'تحويل نقاط المريض إلى خصومات عند الشراء',
        url: 'services/ph-cashback.html',
        fields: [],
        compute: function() {
            return { message: '💰 كاش باك الولاء - مكافآت عملائك' };
        }
    },
    {
        id: 'ph-track-meds',
        name: 'تتبع الأدوية المغشوشة',
        icon: 'fa-search',
        category: 'ربط',
        description: 'التحقق من مصدر الدواء وصلاحيته',
        url: 'services/ph-track-meds.html',
        fields: [],
        compute: function() {
            return { message: '🔍 تتبع الأدوية - تحقق من مصدر الدواء' };
        }
    }
];

// حفظ السجل في localStorage للاستخدام
localStorage.setItem('pharmacyServices', JSON.stringify(PHARMACY_SERVICES));

console.log('✅ PHARMACY_SERVICES loaded! (' + PHARMACY_SERVICES.length + ' services)');