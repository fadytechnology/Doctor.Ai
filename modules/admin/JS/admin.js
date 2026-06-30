// ============================================================
// ===== دوال مشتركة للإدارة المركزية =====
// ============================================================

// ----- عرض رسالة Toast -----
function showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ----- فتح وإغلاق المودال -----
function openModal(id) {
    document.getElementById(id).classList.add('show');
}

function closeModal(id) {
    document.getElementById(id).classList.remove('show');
}

// ----- توليد معرف فريد -----
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// ----- الحصول على مستخدمين وهميين (محاكاة) -----
function getMockUsers() {
    let users = JSON.parse(localStorage.getItem('adminUsers'));
    if (!users || users.length === 0) {
        users = [
            { id: generateId(), fullName: 'أحمد محمد', email: 'ahmed@pharm.com', phone: '01001234567', role: 'pharmacy', status: 'active', pharmacyCode: 'PH-2024-001', createdAt: '2026-06-01' },
            { id: generateId(), fullName: 'سارة حسن', email: 'sara@clinic.com', phone: '01008765432', role: 'clinic', status: 'active', pharmacyCode: 'CL-2024-001', createdAt: '2026-06-05' },
            { id: generateId(), fullName: 'خالد محمود', email: 'khaled@lab.com', phone: '01005556677', role: 'lab', status: 'pending', pharmacyCode: null, createdAt: '2026-06-10' },
            { id: generateId(), fullName: 'نورا إبراهيم', email: 'nora@patient.com', phone: '01009998888', role: 'patient', status: 'active', pharmacyCode: null, createdAt: '2026-06-12' },
            { id: generateId(), fullName: 'عمرو سعيد', email: 'amr@radiology.com', phone: '01007778888', role: 'radiology', status: 'pending', pharmacyCode: null, createdAt: '2026-06-15' }
        ];
        localStorage.setItem('adminUsers', JSON.stringify(users));
    }
    return users;
}

// ----- الحصول على صيدليات وهمية -----
function getMockPharmacies() {
    let pharmacies = JSON.parse(localStorage.getItem('adminPharmacies'));
    if (!pharmacies || pharmacies.length === 0) {
        pharmacies = [
            { id: generateId(), name: 'صيدلية النور', owner: 'أحمد محمد', phone: '01001234567', email: 'ahmed@pharm.com', code: 'PH-2024-001', status: 'approved', createdAt: '2026-06-01' },
            { id: generateId(), name: 'صيدلية الرحمة', owner: 'سامي فتحي', phone: '01008889999', email: 'sami@pharm.com', code: 'PH-2024-002', status: 'pending', createdAt: '2026-06-20' }
        ];
        localStorage.setItem('adminPharmacies', JSON.stringify(pharmacies));
    }
    return pharmacies;
}

// ----- الحصول على عيادات وهمية -----
function getMockClinics() {
    let clinics = JSON.parse(localStorage.getItem('adminClinics'));
    if (!clinics || clinics.length === 0) {
        clinics = [
            { id: generateId(), name: 'عيادة السلام', owner: 'د. سارة حسن', phone: '01008765432', email: 'sara@clinic.com', specialty: 'طب عام', code: 'CL-2024-001', status: 'approved', createdAt: '2026-06-05' },
            { id: generateId(), name: 'عيادة النخبة', owner: 'د. طارق علي', phone: '01006667777', email: 'tarek@clinic.com', specialty: 'جلدية', code: 'CL-2024-002', status: 'pending', createdAt: '2026-06-22' }
        ];
        localStorage.setItem('adminClinics', JSON.stringify(clinics));
    }
    return clinics;
}

