// backend/routes/statsRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        let stats = {};

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
        } else if (role === 'pharmacy') {
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
                    groups: 0
                };
            } else {
                stats = { ordersToday: 0, customers: 0, alerts: 0, groups: 0 };
            }
        } else if (role === 'doctor' || role === 'clinic') {
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
        } else if (role === 'lab') {
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
        } else if (role === 'radiology') {
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
        } else if (role === 'supplier') {
            const [supplier] = await db.query(
                'SELECT id FROM suppliers WHERE user_id = ?', [userId]
            );
            if (supplier.length > 0) {
                const supplierId = supplier[0].id;
                // استخدام جداول موجودة فقط، وتجنب الأخطاء
                let productsCount = 0;
                let purchaseOrders = 0;
                let processing = 0;
                let clients = 0;

                // محاولة جلب عدد المنتجات (إذا كان الجدول موجوداً)
                try {
                    const [products] = await db.query(
                        'SELECT COUNT(*) as count FROM supplier_products WHERE supplier_id = ?', [supplierId]
                    );
                    productsCount = products[0]?.count || 0;
                } catch (e) {
                    // تجاهل الخطأ، الجدول غير موجود
                    productsCount = 0;
                }

                // محاولة جلب طلبات الشراء (إذا كان عمود supplier_id موجوداً)
                try {
                    const [orders] = await db.query(
                        'SELECT COUNT(*) as count FROM orders WHERE supplier_id = ? AND status != "delivered"', [supplierId]
                    );
                    purchaseOrders = orders[0]?.count || 0;
                } catch (e) {
                    purchaseOrders = 0;
                }

                try {
                    const [proc] = await db.query(
                        'SELECT COUNT(*) as count FROM orders WHERE supplier_id = ? AND status = "processing"', [supplierId]
                    );
                    processing = proc[0]?.count || 0;
                } catch (e) {
                    processing = 0;
                }

                try {
                    const [cl] = await db.query(
                        'SELECT COUNT(DISTINCT pharmacy_id) as count FROM orders WHERE supplier_id = ?', [supplierId]
                    );
                    clients = cl[0]?.count || 0;
                } catch (e) {
                    clients = 0;
                }

                stats = {
                    products: productsCount,
                    purchaseOrders: purchaseOrders,
                    processing: processing,
                    clients: clients
                };
            } else {
                stats = { products: 0, purchaseOrders: 0, processing: 0, clients: 0 };
            }
        } else if (role === 'admin') {
            const [users] = await db.query('SELECT COUNT(*) as count FROM users');
            const [orders] = await db.query('SELECT COUNT(*) as count FROM orders');
            // يمكن جلب الإيرادات من جدول orders إذا كان موجوداً
            let revenue = 0;
            try {
                const [rev] = await db.query('SELECT SUM(final_payment) as total FROM orders WHERE delivery_status = "delivered"');
                revenue = rev[0]?.total || 0;
            } catch (e) {
                revenue = 0;
            }
            stats = {
                users: users[0]?.count || 0,
                orders: orders[0]?.count || 0,
                revenue: revenue
            };
        }

        res.json({ success: true, stats });
    } catch (err) {
        console.error('❌ خطأ في جلب الإحصائيات:', err);
        res.status(500).json({ success: false, error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;