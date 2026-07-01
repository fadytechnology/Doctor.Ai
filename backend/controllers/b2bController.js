// ============================================================
// ===== كونترولر B2B =====
// ============================================================

const B2BListing = require('../models/B2BListing');

// ===== إنشاء عرض جديد =====
exports.createListing = async (req, res) => {
    try {
        const { title, description, service_type, price, availability, valid_until } = req.body;
        const provider_id = req.userId;
        const provider_type = req.userRole;

        // التحقق من أن المستخدم من نوع مزود خدمة
        const allowedRoles = ['clinic', 'lab', 'radiology'];
        if (!allowedRoles.includes(provider_type)) {
            return res.status(403).json({
                success: false,
                message: 'فقط العيادات والمعامل ومراكز الأشعة يمكنها إضافة عروض'
            });
        }

        if (!title || !description || !price) {
            return res.status(400).json({
                success: false,
                message: 'العنوان، الوصف، والسعر مطلوبة'
            });
        }

        const listingId = await B2BListing.create({
            provider_id,
            provider_type,
            title,
            description,
            service_type: service_type || 'general',
            price,
            availability: availability || 'available',
            valid_until
        });

        res.status(201).json({
            success: true,
            message: 'تم إضافة العرض بنجاح',
            listingId
        });
    } catch (error) {
        console.error('❌ خطأ في إنشاء العرض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب جميع العروض =====
exports.getAllListings = async (req, res) => {
    try {
        const listings = await B2BListing.getAllActive();
        res.json({
            success: true,
            listings
        });
    } catch (error) {
        console.error('❌ خطأ في جلب العروض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب عروض مزود معين =====
exports.getProviderListings = async (req, res) => {
    try {
        const listings = await B2BListing.getByProvider(req.userId);
        res.json({
            success: true,
            listings
        });
    } catch (error) {
        console.error('❌ خطأ في جلب عروض المزود:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== جلب عرض معين =====
exports.getListingById = async (req, res) => {
    try {
        const listing = await B2BListing.getById(req.params.id);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'العرض غير موجود'
            });
        }
        res.json({
            success: true,
            listing
        });
    } catch (error) {
        console.error('❌ خطأ في جلب العرض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== تحديث العرض =====
exports.updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await B2BListing.getById(listingId);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'العرض غير موجود'
            });
        }

        // التحقق من أن المستخدم هو صاحب العرض
        if (listing.provider_id !== req.userId) {
            return res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية لتحديث هذا العرض'
            });
        }

        await B2BListing.update(listingId, req.body);
        res.json({
            success: true,
            message: 'تم تحديث العرض بنجاح'
        });
    } catch (error) {
        console.error('❌ خطأ في تحديث العرض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};

// ===== حذف العرض =====
exports.deleteListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const listing = await B2BListing.getById(listingId);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: 'العرض غير موجود'
            });
        }

        if (listing.provider_id !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'ليس لديك صلاحية لحذف هذا العرض'
            });
        }

        await B2BListing.delete(listingId);
        res.json({
            success: true,
            message: 'تم حذف العرض بنجاح'
        });
    } catch (error) {
        console.error('❌ خطأ في حذف العرض:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في السيرفر'
        });
    }
};