// ----- الحصول على شكاوى وهمية -----
function getMockComplaints() {
    let complaints = JSON.parse(localStorage.getItem('adminComplaints'));
    if (!complaints || complaints.length === 0) {
        complaints = [
            { id: generateId(), patient: 'محمد علي', provider: 'صيدلية النور', subject: 'تأخير في الطلب', description: 'طلبت دواء من 3 أيام ولم يصل', status: 'pending', createdAt: '2026-06-28' },
            { id: generateId(), patient: 'سارة حسن', provider: 'عيادة السلام', subject: 'موعد غير مؤكد', description: 'حجزت موعد ولم يتم التأكيد', status: 'in-progress', createdAt: '2026-06-27' }
        ];
        localStorage.setItem('adminComplaints', JSON.stringify(complaints));
    }
    return complaints;
}

// ----- تحديث الإحصائيات في لوحة القيادة -----
function updateDashboardStats() {
    const users = getMockUsers();
    const pharmacies = getMockPharmacies();
    const clinics = getMockClinics();
    const complaints = getMockComplaints();

    document.getElementById('statUsers').textContent = users.length;
    document.getElementById('statPharmacies').textContent = pharmacies.length;
    document.getElementById('statClinics').textContent = clinics.length;
    document.getElementById('statComplaints').textContent = complaints.length;
    document.getElementById('statPendingPharmacies').textContent = pharmacies.filter(p => p.status === 'pending').length;
    document.getElementById('statPendingClinics').textContent = clinics.filter(c => c.status === 'pending').length;
    document.getElementById('statPendingComplaints').textContent = complaints.filter(c => c.status === 'pending').length;
}

// ----- توجيه الصفحات -----
function redirectToAdminPage(page) {
    window.location.href = page + '.html';
}
// ============================================================
// ===== دوال البيانات الوهمية للفئات الجديدة =====
// ============================================================

// ----- المعامل -----
function getMockLabs() {
    let labs = JSON.parse(localStorage.getItem('adminLabs'));
    if (!labs || labs.length === 0) {
        labs = [
            { id: generateId(), name: 'معمل المختبر', owner: 'د. عمرو', phone: '01001112222', email: 'amr@lab.com', status: 'approved', createdAt: '2026-06-10' },
            { id: generateId(), name: 'معمل الأمل', owner: 'د. نادية', phone: '01003334444', email: 'nadia@lab.com', status: 'pending', createdAt: '2026-06-25' }
        ];
        localStorage.setItem('adminLabs', JSON.stringify(labs));
    }
    return labs;
}

// ----- مراكز الأشعة -----
function getMockRadiology() {
    let rads = JSON.parse(localStorage.getItem('adminRadiology'));
    if (!rads || rads.length === 0) {
        rads = [
            { id: generateId(), name: 'مركز الأشعة الحديث', owner: 'د. خالد', phone: '01005556666', email: 'khaled@rad.com', status: 'approved', createdAt: '2026-06-12' },
            { id: generateId(), name: 'مركز الرنين المغناطيسي', owner: 'د. سامي', phone: '01007778888', email: 'sami@rad.com', status: 'pending', createdAt: '2026-06-28' }
        ];
        localStorage.setItem('adminRadiology', JSON.stringify(rads));
    }
    return rads;
}

// ----- الموردين -----
function getMockSuppliers() {
    let suppliers = JSON.parse(localStorage.getItem('adminSuppliers'));
    if (!suppliers || suppliers.length === 0) {
        suppliers = [
            { id: generateId(), name: 'مورد الأدوية الأول', owner: 'شركة الدواء', phone: '01009998888', email: 'info@drug.com', status: 'approved', createdAt: '2026-06-05' },
            { id: generateId(), name: 'مورد فيتامينات', owner: 'شركة فيتا', phone: '01007776666', email: 'info@vita.com', status: 'pending', createdAt: '2026-06-29' }
        ];
        localStorage.setItem('adminSuppliers', JSON.stringify(suppliers));
    }
    return suppliers;
}

