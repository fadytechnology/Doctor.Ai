// ============================================================
// ===== profile-schema.js - هيكل الملف الصحي المتكامل (100+ سؤال) =====
// ============================================================

const PROFILE_SCHEMA = {
    // ==========================================================
    // الفئة 1: البيانات الديموغرافية والجسدية الأساسية (Demographics)
    // ==========================================================
    demographics: [
        { key: 'birthDate', label: 'تاريخ الميلاد', type: 'date', category: 'demographics', default: '' },
        { key: 'gender', label: 'الجنس البيولوجي', type: 'select', options: ['ذكر', 'أنثى'], category: 'demographics', default: 'ذكر' },
        { key: 'height', label: 'الطول (سم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'weight', label: 'الوزن الحالي (كجم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'targetWeight', label: 'الوزن المستهدف (كجم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'waistCircumference', label: 'محيط الخصر (سم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'hipCircumference', label: 'محيط الأرداف (سم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'neckCircumference', label: 'محيط الرقبة (سم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'chestCircumference', label: 'محيط الصدر (سم)', type: 'number', category: 'demographics', default: 0 },
        { key: 'bloodType', label: 'فصيلة الدم', type: 'select', options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], category: 'demographics', default: 'A+' },
    ],

    // ==========================================================
    // الفئة 2: المؤشرات الحيوية المنزلية والدورية (Vitals)
    // ==========================================================
    vitals: [
        { key: 'bloodPressureSystolic', label: 'ضغط الدم الانقباضي (الرقم العلوي)', type: 'number', category: 'vitals', default: 0 },
        { key: 'bloodPressureDiastolic', label: 'ضغط الدم الانبساطي (الرقم السفلي)', type: 'number', category: 'vitals', default: 0 },
        { key: 'restingHeartRate', label: 'معدل نبضات القلب أثناء الراحة', type: 'number', category: 'vitals', default: 0 },
        { key: 'bodyTemperature', label: 'درجة حرارة الجسم (مئوية)', type: 'number', category: 'vitals', default: 0 },
        { key: 'oxygenSaturation', label: 'نسبة تشبع الأكسجين (SpO2%)', type: 'number', category: 'vitals', default: 0 },
        { key: 'bodyFatPercentage', label: 'نسبة الدهون في الجسم (%)', type: 'number', category: 'vitals', default: 0 },
        { key: 'muscleMass', label: 'نسبة العضلات في الجسم (كجم أو %)', type: 'number', category: 'vitals', default: 0 },
        { key: 'waterPercentage', label: 'نسبة الماء في الجسم (%)', type: 'number', category: 'vitals', default: 0 },
        { key: 'boneMass', label: 'كتلة العظام (كجم)', type: 'number', category: 'vitals', default: 0 },
        { key: 'visceralFat', label: 'مستوى الدهون الحشوية (1-20)', type: 'number', category: 'vitals', default: 0 },
    ],

    // ==========================================================
    // الفئة 3: تحاليل الدم الكاملة والأنيميا (Hematology)
    // ==========================================================
    hematology: [
        { key: 'hemoglobin', label: 'الهيموجلوبين (Hb) - جرام/ديسيلتر', type: 'number', category: 'lab', default: 0 },
        { key: 'mcv', label: 'الحجم الكروي المتوسط (MCV)', type: 'number', category: 'lab', default: 0 },
        { key: 'mchc', label: 'تركيز الهيموجلوبين الكروي المتوسط (MCHC)', type: 'number', category: 'lab', default: 0 },
        { key: 'rbcCount', label: 'إجمالي عدد خلايا الدم الحمراء (RBC)', type: 'number', category: 'lab', default: 0 },
        { key: 'wbcCount', label: 'إجمالي عدد خلايا الدم البيضاء (WBC)', type: 'number', category: 'lab', default: 0 },
        { key: 'lymphocytes', label: 'نسبة الخلايا الليمفاوية (%)', type: 'number', category: 'lab', default: 0 },
        { key: 'neutrophils', label: 'نسبة خلايا النيتروفيل (%)', type: 'number', category: 'lab', default: 0 },
        { key: 'platelets', label: 'إجمالي عدد الصفائح الدموية', type: 'number', category: 'lab', default: 0 },
        { key: 'ferritin', label: 'مخزون الحديد (Ferritin) - نانوجرام/مل', type: 'number', category: 'lab', default: 0 },
        { key: 'serumIron', label: 'الحديد الحر في الدم (Serum Iron)', type: 'number', category: 'lab', default: 0 },
    ],

    // ==========================================================
    // الفئة 4: ملف الدهون وصحة القلب (Lipid Profile)
    // ==========================================================
    lipid: [
        { key: 'totalCholesterol', label: 'الكوليسترول الكلي (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'triglycerides', label: 'الدهون الثلاثية (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'hdl', label: 'الكوليسترول عالي الكثافة (HDL) - النافع', type: 'number', category: 'lab', default: 0 },
        { key: 'ldl', label: 'الكوليسترول منخفض الكثافة (LDL) - الضار', type: 'number', category: 'lab', default: 0 },
        { key: 'vldl', label: 'الكوليسترول شديد انخفاض الكثافة (VLDL)', type: 'number', category: 'lab', default: 0 },
        { key: 'hsCRP', label: 'بروتين سي التفاعلي عالي الحساسية (hs-CRP)', type: 'number', category: 'lab', default: 0 },
        { key: 'chestPain', label: 'هل تشعر بآلام أو ضيق في الصدر عند المجهود؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'shortnessOfBreath', label: 'هل تعاني من ضيق تنفس غير مبرر أثناء النوم أو الراحة؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'palpitations', label: 'هل تشعر بنبضات قلب متسارعة أو غير منتظمة بدون مجهود؟', type: 'boolean', category: 'redFlags', default: false },
    ],

    // ==========================================================
    // الفئة 5: نمط السكر والأيض (Glycemic Control)
    // ==========================================================
    glycemic: [
        { key: 'fastingBloodSugar', label: 'السكر الصائم (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'postprandialBloodSugar', label: 'السكر بعد الأكل بساعتين (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'randomBloodSugar', label: 'السكر العشوائي (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'hba1c', label: 'السكر التراكمي (HbA1c) - %', type: 'number', category: 'lab', default: 0 },
        { key: 'fastingInsulin', label: 'الإنسولين الصائم (ميكرو وحدة/مل)', type: 'number', category: 'lab', default: 0 },
        { key: 'homaIR', label: 'مؤشر مقاومة الإنسولين (HOMA-IR)', type: 'number', category: 'lab', default: 0 },
        { key: 'excessiveThirst', label: 'هل تعاني من عطش شديد ومستمر غير مرتبط بالطقس؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'frequentUrination', label: 'هل تلاحظ كثرة التبول (خاصة في الليل)؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'darkSkinPatches', label: 'هل تلاحظ بقع داكنة في الرقبة أو ثنايا الجلد؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'sugarCravings', label: 'هل تعاني من رغبة ملحة لتناول السكريات بعد الوجبات؟', type: 'boolean', category: 'redFlags', default: false },
    ],

    // ==========================================================
    // الفئة 6: وظائف الكلى والكبد (Renal & Hepatic)
    // ==========================================================
    renalHepatic: [
        { key: 'serumCreatinine', label: 'الكرياتينين في الدم (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'bloodUrea', label: 'اليوريا في الدم (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'egfr', label: 'معدل الترشيح الكبيبي التقديري (eGFR)', type: 'number', category: 'lab', default: 0 },
        { key: 'uricAcid', label: 'حمض البوليك (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'alt', label: 'إنزيم الكبد ALT / SGPT (وحدة/لتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'ast', label: 'إنزيم الكبد AST / SGOT (وحدة/لتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'alkalinePhosphatase', label: 'إنزيم الفوسفاتاز القلوي (وحدة/لتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'totalBilirubin', label: 'البيليروبين الكلي (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'serumAlbumin', label: 'الألبومين في الدم (جرام/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'urineColorChange', label: 'هل يتغير لون البول بشكل ملحوظ (داكن أو مائل للاحمرار)؟', type: 'boolean', category: 'redFlags', default: false },
    ],

    // ==========================================================
    // الفئة 7: الغدد الصماء، الفيتامينات والمعادن (Endocrine)
    // ==========================================================
    endocrine: [
        { key: 'tsh', label: 'الهرمون المحفز للغدة الدرقية (TSH) - ميكرو وحدة/مل', type: 'number', category: 'lab', default: 0 },
        { key: 'freeT3', label: 'هرمون الدرقية الحر (Free T3)', type: 'number', category: 'lab', default: 0 },
        { key: 'freeT4', label: 'هرمون الدرقية الحر (Free T4)', type: 'number', category: 'lab', default: 0 },
        { key: 'vitaminD', label: 'فيتامين د الكلي (25-Hydroxy) - نانوجرام/مل', type: 'number', category: 'lab', default: 0 },
        { key: 'vitaminB12', label: 'فيتامين ب12 - بيكوجرام/مل', type: 'number', category: 'lab', default: 0 },
        { key: 'serumCalcium', label: 'الكالسيوم الكلي في الدم (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'serumMagnesium', label: 'المغنيسيوم في الدم (مجم/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'serumZinc', label: 'الزنك في الدم (ميكروجرام/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
        { key: 'totalTestosterone', label: 'هرمون التستوستيرون الكلي (للرجال)', type: 'number', category: 'lab', default: 0 },
        { key: 'cortisol', label: 'هرمون الكورتيزول الصائم (ميكروجرام/ديسيلتر)', type: 'number', category: 'lab', default: 0 },
    ],

    // ==========================================================
    // الفئة 8: العادات الغذائية ونمط الحياة (Lifestyle)
    // ==========================================================
    lifestyle: [
        { key: 'dietQuality', label: 'كيف تقيم نظامك الغذائي الحالي؟', type: 'select', options: ['صحي جداً', 'متوازن', 'يعتمد على الوجبات السريعة'], category: 'lifestyle', default: 'متوازن' },
        { key: 'mealsPerDay', label: 'كم وجبة تتناولها في اليوم؟', type: 'select', options: ['وجبة', 'وجبتين', '3 وجبات', 'أكثر'], category: 'lifestyle', default: '3 وجبات' },
        { key: 'waterIntake', label: 'كم لتر من الماء تشربه يومياً؟', type: 'select', options: ['أقل من لتر', '1-2 لتر', '2-3 لتر', 'أكثر من 3 لتر'], category: 'lifestyle', default: '1-2 لتر' },
        { key: 'vegetablesFruits', label: 'كم مرة تتناول خضروات وفواكه طازجة أسبوعياً؟', type: 'select', options: ['يومياً', '3-4 مرات', 'نادراً'], category: 'lifestyle', default: '3-4 مرات' },
        { key: 'sugaryDrinks', label: 'معدل استهلاك المشروبات الغازية أو المحلاة أسبوعياً؟', type: 'select', options: ['لا أستهلكها', '1-3 مرات', 'يومياً'], category: 'lifestyle', default: 'لا أستهلكها' },
        { key: 'physicalActivity', label: 'طبيعة نشاطك البدني؟', type: 'select', options: ['خامل - مكتبى', 'نشاط خفيف', 'نشاط متوسط', 'رياضي محترف'], category: 'lifestyle', default: 'نشاط خفيف' },
        { key: 'exerciseDays', label: 'كم يوماً في الأسبوع تمارس الرياضة لمدة 30 دقيقة؟', type: 'select', options: ['0', '1-2 يوم', '3-5 أيام', 'يومياً'], category: 'lifestyle', default: '1-2 يوم' },
        { key: 'workNature', label: 'ما هي طبيعة عملك؟', type: 'select', options: ['جلوس مستمر', 'وقوف مستمر', 'حركة بدنية شاقة'], category: 'lifestyle', default: 'جلوس مستمر' },
        { key: 'smokingStatus', label: 'وضع التدخين الحالي؟', type: 'select', options: ['غير مدخن', 'مدخن سجائر', 'مدخن شيشة أو فِيب', 'مدخن سابق'], category: 'lifestyle', default: 'غير مدخن' },
        { key: 'cigarettesPerDay', label: 'عدد السجائر/المرات التي تستهلكها يومياً (في حالة المدخن)', type: 'number', category: 'lifestyle', default: 0 },
    ],

    // ==========================================================
    // الفئة 9: النوم، الصحة النفسية والإجهاد (Sleep & Mental)
    // ==========================================================
    sleepMental: [
        { key: 'sleepHours', label: 'عدد ساعات نومك الفعلية في الليلة المتوسطة؟', type: 'select', options: ['أقل من 5 ساعات', '5-7 ساعات', '7-9 ساعات', 'أكثر'], category: 'sleep', default: '7-9 ساعات' },
        { key: 'insomnia', label: 'هل تواجه صعوبة في الدخول في النوم (أرق)؟', type: 'select', options: ['نادراً', 'بانتظام', 'دائماً'], category: 'sleep', default: 'نادراً' },
        { key: 'wakeUpTired', label: 'هل تستيقظ متعباً ومجهداً حتى لو نمت لساعات كافية؟', type: 'boolean', category: 'sleep', default: false },
        { key: 'snoring', label: 'هل تعاني من الشخير أثناء النوم أو الاستيقاظ المفاجئ بسبب ضيق التنفس؟', type: 'boolean', category: 'sleep', default: false },
        { key: 'stressLevel', label: 'كيف تقيم مستوى التوتر والضغط العصبي في حياتك اليومية؟', type: 'select', options: ['منخفض', 'متوسط', 'مرتفع جداً'], category: 'sleep', default: 'متوسط' },
        { key: 'headaches', label: 'هل تعاني من صداع متكرر غير مبرر؟', type: 'select', options: ['لا', 'أحياناً', 'يومياً تقريباً'], category: 'sleep', default: 'لا' },
        { key: 'postMealFatigue', label: 'هل تشعر بخمول حاد أو رغبة في النوم بعد تناول وجبة الغداء؟', type: 'boolean', category: 'sleep', default: false },
        { key: 'concentration', label: 'كيف تقيم قدرتك على التركيز واسترجاع المعلومات مؤخراً؟', type: 'select', options: ['ممتازة', 'متوسطة', 'ضعيفة وتشتت مستمر'], category: 'sleep', default: 'متوسطة' },
        { key: 'moodSwings', label: 'هل تعاني من تقلبات مزاجية حادة بدون سبب واضح؟', type: 'boolean', category: 'sleep', default: false },
        { key: 'caffeineIntake', label: 'كم كوب من المشروبات المنبهة (قهوة/شاي/مشروبات طاقة) تتناول يومياً؟', type: 'number', category: 'sleep', default: 0 },
    ],

    // ==========================================================
    // الفئة 10: التاريخ الطبي والعائلي والأعراض العامة (Medical History)
    // ==========================================================
    medicalHistory: [
        { key: 'chronicDiseases', label: 'هل تم تشخيصك سابقاً بأي مرض مزمن؟ (سكري، ضغط، كوليسترول، غدة، لا يوجد)', type: 'text', category: 'history', default: '' },
        { key: 'allergies', label: 'هل تعاني من أي نوع من أنواع الحساسية (أدوية، أطعمة معينة، حساسية صدرية)؟', type: 'text', category: 'history', default: '' },
        { key: 'currentMedications', label: 'هل تخضع حالياً لعلاج دوائي مستمر؟ (اكتب أسماء الأدوية يدوياً)', type: 'text', category: 'history', default: '' },
        { key: 'familyDiabetes', label: 'هل هناك تاريخ عائلي لمرض السكري (الأب/الأم/الإخوة)؟', type: 'boolean', category: 'history', default: false },
        { key: 'familyHeartDisease', label: 'هل هناك تاريخ عائلي لأمراض القلب أو الجلطات المبكرة؟', type: 'boolean', category: 'history', default: false },
        { key: 'familyHypertension', label: 'هل هناك تاريخ عائلي لارتفاع ضغط الدم المزمن؟', type: 'boolean', category: 'history', default: false },
        { key: 'unexplainedWeightLoss', label: 'هل عانيت مؤخراً من فقدان وزن مفاجئ وغير مبرر (بدون دايت)؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'jointPain', label: 'هل تعاني من آلام مستمرة في المفاصل أو العظام تعيق حركتك؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'slowHealing', label: 'هل تلاحظ بطء شديد في التئام الجروح أو كدمات تظهر بدون اصطدام؟', type: 'boolean', category: 'redFlags', default: false },
        { key: 'recentSurgery', label: 'هل قمت بإجراء أي عمليات جراحية كبرى خلال الخمس سنوات الماضية؟', type: 'boolean', category: 'history', default: false },
    ],
};

// ----- دوال مساعدة للتعامل مع البيانات -----

// 1. حفظ البيانات في localStorage
function saveProfileData(data) {
    localStorage.setItem('patientFullProfile', JSON.stringify(data));
}

// 2. تحميل البيانات من localStorage
function loadProfileData() {
    const saved = localStorage.getItem('patientFullProfile');
    if (saved) {
        try { return JSON.parse(saved); } catch(e) {}
    }
    // بناء الكائن الافتراضي (كل المفاتيح بقيمها الافتراضية)
    const defaultData = {};
    Object.keys(PROFILE_SCHEMA).forEach(category => {
        PROFILE_SCHEMA[category].forEach(item => {
            defaultData[item.key] = item.default;
        });
    });
    return defaultData;
}

// 3. جلب كل الأسئلة (للاستخدام في عرض النماذج)
function getAllQuestions() {
    const all = [];
    Object.keys(PROFILE_SCHEMA).forEach(category => {
        PROFILE_SCHEMA[category].forEach(item => {
            all.push(item);
        });
    });
    return all;
}

// 4. جلب الأسئلة حسب الفئة
function getQuestionsByCategory(category) {
    return PROFILE_SCHEMA[category] || [];
}

// 5. حساب BMI من الوزن والطول
function calculateBMI(weight, height) {
    if (!weight || !height || height <= 0) return 0;
    return Math.round((weight / ((height/100) ** 2)) * 10) / 10;
}

// 6. حساب العمر من تاريخ الميلاد
function calculateAge(birthDate) {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

// 7. تحليل البيانات وعمل تقرير ذكي (مؤقت)
function generateHealthReport(data) {
    let report = '';
    const bmi = calculateBMI(data.weight, data.height);
    if (bmi > 0) {
        if (bmi < 18.5) report += '🔴 أنت تعاني من نقص وزن. يُنصح بزيادة السعرات الحرارية بشكل صحي.\n';
        else if (bmi < 25) report += '🟢 وزنك مثالي. استمر في الحفاظ على نمط حياتك الصحي.\n';
        else if (bmi < 30) report += '🟡 تعاني من زيادة في الوزن. يُنصح ببدء نشاط بدني منتظم وتقليل الكربوهيدرات.\n';
        else report += '🔴 تعاني من سمنة مفرطة. يُنصح بمراجعة أخصائي تغذية فوراً.\n';
    }

    if (data.bloodPressureSystolic > 140 || data.bloodPressureDiastolic > 90) {
        report += '🔴 قراءات ضغط الدم مرتفعة. يُنصح بمتابعة الطبيب وتقليل الملح.\n';
    } else if (data.bloodPressureSystolic > 120 || data.bloodPressureDiastolic > 80) {
        report += '🟡 ضغط الدم مرتفع بشكل بسيط. ابدأ بمراقبته يومياً.\n';
    } else if (data.bloodPressureSystolic > 0) {
        report += '🟢 ضغط الدم ممتاز. استمر في الحفاظ عليه.\n';
    }

    if (data.fastingBloodSugar > 126) {
        report += '🔴 السكر الصائم مرتفع جداً (احتمالية سكري). يُنصح بزيارة الطبيب فوراً.\n';
    } else if (data.fastingBloodSugar > 100) {
        report += '🟡 السكر الصائم مرتفع بشكل بسيط (مقدمات السكري). ابدأ بتقليل السكريات.\n';
    } else if (data.fastingBloodSugar > 0) {
        report += '🟢 السكر الصائم ضمن المعدل الطبيعي.\n';
    }

    if (data.sleepHours === 'أقل من 5 ساعات' || data.sleepHours === '5-7 ساعات') {
        report += '🟡 عدد ساعات نومك غير كافٍ. يُنصح بالنوم 7-9 ساعات يومياً.\n';
    }

    if (data.smokingStatus === 'مدخن سجائر' || data.smokingStatus === 'مدخن شيشة أو فِيب') {
        report += '🔴 التدخين يؤثر سلباً على صحتك العامة. يُنصح بطلب المساعدة للإقلاع.\n';
    }

    return report || '🟢 لا توجد ملاحظات صحية حالياً. استمر في رعاية صحتك.';
}

// تصدير الدوال والبيانات للاستخدام في الصفحات الأخرى
console.log('✅ profile-schema.js loaded (100+ questions)');