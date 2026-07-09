// backend/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ============================================================
// جلب الإحصائيات حسب الدور
// ============================================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let stats = {};

        // --- 1. مريض ---
        if (role === 'patient') {
            const [prescriptions] = await db.query(
                'SELECT COUNT(*) as count FROM prescriptions WHERE patient_id = ?', [userId]
            );
            const [appointments] = await db.query(
                'SELECT COUNT(*) as count FROM appointments WHERE patient_id = ?', [userId]
            );
            const [wallet] = await db.query(
                'SELECT balance FROM wallets WHERE user_id = ?', [userId]
            );
            const [loyalty] = await db.query(
                'SELECT points FROM loyalty_points WHERE user_id = ?', [userId]
            );
            stats = {
                prescriptions: prescriptions[0]?.count || 0,
                appointments: appointments[0]?.count || 0,
                wallet: wallet[0]?.balance || 0,
                loyalty: loyalty[0]?.points || 0
            };
        }

        // --- 2. صيدلي ---
        else if (role === 'pharmacy') {
            const [pharmacy] = await db.query(
                'SELECT id FROM pharmacies WHERE user_id = ?', [userId]
            );
            if (pharmacy.length > 0) {
                const pharmacyId = pharmacy[0].id;
                const [orders] = await db.query(
                    'SELECT COUNT(*) as count FROM orders WHERE pharmacy_id = ? AND DATE(created_at) = CURDATE()', [pharmacyId]
                );
                const [customers] = await db.query(
                    'SELECT COUNT(DISTINCT patient_id) as count FROM orders WHERE pharmacy_id = ?', [pharmacyId]
                );
                const [alerts] = await db.query(
                    'SELECT COUNT(*) as count FROM pharmacy_inventory WHERE pharmacy_id = ? AND quantity_in_stock < 10', [pharmacyId]
                );
                stats = {
                    ordersToday: orders[0]?.count || 0,
                    customers: customers[0]?.count || 0,
                    alerts: alerts[0]?.count || 0,
                    // الجروبات (مؤقتاً 0 لحد ما نضيفها)
                    groups: 0
                };
            } else {
                stats = { ordersToday: 0, customers: 0, alerts: 0, groups: 0 };
            }
        }

        // --- 3. طبيب / عيادة ---
        else if (role === 'doctor' || role === 'clinic') {
            const [todayPatients] = await db.query(
                'SELECT COUNT(DISTINCT patient_id) as count FROM prescriptions WHERE doctor_id = ? AND DATE(created_at) = CURDATE()', [userId]
            );
            const [weekPatients] = await db.query(
                'SELECT COUNT(DISTINCT patient_id) as count FROM prescriptions WHERE doctor_id = ? AND YEARWEEK(created_at) = YEARWEEK(CURDATE())', [userId]
            );
            const [appointments] = await db.query(
                'SELECT COUNT(*) as count FROM appointments WHERE doctor_id = ? AND status = "pending"', [userId]
            );
            const [prescriptions] = await db.query(
                'SELECT COUNT(*) as count FROM prescriptions WHERE doctor_id = ?', [userId]
            );
            stats = {
                patientsToday: todayPatients[0]?.count || 0,
                patientsWeek: weekPatients[0]?.count || 0,
                appointments: appointments[0]?.count || 0,
                prescriptions: prescriptions[0]?.count || 0
            };
        }

        // --- 4. مختبر ---
        else if (role === 'lab') {
            const [lab] = await db.query(
                'SELECT id FROM labs WHERE user_id = ?', [userId]
            );
            if (lab.length > 0) {
                const labId = lab[0].id;
                const [today] = await db.query(
                    'SELECT COUNT(*) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "lab" AND DATE(created_at) = CURDATE()', [labId]
                );
                const [processing] = await db.query(
                    'SELECT COUNT(*) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "lab" AND status = "processing"', [labId]
                );
                const [completed] = await db.query(
                    'SELECT COUNT(*) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "lab" AND status = "completed"', [labId]
                );
                const [clients] = await db.query(
                    'SELECT COUNT(DISTINCT patient_id) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "lab"', [labId]
                );
                stats = {
                    today: today[0]?.count || 0,
                    processing: processing[0]?.count || 0,
                    completed: completed[0]?.count || 0,
                    clients: clients[0]?.count || 0
                };
            } else {
                stats = { today: 0, processing: 0, completed: 0, clients: 0 };
            }
        }

        // --- 5. أشعة ---
        else if (role === 'radiology') {
            const [center] = await db.query(
                'SELECT id FROM radiology_centers WHERE user_id = ?', [userId]
            );
            if (center.length > 0) {
                const centerId = center[0].id;
                const [today] = await db.query(
                    'SELECT COUNT(*) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "radiology" AND DATE(created_at) = CURDATE()', [centerId]
                );
                const [processing] = await db.query(
                    'SELECT COUNT(*) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "radiology" AND status = "processing"', [centerId]
                );
                const [completed] = await db.query(
                    'SELECT COUNT(*) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "radiology" AND status = "completed"', [centerId]
                );
                const [clients] = await db.query(
                    'SELECT COUNT(DISTINCT patient_id) as count FROM lab_radiology_orders WHERE provider_id = ? AND provider_type = "radiology"', [centerId]
                );
                stats = {
                    today: today[0]?.count || 0,
                    processing: processing[0]?.count || 0,
                    completed: completed[0]?.count || 0,
                    clients: clients[0]?.count || 0
                };
            } else {
                stats = { today: 0, processing: 0, completed: 0, clients: 0 };
            }
        }

        // --- 6. مورد ---
        else if (role === 'supplier') {
            const [supplier] = await db.query(
                'SELECT id FROM suppliers WHERE user_id = ?', [userId]
            );
            if (supplier.length > 0) {
                // بافتراض أن المنتجات مسجلة في جدول supplier_products (مش موجود حالياً، هنعدّه 0 مؤقتاً)
                const [products] = await db.query(
                    'SELECT COUNT(*) as count FROM supplier_products WHERE supplier_id = ?', [supplier[0].id]
                );
                // لو مش موجود الجدول، هنرجع 0
                const [orders] = await db.query(
                    'SELECT COUNT(*) as count FROM orders WHERE supplier_id = ? AND status != "delivered"', [supplier[0].id]
                );
                const [processing] = await db.query(
                    'SELECT COUNT(*) as count FROM orders WHERE supplier_id = ? AND status = "processing"', [supplier[0].id]
                );
                const [clients] = await db.query(
                    'SELECT COUNT(DISTINCT pharmacy_id) as count FROM orders WHERE supplier_id = ?', [supplier[0].id]
                );
                stats = {
                    products: products[0]?.count || 0,
                    purchaseOrders: orders[0]?.count || 0,
                    processing: processing[0]?.count || 0,
                    clients: clients[0]?.count || 0
                };
            } else {
                stats = { products: 0, purchaseOrders: 0, processing: 0, clients: 0 };
            }
        }

        // --- 7. مشرف (مؤقتاً أصفار) ---
        else if (role === 'admin') {
            stats = { users: 0, orders: 0, revenue: 0 };
        }

        res.json({ success: true, stats });

    } catch (err) {
        console.error('❌ خطأ في جلب الإحصائيات:', err);
        res.status(500).json({ success: false, error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;