// ----- الإعلانات -----
function getMockAds() {
    let ads = JSON.parse(localStorage.getItem('adminAds'));
    if (!ads || ads.length === 0) {
        ads = [
            { id: generateId(), title: 'خصم 20% على باراسيتامول', image: 'https://via.placeholder.com/300x100', points: 5, status: 'active', target: 'all', createdAt: '2026-06-20' },
            { id: generateId(), title: 'عرض خاص لمرضى السكر', image: 'https://via.placeholder.com/300x100', points: 10, status: 'pending', target: 'diabetic', createdAt: '2026-06-28' }
        ];
        localStorage.setItem('adminAds', JSON.stringify(ads));
    }
    return ads;
}

// ----- المحتوى والأخبار -----
function getMockContent() {
    let content = JSON.parse(localStorage.getItem('adminContent'));
    if (!content || content.length === 0) {
        content = [
            { id: generateId(), title: 'تحديث جديد في التطبيق', body: 'أضفنا ميزة حاسبة الجرعات للأطفال', status: 'published', createdAt: '2026-06-25' },
            { id: generateId(), title: 'نصائح للوقاية من الأنفلونزا', body: 'اغسل يديك واحصل على اللقاح', status: 'pending', createdAt: '2026-06-29' }
        ];
        localStorage.setItem('adminContent', JSON.stringify(content));
    }
    return content;
}

// ----- الأدوية المركزية -----
function getMockDrugs() {
    let drugs = JSON.parse(localStorage.getItem('adminDrugs'));
    if (!drugs || drugs.length === 0) {
        drugs = [
            { id: generateId(), name: 'باراسيتامول', active: 'باراسيتامول', category: 'مسكن', unit: 'شريط' },
            { id: generateId(), name: 'أموكسيسيلين', active: 'أموكسيسيلين', category: 'مضاد حيوي', unit: 'شريط' },
            { id: generateId(), name: 'ميتفورمين', active: 'ميتفورمين', category: 'سكري', unit: 'شريط' }
        ];
        localStorage.setItem('adminDrugs', JSON.stringify(drugs));
    }
    return drugs;
}

// ----- الباقات -----
function getMockSubscriptions() {
    let subs = JSON.parse(localStorage.getItem('adminSubscriptions'));
    if (!subs || subs.length === 0) {
        subs = [
            { id: generateId(), name: 'باقة أساسية', price: 0, features: ['ظهور في البحث', 'تحديث بيانات'], status: 'active' },
            { id: generateId(), name: 'باقة احترافية', price: 500, features: ['ظهور مميز', 'تحليلات متقدمة', 'إعلانات مجانية'], status: 'active' },
            { id: generateId(), name: 'باقة VIP', price: 1200, features: ['أولوية في البحث', 'دعم فني 24/7', 'خصم على العمولات'], status: 'active' }
        ];
        localStorage.setItem('adminSubscriptions', JSON.stringify(subs));
    }
    return subs;
}

// ----- العمولات -----
function getMockCommission() {
    let comm = JSON.parse(localStorage.getItem('adminCommission'));
    if (!comm || comm.length === 0) {
        comm = {
            percentage: 5,
            totalEarned: 12500,
            pending: 3200,
            paid: 9300,
            transactions: [
                { id: generateId(), from: 'صيدلية النور', to: 'منصة Doctor.ai', amount: 250, status: 'paid', date: '2026-06-28' },
                { id: generateId(), from: 'صيدلية الرحمة', to: 'منصة Doctor.ai', amount: 120, status: 'pending', date: '2026-06-29' }
            ]
        };
        localStorage.setItem('adminCommission', JSON.stringify(comm));
    }
    return comm;
}

// ----- الولاء العام -----
function getMockLoyalty() {
    let loyalty = JSON.parse(localStorage.getItem('adminLoyalty'));
    if (!loyalty) {
        loyalty = { pointsPer10EGP: 1, discountPer100Points: 10, totalPointsIssued: 4520, totalPointsRedeemed: 1200 };
        localStorage.setItem('adminLoyalty', JSON.stringify(loyalty));
    }
    return loyalty;
}

