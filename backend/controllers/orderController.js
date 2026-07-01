// ============================================================
// ===== كونترولر الطلبات =====
// ============================================================

const Order = require('../models/Order');

// ===== إنشاء طلب جديد =====
exports.createOrder = async (req, res) => {
    try {
        const { pharmacy_id, items, total_amount, notes, prescription_url } = req.body;
        const patient_id = req.userId; // من ميدل وير المصادقة

        if (!pharmacy_id || !items || !total_amount) {
            return res.status(400).json({
                success: false,
                message: 'الصيدلي، الأدوية، والمبلغ الإجمالي مطلوبة'
            });
        }

        const orderId = await Order.create({
            patient_id,
            pharmacy_id,
            items,
            total_amount,
            notes,
            prescription_url
        });

        res.status(201).json({
            success: true,
            message: 'تم إنشاء الطلب بنجاح',
            orderId
        });
    } catch (error) {
        console.error('❌ خطأ في إنشاء الطلب:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب طلبات المريض =====
exports.getPatientOrders = async (req, res) => {
    try {
        const orders = await Order.getPatientOrders(req.userId);
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('❌ خطأ في جلب طلبات المريض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب طلبات الصيدلي =====
exports.getPharmacyOrders = async (req, res) => {
    try {
        const orders = await Order.getPharmacyOrders(req.userId);
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('❌ خطأ في جلب طلبات الصيدلي:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب طلب معين =====
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.getById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود'
            });
        }
        res.json({
            success: true,
            order
        });
    } catch (error) {
        console.error('❌ خطأ في جلب الطلب:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== تحديث حالة الطلب =====
exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderId = req.params.id;
        const userId = req.userId;
        const userRole = req.userRole;

        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'حالة غير صالحة'
            });
        }

        // التحقق من وجود الطلب
        const order = await Order.getById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'الطلب غير موجود'
            });
        }

        // التحقق من الصلاحيات
        if (userRole === 'patient' && order.patient_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية لتحديث هذا الطلب'
            });
        }

        if (userRole === 'pharmacy' && order.pharmacy_id !== userId) {
            return res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية لتحديث هذا الطلب'
            });
        }

        await Order.updateStatus(orderId, status, userId);

        res.json({
            success: true,
            message: 'تم تحديث حالة الطلب بنجاح'
        });
    } catch (error) {
        console.error('❌ خطأ في تحديث حالة الطلب:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب جميع الطلبات (للمدير) =====
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('❌ خطأ في جلب جميع الطلبات:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};