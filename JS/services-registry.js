// ============================================================
// ===== سجل الخدمات الذاتية للمريض (22 خدمة) =====
// ============================================================

const SERVICES_REGISTRY = [
    // ===== الصحة العامة والحيوية (5 خدمات) =====
    {
        id: 'biometric',
        name: 'الملف البيومتري',
        icon: 'fa-user-md',
        category: 'الصحة العامة',
        description: 'تخزين الوزن، الطول، الضغط، والسكر مع حساب BMI',
        fields: [
            { key: 'weight', label: 'الوزن (كجم)', type: 'number', placeholder: '72.5' },
            { key: 'height', label: 'الطول (سم)', type: 'number', placeholder: '175' },
            { key: 'bloodPressure', label: 'ضغط الدم', type: 'text', placeholder: '120/80' },
            { key: 'bloodSugar', label: 'السكر (مجم/دل)', type: 'number', placeholder: '95' }
        ],
        compute: function(data) {
            var weight = parseFloat(data.weight) || 0;
            var height = parseFloat(data.height) || 0;
            var bmi = height > 0 ? Math.round((weight / ((height/100)*(height/100))) * 10) / 10 : 0;
            var status = 'وزن طبيعي';
            if (bmi < 18.5) status = 'نقص وزن';
            else if (bmi < 25) status = 'وزن طبيعي';
            else if (bmi < 30) status = 'زيادة وزن';
            else status = 'سمنة';
            return { bmi: bmi, status: status, weight: weight, height: height };
        }
    },
    {
        id: 'ai-report',
        name: 'التقرير الصحي الذكي',
        icon: 'fa-robot',
        category: 'الصحة العامة',
        description: 'تحليل الأرقام الحيوية وتقرير يومي بالعامية',
        fields: [
            { key: 'weight', label: 'الوزن (كجم)', type: 'number', placeholder: '72.5' },
            { key: 'height', label: 'الطول (سم)', type: 'number', placeholder: '175' },
            { key: 'systolic', label: 'الضغط الانقباضي', type: 'number', placeholder: '120' },
            { key: 'diastolic', label: 'الضغط الانبساطي', type: 'number', placeholder: '80' },
            { key: 'sugar', label: 'السكر (مجم/دل)', type: 'number', placeholder: '95' }
        ],
        compute: function(data) {
            var w = parseFloat(data.weight) || 0;
            var h = parseFloat(data.height) || 0;
            var bmi = h > 0 ? Math.round((w / ((h/100)*(h/100))) * 10) / 10 : 0;
            var sys = parseInt(data.systolic) || 0;
            var dia = parseInt(data.diastolic) || 0;
            var sugar = parseInt(data.sugar) || 0;
            var report = '🟢 حالتك الصحية اليوم جيدة. ';
            if (bmi > 25) report += 'وزنك أعلى من الطبيعي، حاول تقليل السكريات. ';
            else if (bmi < 18.5) report += 'وزنك أقل من الطبيعي، اهتم بتناول البروتين. ';
            if (sys > 130) report += 'ضغطك مرتفع، استشر طبيبك. ';
            if (sugar > 126) report += 'السكر مرتفع، يفضل مراجعة الطبيب. ';
            return { report: report, bmi: bmi, score: (bmi > 18.5 && bmi < 25) ? 85 : 65 };
        }
    },
    {
        id: 'symptom-logger',
        name: 'متابع الأعراض',
        icon: 'fa-head-side-virus',
        category: 'الصحة العامة',
        description: 'تسجيل الأعراض اليومية وتحليلها',
        fields: [
            { key: 'symptoms', label: 'الأعراض (مفصولة بفاصلة)', type: 'text', placeholder: 'صداع، كحة، حرارة' },
            { key: 'severity', label: 'شدة الأعراض', type: 'select', options: ['خفيفة', 'متوسطة', 'شديدة'] },
            { key: 'duration', label: 'المدة (ساعات)', type: 'number', placeholder: '4' }
        ],
        compute: function(data) {
            var symptoms = data.symptoms || 'لا يوجد';
            var severity = data.severity || 'خفيفة';
            return { symptoms: symptoms, severity: severity, advice: severity === 'شديدة' ? '⚠️ يفضل استشارة طبيب' : 'تابع الأعراض غداً' };
        }
    },
    {
        id: 'health-vault',
        name: 'الخزنة الطبية',
        icon: 'fa-cloud-upload-alt',
        category: 'الصحة العامة',
        description: 'رفع وتخزين الملفات الطبية (روشتات، تحاليل)',
        fields: [
            { key: 'fileDesc', label: 'وصف الملف', type: 'text', placeholder: 'تقرير تحليل 6/2026' },
            { key: 'fileType', label: 'نوع الملف', type: 'select', options: ['روشتة', 'تحليل', 'أشعة', 'تقرير'] }
        ],
        compute: function(data) {
            return { message: '✅ تم حفظ "' + (data.fileDesc || 'ملف') + '" في الخزنة', count: 1 };
        }
    },
    {
        id: 'ice-card',
        name: 'كارت الطوارئ (ICE)',
        icon: 'fa-phone-alt',
        category: 'الصحة العامة',
        description: 'توليد بطاقة طوارئ رقميـة',
        fields: [
            { key: 'emergencyContact', label: 'رقم الطوارئ', type: 'text', placeholder: '01001234567' },
            { key: 'bloodType', label: 'فصيلة الدم', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
            { key: 'allergies', label: 'الحساسية', type: 'text', placeholder: 'بنسلين، مكسرات' }
        ],
        compute: function(data) {
            return { contact: data.emergencyContact, blood: data.bloodType, allergies: data.allergies || 'لا يوجد' };
        }
    },

    // ===== التغذية واللياقة (5 خدمات) =====
    {
        id: 'calorie-counter',
        name: 'حاسبة السعرات',
        icon: 'fa-utensils',
        category: 'التغذية',
        description: 'حساب السعرات اليومية حسب الوزن والهدف',
        fields: [
            { key: 'weight', label: 'الوزن (كجم)', type: 'number', placeholder: '72.5' },
            { key: 'height', label: 'الطول (سم)', type: 'number', placeholder: '175' },
            { key: 'age', label: 'العمر', type: 'number', placeholder: '30' },
            { key: 'gender', label: 'الجنس', type: 'select', options: ['ذكر', 'أنثى'] },
            { key: 'goal', label: 'الهدف', type: 'select', options: ['تثبيت الوزن', 'تخسيس', 'زيادة وزن'] }
        ],
        compute: function(data) {
            var w = parseFloat(data.weight) || 70;
            var h = parseFloat(data.height) || 175;
            var age = parseInt(data.age) || 30;
            var isMale = data.gender === 'ذكر';
            var bmr = isMale ? 66 + (13.7 * w) + (5 * h) - (6.8 * age) : 655 + (9.6 * w) + (1.8 * h) - (4.7 * age);
            var calories = Math.round(bmr * 1.2);
            if (data.goal === 'تخسيس') calories -= 300;
            else if (data.goal === 'زيادة وزن') calories += 300;
            return { bmr: Math.round(bmr), calories: calories, goal: data.goal };
        }
    },
    {
        id: 'water-tracker',
        name: 'رادار المياه',
        icon: 'fa-tint',
        category: 'التغذية',
        description: 'تذكير بشرب المياه حسب الوزن والنشاط',
        fields: [
            { key: 'weight', label: 'الوزن (كجم)', type: 'number', placeholder: '72.5' },
            { key: 'activity', label: 'مستوى النشاط', type: 'select', options: ['خامل', 'خفيف', 'متوسط', 'مرتفع'] },
            { key: 'drunk', label: 'كم شربت اليوم (لتر)', type: 'number', step: '0.1', placeholder: '1.5' }
        ],
        compute: function(data) {
            var w = parseFloat(data.weight) || 70;
            var need = w * 0.033;
            if (data.activity === 'متوسط') need += 0.3;
            else if (data.activity === 'مرتفع') need += 0.6;
            need = Math.round(need * 10) / 10;
            var drunk = parseFloat(data.drunk) || 0;
            var remaining = Math.max(0, need - drunk);
            return { need: need, drunk: drunk, remaining: remaining, progress: Math.min(100, Math.round((drunk / need) * 100)) };
        }
    },
    {
        id: 'meal-planner',
        name: 'مقترح الوجبات',
        icon: 'fa-apple-alt',
        category: 'التغذية',
        description: 'اقتراح وجبات صحية حسب النظام الغذائي',
        fields: [
            { key: 'diet', label: 'النظام الغذائي', type: 'select', options: ['منخفض الكربوهيدرات', 'عالي البروتين', 'نباتي', 'متوازن'] },
            { key: 'calories', label: 'السعرات المستهدفة', type: 'number', placeholder: '2000' }
        ],
        compute: function(data) {
            var diet = data.diet || 'متوازن';
            var cals = parseInt(data.calories) || 2000;
            var suggestions = {
                'منخفض الكربوهيدرات': 'بيض، أفوكادو، سمك، خضار ورقية',
                'عالي البروتين': 'دجاج، تونة، عدس، زبادي يوناني',
                'نباتي': 'حمص، فول، مكسرات، كينوا',
                'متوازن': 'أرز بني، دجاج، خضار مشكلة، فواكه'
            };
            return { suggestion: suggestions[diet] || suggestions['متوازن'], calories: cals };
        }
    },
    {
        id: 'sugar-detox',
        name: 'تحدي السكريات',
        icon: 'fa-cookie-bite',
        category: 'التغذية',
        description: 'متابعة استهلاك السكر اليومي',
        fields: [
            { key: 'sugarIntake', label: 'السكر المستهلك (جرام)', type: 'number', placeholder: '25' },
            { key: 'limit', label: 'الحد اليومي (جرام)', type: 'number', placeholder: '25' }
        ],
        compute: function(data) {
            var intake = parseInt(data.sugarIntake) || 0;
            var limit = parseInt(data.limit) || 25;
            var remaining = Math.max(0, limit - intake);
            var status = intake <= limit ? '✅ ممتاز' : '⚠️ تجاوزت الحد اليومي';
            return { intake: intake, limit: limit, remaining: remaining, status: status };
        }
    },
    {
        id: 'fasting-timer',
        name: 'الصيام المتقطع',
        icon: 'fa-clock',
        category: 'التغذية',
        description: 'توقيت الصيام المتقطع (16/8)',
        fields: [
            { key: 'startTime', label: 'وقت بدء الصيام', type: 'time' },
            { key: 'duration', label: 'مدة الصيام (ساعات)', type: 'number', placeholder: '16' }
        ],
        compute: function(data) {
            var duration = parseInt(data.duration) || 16;
            return { start: data.startTime || '22:00', duration: duration, end: '14:00', status: '⏳ جاري الصيام' };
        }
    },

    // ===== الأدوية والتداخلات (5 خدمات) =====
    {
        id: 'dosage-calculator',
        name: 'حاسبة الجرعات',
        icon: 'fa-calculator',
        category: 'الأدوية',
        description: 'حساب الجرعة المناسبة حسب الوزن والعمر',
        fields: [
            { key: 'weight', label: 'الوزن (كجم)', type: 'number', placeholder: '72.5' },
            { key: 'age', label: 'العمر (سنوات)', type: 'number', placeholder: '30' },
            { key: 'medType', label: 'نوع الدواء', type: 'select', options: ['مضاد حيوي', 'مسكن', 'خافض حرارة', 'ضغط'] }
        ],
        compute: function(data) {
            var w = parseFloat(data.weight) || 70;
            var age = parseInt(data.age) || 30;
            var dose = w * 2;
            if (data.medType === 'مضاد حيوي') dose = w * 5;
            else if (data.medType === 'مسكن') dose = w * 1.5;
            if (age < 12) dose = dose * 0.5;
            return { dose: Math.round(dose), unit: 'مجم', weight: w };
        }
    },
    {
        id: 'interaction-scanner',
        name: 'كاشف التداخلات',
        icon: 'fa-exclamation-triangle',
        category: 'الأدوية',
        description: 'فحص تداخلات دواءين معاً',
        fields: [
            { key: 'drug1', label: 'الدواء الأول', type: 'text', placeholder: 'باراسيتامول' },
            { key: 'drug2', label: 'الدواء الثاني', type: 'text', placeholder: 'وارفارين' }
        ],
        compute: function(data) {
            var d1 = data.drug1 || '';
            var d2 = data.drug2 || '';
            var conflicts = { 'وارفارين': ['باراسيتامول', 'أسبرين'], 'باراسيتامول': ['وارفارين'] };
            var hasConflict = conflicts[d1] ? conflicts[d1].indexOf(d2) !== -1 : (conflicts[d2] ? conflicts[d2].indexOf(d1) !== -1 : false);
            return { drug1: d1, drug2: d2, conflict: hasConflict ? '⚠️ يوجد تداخل خطير' : '✅ لا يوجد تداخل' };
        }
    },
    {
        id: 'alternatives-finder',
        name: 'مكتشف البدائل',
        icon: 'fa-exchange-alt',
        category: 'الأدوية',
        description: 'البحث عن بدائل لنفس المادة الفعالة',
        fields: [
            { key: 'drugName', label: 'اسم الدواء', type: 'text', placeholder: 'باراسيتامول' }
        ],
        compute: function(data) {
            var alternatives = { 'باراسيتامول': ['أسيتامينوفين', 'بنادول'], 'أموكسيسيلين': ['أوجمنتين', 'كلافوكس'] };
            var name = data.drugName || '';
            var result = alternatives[name] || ['لا توجد بدائل مسجلة'];
            return { drug: name, alternatives: result };
        }
    },
    {
        id: 'medication-guide',
        name: 'دليل الأدوية',
        icon: 'fa-book-medical',
        category: 'الأدوية',
        description: 'معلومات عن الأدوية والجرعات',
        fields: [
            { key: 'medName', label: 'اسم الدواء', type: 'text', placeholder: 'باراسيتامول' }
        ],
        compute: function(data) {
            var guides = {
                'باراسيتامول': { usage: 'مسكن وخافض حرارة', dose: '500-1000 مجم كل 4-6 ساعات', side: 'نادراً' },
                'أموكسيسيلين': { usage: 'مضاد حيوي واسع المجال', dose: '250-500 مجم كل 8 ساعات', side: 'غثيان، إسهال' }
            };
            var name = data.medName || '';
            var info = guides[name] || { usage: 'غير موجود', dose: 'استشر طبيبك', side: 'غير معروف' };
            return { med: name, usage: info.usage, dose: info.dose, side: info.side };
        }
    },
    {
        id: 'medication-reminder',
        name: 'منظم الأدوية',
        icon: 'fa-pills',
        category: 'الأدوية',
        description: 'إضافة تذكيرات للأدوية والجرعات',
        fields: [
            { key: 'medName', label: 'اسم الدواء', type: 'text', placeholder: 'ميتفورمين' },
            { key: 'dose', label: 'الجرعة', type: 'text', placeholder: '500 مجم' },
            { key: 'time', label: 'الموعد', type: 'time' }
        ],
        compute: function(data) {
            var reminders = JSON.parse(localStorage.getItem('medReminders') || '[]');
            var newReminder = { name: data.medName, dose: data.dose, time: data.time, date: new Date().toISOString() };
            reminders.push(newReminder);
            localStorage.setItem('medReminders', JSON.stringify(reminders));
            return { message: '✅ تم إضافة تذكير لـ ' + data.medName, count: reminders.length };
        }
    },

    // ===== الصحة النفسية (3 خدمات) =====
    {
        id: 'mood-tracker',
        name: 'متابع المزاج',
        icon: 'fa-smile',
        category: 'الصحة النفسية',
        description: 'تسجيل المزاج ومستوى التوتر يومياً',
        fields: [
            { key: 'mood', label: 'المزاج', type: 'select', options: ['سعيد', 'محايد', 'حزين', 'متوتر'] },
            { key: 'stress', label: 'مستوى التوتر', type: 'select', options: ['منخفض', 'متوسط', 'مرتفع'] },
            { key: 'sleepHours', label: 'ساعات النوم', type: 'number', placeholder: '7' }
        ],
        compute: function(data) {
            var moods = { 'سعيد': 100, 'محايد': 70, 'حزين': 40, 'متوتر': 30 };
            var score = moods[data.mood] || 50;
            var stressMsg = data.stress === 'مرتفع' ? '⚠️ توتر مرتفع' : '✅ جيد';
            return { mood: data.mood, score: score, stress: stressMsg, sleep: data.sleepHours };
        }
    },
    {
        id: 'breathing-exercises',
        name: 'تمارين التنفس',
        icon: 'fa-wind',
        category: 'الصحة النفسية',
        description: 'تمارين تنفس موجهة للاسترخاء',
        fields: [
            { key: 'duration', label: 'مدة التمرين (دقائق)', type: 'number', placeholder: '5' },
            { key: 'type', label: 'نوع التمرين', type: 'select', options: ['تنفس عميق', 'تنفس مربع', 'استرخاء'] }
        ],
        compute: function(data) {
            return { duration: data.duration || 5, type: data.type || 'تنفس عميق', status: '🧘 جلسة جاهزة' };
        }
    },
    {
        id: 'smart-sleep',
        name: 'منبه النوم الذكي',
        icon: 'fa-moon',
        category: 'الصحة النفسية',
        description: 'توصية بموعد النوم المثالي',
        fields: [
            { key: 'wakeTime', label: 'وقت الاستيقاظ', type: 'time' },
            { key: 'cycles', label: 'عدد دورات النوم', type: 'number', placeholder: '5' }
        ],
        compute: function(data) {
            var cycles = parseInt(data.cycles) || 5;
            var wake = data.wakeTime || '07:00';
            var bedTime = '23:00';
            return { wake: wake, bedTime: bedTime, cycles: cycles, advice: 'نم 7-8 ساعات للحصول على راحة مثالية' };
        }
    },

    // ===== صحة المرأة والطفل (2 خدمة) =====
    {
        id: 'period-tracker',
        name: 'الدورة الشهرية',
        icon: 'fa-female',
        category: 'صحة المرأة',
        description: 'تتبع الدورة الشهرية وأيام التبويض',
        fields: [
            { key: 'lastPeriod', label: 'آخر دورة (التاريخ)', type: 'date' },
            { key: 'cycleLength', label: 'طول الدورة (أيام)', type: 'number', placeholder: '28' },
            { key: 'duration', label: 'مدة الدورة (أيام)', type: 'number', placeholder: '5' }
        ],
        compute: function(data) {
            var last = data.lastPeriod || new Date().toISOString().split('T')[0];
            var cycle = parseInt(data.cycleLength) || 28;
            return { last: last, cycle: cycle, next: 'قريباً', ovulation: 'يوم 14' };
        }
    },
    {
        id: 'baby-care',
        name: 'رعاية الطفل',
        icon: 'fa-baby',
        category: 'صحة المرأة',
        description: 'متابعة تطعيمات ومنحنيات نمو الطفل',
        fields: [
            { key: 'childName', label: 'اسم الطفل', type: 'text', placeholder: 'يوسف' },
            { key: 'birthDate', label: 'تاريخ الميلاد', type: 'date' },
            { key: 'weight', label: 'الوزن (كجم)', type: 'number', placeholder: '12.5' }
        ],
        compute: function(data) {
            var vaccines = ['BCG', 'شلل الأطفال', 'السداسي'];
            return { name: data.childName, vaccines: vaccines, next: 'التطعيم القادم: السداسي' };
        }
    },

    // ===== أدوات وتخطيط (2 خدمة) =====
    {
        id: 'cost-calculator',
        name: 'حاسبة التكلفة الشهرية',
        icon: 'fa-coins',
        category: 'أدوات',
        description: 'تقدير التكلفة الشهرية للأدوية والخدمات',
        fields: [
            { key: 'medCost', label: 'تكلفة الأدوية', type: 'number', placeholder: '500' },
            { key: 'visitCost', label: 'تكلفة الكشوفات', type: 'number', placeholder: '300' },
            { key: 'labCost', label: 'تكلفة التحاليل', type: 'number', placeholder: '200' }
        ],
        compute: function(data) {
            var med = parseInt(data.medCost) || 0;
            var visit = parseInt(data.visitCost) || 0;
            var lab = parseInt(data.labCost) || 0;
            var total = med + visit + lab;
            return { total: total, breakdown: { med: med, visit: visit, lab: lab } };
        }
    },
    {
        id: 'step-counter',
        name: 'عداد الخطوات',
        icon: 'fa-shoe-prints',
        category: 'أدوات',
        description: 'تتبع الخطوات والمسافة اليومية',
        fields: [
            { key: 'steps', label: 'عدد الخطوات اليومية', type: 'number', placeholder: '5000' },
            { key: 'goal', label: 'الهدف اليومي', type: 'number', placeholder: '10000' }
        ],
        compute: function(data) {
            var steps = parseInt(data.steps) || 0;
            var goal = parseInt(data.goal) || 10000;
            var progress = Math.min(100, Math.round((steps / goal) * 100));
            var distance = Math.round((steps * 0.76) / 100) / 10;
            return { steps: steps, goal: goal, progress: progress, distance: distance };
        }
    },

    // ===== خدمات الربط (10 خدمات) =====
    {
        id: 'network',
        name: 'شبكتي الصحية',
        icon: 'fa-link',
        category: 'خدمات الربط',
        description: 'إدارة الأكواد والجهات المرتبطة',
        fields: [],
        compute: function() { return { message: '🔗 شبكتي الصحية جاهزة' }; }
    },
    {
        id: 'store',
        name: 'الطلب السريع',
        icon: 'fa-store',
        category: 'خدمات الربط',
        description: 'شراء الأدوية من صيدليتك',
        fields: [],
        compute: function() { return { message: '🛒 المتجر جاهز للطلب' }; }
    },
    {
        id: 'wallet',
        name: 'المحفظة الذكية',
        icon: 'fa-wallet',
        category: 'خدمات الربط',
        description: 'نقاط الولاء والكاش باك',
        fields: [],
        compute: function() { return { message: '💳 المحفظة جاهزة' }; }
    },
    {
        id: 'appointment',
        name: 'حجز موعد',
        icon: 'fa-calendar-check',
        category: 'خدمات الربط',
        description: 'حجز موعد مع عيادتك',
        fields: [],
        compute: function() { return { message: '📅 حجز المواعيد جاهز' }; }
    },
    {
        id: 'lab-order',
        name: 'طلب تحليل',
        icon: 'fa-flask',
        category: 'خدمات الربط',
        description: 'طلب تحاليل من المعمل',
        fields: [],
        compute: function() { return { message: '🔬 طلب التحليل جاهز' }; }
    },
    {
        id: 'radiology-order',
        name: 'طلب أشعة',
        icon: 'fa-x-ray',
        category: 'خدمات الربط',
        description: 'طلب أشعة من المركز',
        fields: [],
        compute: function() { return { message: '📷 طلب الأشعة جاهز' }; }
    },
    {
        id: 'share-ehr',
        name: 'مشاركة الملف الطبي',
        icon: 'fa-share-alt',
        category: 'خدمات الربط',
        description: 'مشاركة ملفك مع الطبيب',
        fields: [],
        compute: function() { return { message: '🔐 مشاركة الملف جاهزة' }; }
    },
    {
        id: 'smart-reminder',
        name: 'منبه العلاج الذكي',
        icon: 'fa-bell',
        category: 'خدمات الربط',
        description: 'تذكيرات ذكية للأدوية',
        fields: [],
        compute: function() { return { message: '⏰ المنبه الذكي جاهز' }; }
    },
    {
        id: 'treatment-monitor',
        name: 'متابعة كفاءة العلاج',
        icon: 'fa-chart-line',
        category: 'خدمات الربط',
        description: 'متابعة التزامك بالعلاج',
        fields: [],
        compute: function() { return { message: '📊 متابعة العلاج جاهزة' }; }
    },
    {
        id: 'ocr-scanner',
        name: 'فحص الروشتات (OCR)',
        icon: 'fa-camera',
        category: 'خدمات الربط',
        description: 'تصوير الروشتة والبحث عن الأدوية في الصيدليات المرتبطة',
        fields: [],
        compute: function() { return { message: '📷 فحص الروشتات جاهز' }; }
    }
];

// حفظ السجل في localStorage للاستخدام في المشغل
localStorage.setItem('servicesRegistry', JSON.stringify(SERVICES_REGISTRY));

console.log('✅ SERVICES_REGISTRY loaded successfully! (' + SERVICES_REGISTRY.length + ' services)');