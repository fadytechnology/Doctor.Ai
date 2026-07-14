// backend/services/notificationScheduler.js
const db = require('../config/db');
const cron = require('node-cron');

// ============================================================
// 1. التحقق من الروشتات المزمنة وتجديدها تلقائياً
// ============================================================
async function checkRefillReminders() {
    try {
        console.log('🔄 جاري فحص الروشتات المزمنة...');

        // جلب المرضى الذين لديهم روشتات مزمنة وعلى وشك النفاد (قبل 3 أيام من انتهاء الصلاحية)
        const [prescriptions] = await db.query(`
            SELECT
                p.id as prescription_id,
                p.patient_id,
                p.medications,
                p.doctor_id,
                p.pharmacy_id,
                u.full_name as patient_name,
                u.email as patient_email,
                u.phone as patient_phone,
                DATEDIFF(p.expires_at, CURDATE()) as days_remaining
            FROM prescriptions p
            JOIN users u ON u.id = p.patient_id
            WHERE p.status = 'approved'
              AND p.expires_at IS NOT NULL
              AND DATEDIFF(p.expires_at, CURDATE()) BETWEEN 1 AND 3
              AND p.is_controlled_substance = false
        `);

        for (const rx of prescriptions) {
            // التحقق من عدم إرسال تذكير مكرر خلال 24 ساعة
            const [existing] = await db.query(`
                SELECT id FROM notifications
                WHERE user_id = ? AND type = 'refill_reminder'
                  AND related_id = ?
                  AND created_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
            `, [rx.patient_id, rx.prescription_id]);

            if (existing.length > 0) continue;

            // إنشاء إشعار للمريض
            await db.query(`
                INSERT INTO notifications
                (user_id, title, body, type, related_id)
                VALUES (?, ?, ?, ?, ?)
            `, [
                rx.patient_id,
                '🔄 تذكير بتجديد الروشتة',
                `ينتهي مفعول دوائك خلال ${rx.days_remaining} يوم. اضغط لتجديده بنقرة واحدة.`,
                'refill_reminder',
                rx.prescription_id
            ]);

            console.log(`✅ تم إرسال تذكير للمريض ${rx.patient_name}`);
        }
    } catch (err) {
        console.error('❌ خطأ في فحص تجديد الروشتات:', err);
    }
}

// ============================================================
// 2. التحقق من نقص المخزون
// ============================================================
async function checkInventoryAlerts() {
    try {
        console.log('🔄 جاري فحص المخزون...');

        const [items] = await db.query(`
            SELECT
                i.id,
                i.drug_name,
                i.quantity_in_stock,
                i.pharmacy_id,
                p.pharmacy_name,
                p.user_id as pharmacy_user_id
            FROM pharmacy_inventory i
            JOIN pharmacies p ON p.id = i.pharmacy_id
            WHERE i.quantity_in_stock < 10
        `);

        for (const item of items) {
            // إنشاء إشعار للصيدلي
            await db.query(`
                INSERT INTO notifications
                (user_id, title, body, type, related_id)
                VALUES (?, ?, ?, ?, ?)
            `, [
                item.pharmacy_user_id,
                '⚠️ تنبيه: نقص في المخزون',
                `الدواء "${item.drug_name}" يقترب من النفاد (الكمية المتبقية: ${item.quantity_in_stock})`,
                'inventory_alert',
                item.id
            ]);

            console.log(`✅ تم إرسال تنبيه للصيدلية ${item.pharmacy_name}`);
        }
    } catch (err) {
        console.error('❌ خطأ في فحص المخزون:', err);
    }
}

// ============================================================
// 3. جدولة المهام
// ============================================================
function startScheduler() {
    // كل ساعة
    cron.schedule('0 * * * *', () => {
        console.log('⏰ تشغيل المهام المجدولة...');
        checkRefillReminders();
        checkInventoryAlerts();
    });

    console.log('✅ Scheduler started');
}

module.exports = { startScheduler };