// ----- الإشعارات الجماعية -----
function getMockNotifications() {
    let notifs = JSON.parse(localStorage.getItem('adminNotifications'));
    if (!notifs || notifs.length === 0) {
        notifs = [
            { id: generateId(), title: 'تحديث جديد', body: 'تم إضافة ميزة التقرير الذكي', target: 'all', sentAt: '2026-06-27', status: 'sent' },
            { id: generateId(), title: 'عرض خاص للصيدليات', body: 'خصم 50% على الاشتراك السنوي', target: 'pharmacy', sentAt: null, status: 'draft' }
        ];
        localStorage.setItem('adminNotifications', JSON.stringify(notifs));
    }
    return notifs;
}

// ----- السجل (Logs) -----
function getMockLogs() {
    let logs = JSON.parse(localStorage.getItem('adminLogs'));
    if (!logs || logs.length === 0) {
        logs = [
            { id: generateId(), user: 'المدير', action: 'وافق على صيدلية النور', time: '2026-06-29 10:30' },
            { id: generateId(), user: 'المدير', action: 'رفض عيادة النخبة', time: '2026-06-29 09:15' },
            { id: generateId(), user: 'المدير', action: 'تعديل إعدادات المنصة', time: '2026-06-28 16:00' }
        ];
        localStorage.setItem('adminLogs', JSON.stringify(logs));
    }
    return logs;
}

// ----- الإعدادات -----
function getMockSettings() {
    let settings = JSON.parse(localStorage.getItem('adminSettings'));
    if (!settings) {
        settings = {
            appName: 'Doctor.ai',
            logo: 'assets/images/logo.png',
            defaultLanguage: 'ar',
            commissionRate: 5,
            loyaltyPointsPerEGP: 1,
            maintenanceMode: false
        };
        localStorage.setItem('adminSettings', JSON.stringify(settings));
    }
    return settings;
}

// ----- قوالب الردود -----
function getMockTemplates() {
    let templates = JSON.parse(localStorage.getItem('adminTemplates'));
    if (!templates || templates.length === 0) {
        templates = [
            { id: generateId(), name: 'موافقة على تسجيل', subject: 'تم الموافقة على تسجيلك', body: 'نشكرك على التسجيل في منصة Doctor.ai. تم الموافقة على حسابك.' },
            { id: generateId(), name: 'رفض تسجيل', subject: 'نأسف لرفض طلبك', body: 'نعتذر، لم يتم الموافقة على طلب التسجيل الخاص بك. يرجى التواصل مع الدعم.' }
        ];
        localStorage.setItem('adminTemplates', JSON.stringify(templates));
    }
    return templates;
}

// ----- التقييمات -----
function getMockReviews() {
    let reviews = JSON.parse(localStorage.getItem('adminReviews'));
    if (!reviews || reviews.length === 0) {
        reviews = [
            { id: generateId(), patient: 'محمد علي', provider: 'صيدلية النور', rating: 5, comment: 'خدمة ممتازة', status: 'approved', createdAt: '2026-06-28' },
            { id: generateId(), patient: 'سارة حسن', provider: 'عيادة السلام', rating: 2, comment: 'تأخير في الموعد', status: 'pending', createdAt: '2026-06-29' }
        ];
        localStorage.setItem('adminReviews', JSON.stringify(reviews));
    }
    return reviews;
}

// ----- تتبع الأدوية -----
function getMockTrackMeds() {
    let meds = JSON.parse(localStorage.getItem('adminTrackMeds'));
    if (!meds || meds.length === 0) {
        meds = [
            { id: generateId(), name: 'باراسيتامول', batch: 'B-123', source: 'مورد معتمد', status: 'authentic', verifiedAt: '2026-06-28' },
            { id: generateId(), name: 'مضاد حيوي', batch: 'B-456', source: 'مورد مشبوه', status: 'suspicious', verifiedAt: null }
        ];
        localStorage.setItem('adminTrackMeds', JSON.stringify(meds));
    }
    return meds;
}
