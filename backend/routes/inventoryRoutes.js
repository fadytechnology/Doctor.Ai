// backend/routes/inventoryRoutes.js
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { authenticateToken } = require('../middleware/auth');

// ============================================================
// 1. جلب جميع الأدوية في مخزون الصيدلي الحالي
// ============================================================
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        // التحقق من أن المستخدم صيدلي
        if (role !== 'pharmacy') {
            return res.status(403).json({ error: 'غير مصرح به، فقط الصيادلة يمكنهم إدارة المخزون' });
        }

        // جلب معرف الصيدلية من جدول pharmacies
        const [pharmacy] = await db.query(
            'SELECT id FROM pharmacies WHERE user_id = ?',
            [userId]
        );
        if (pharmacy.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على صيدلية مرتبطة بهذا الحساب' });
        }

        const pharmacyId = pharmacy[0].id;

        // جلب جميع الأدوية في مخزون الصيدلية
        const [inventory] = await db.query(
            `SELECT id, drug_name, generic_name, concentration, quantity_in_stock,
                    price, batch_number, expiry_date, requires_prescription, image_url,
                    created_at, updated_at
             FROM pharmacy_inventory
             WHERE pharmacy_id = ?
             ORDER BY drug_name ASC`,
            [pharmacyId]
        );

        res.json({ success: true, inventory });
    } catch (err) {
        console.error('❌ خطأ في جلب المخزون:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 2. البحث عن دواء (للمريض أو الصيدلي)
// ============================================================
router.get('/search', authenticateToken, async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim().length < 2) {
            return res.status(400).json({ error: 'يرجى إدخال اسم الدواء (حرفان على الأقل)' });
        }

        const searchTerm = `%${q.trim()}%`;

        // البحث في كل الصيدليات (للمريض) أو في مخزون الصيدلي (للصيدلي)
        const userId = req.user.id;
        const role = req.user.role;

        let query = `
            SELECT i.id, i.drug_name, i.generic_name, i.concentration,
                   i.quantity_in_stock, i.price, i.requires_prescription,
                   p.pharmacy_name, p.latitude, p.longitude, p.address
            FROM pharmacy_inventory i
            JOIN pharmacies p ON i.pharmacy_id = p.id
            WHERE (i.drug_name LIKE ? OR i.generic_name LIKE ?)
              AND i.quantity_in_stock > 0
        `;
        const params = [searchTerm, searchTerm];

        // إذا كان المستخدم صيدلي، نبحث فقط في مخزونه
        if (role === 'pharmacy') {
            const [pharmacy] = await db.query(
                'SELECT id FROM pharmacies WHERE user_id = ?',
                [userId]
            );
            if (pharmacy.length > 0) {
                query += ' AND i.pharmacy_id = ?';
                params.push(pharmacy[0].id);
            }
        }

        query += ' ORDER BY i.drug_name ASC LIMIT 50';

        const [results] = await db.query(query, params);

        res.json({ success: true, results });
    } catch (err) {
        console.error('❌ خطأ في البحث عن دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 3. إضافة دواء جديد إلى المخزون
// ============================================================
router.post('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;

        if (role !== 'pharmacy') {
            return res.status(403).json({ error: 'غير مصرح به، فقط الصيادلة يمكنهم إضافة أدوية' });
        }

        const [pharmacy] = await db.query(
            'SELECT id FROM pharmacies WHERE user_id = ?',
            [userId]
        );
        if (pharmacy.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على صيدلية مرتبطة بهذا الحساب' });
        }

        const pharmacyId = pharmacy[0].id;

        const {
            drug_name,
            generic_name,
            concentration,
            quantity_in_stock,
            price,
            batch_number,
            expiry_date,
            requires_prescription,
            image_url
        } = req.body;

        // التحقق من البيانات المطلوبة
        if (!drug_name || quantity_in_stock === undefined || !price) {
            return res.status(400).json({ error: 'اسم الدواء، الكمية، والسعر مطلوبة' });
        }

        const [result] = await db.query(
            `INSERT INTO pharmacy_inventory
             (pharmacy_id, drug_name, generic_name, concentration,
              quantity_in_stock, price, batch_number, expiry_date,
              requires_prescription, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                pharmacyId,
                drug_name,
                generic_name || null,
                concentration || null,
                quantity_in_stock,
                price,
                batch_number || null,
                expiry_date || null,
                requires_prescription || false,
                image_url || null
            ]
        );

        res.status(201).json({
            success: true,
            message: 'تم إضافة الدواء بنجاح',
            id: result.insertId
        });
    } catch (err) {
        console.error('❌ خطأ في إضافة دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 4. تحديث دواء معين
// ============================================================
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const inventoryId = req.params.id;

        if (role !== 'pharmacy') {
            return res.status(403).json({ error: 'غير مصرح به، فقط الصيادلة يمكنهم تحديث الأدوية' });
        }

        const [pharmacy] = await db.query(
            'SELECT id FROM pharmacies WHERE user_id = ?',
            [userId]
        );
        if (pharmacy.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على صيدلية مرتبطة بهذا الحساب' });
        }

        const pharmacyId = pharmacy[0].id;

        // التحقق من أن الدواء ينتمي لهذه الصيدلية
        const [existing] = await db.query(
            'SELECT id FROM pharmacy_inventory WHERE id = ? AND pharmacy_id = ?',
            [inventoryId, pharmacyId]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'الدواء غير موجود أو لا ينتمي لك' });
        }

        const {
            drug_name,
            generic_name,
            concentration,
            quantity_in_stock,
            price,
            batch_number,
            expiry_date,
            requires_prescription,
            image_url
        } = req.body;

        // بناء استعلام التحديث ديناميكياً
        const fields = [];
        const values = [];
        if (drug_name) { fields.push('drug_name = ?'); values.push(drug_name); }
        if (generic_name !== undefined) { fields.push('generic_name = ?'); values.push(generic_name); }
        if (concentration !== undefined) { fields.push('concentration = ?'); values.push(concentration); }
        if (quantity_in_stock !== undefined) { fields.push('quantity_in_stock = ?'); values.push(quantity_in_stock); }
        if (price !== undefined) { fields.push('price = ?'); values.push(price); }
        if (batch_number !== undefined) { fields.push('batch_number = ?'); values.push(batch_number); }
        if (expiry_date !== undefined) { fields.push('expiry_date = ?'); values.push(expiry_date); }
        if (requires_prescription !== undefined) { fields.push('requires_prescription = ?'); values.push(requires_prescription); }
        if (image_url !== undefined) { fields.push('image_url = ?'); values.push(image_url); }

        if (fields.length === 0) {
            return res.status(400).json({ error: 'لا توجد بيانات للتحديث' });
        }

        values.push(inventoryId);
        await db.query(
            `UPDATE pharmacy_inventory SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ success: true, message: 'تم تحديث الدواء بنجاح' });
    } catch (err) {
        console.error('❌ خطأ في تحديث دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 5. حذف دواء من المخزون
// ============================================================
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const inventoryId = req.params.id;

        if (role !== 'pharmacy') {
            return res.status(403).json({ error: 'غير مصرح به، فقط الصيادلة يمكنهم حذف الأدوية' });
        }

        const [pharmacy] = await db.query(
            'SELECT id FROM pharmacies WHERE user_id = ?',
            [userId]
        );
        if (pharmacy.length === 0) {
            return res.status(404).json({ error: 'لم يتم العثور على صيدلية مرتبطة بهذا الحساب' });
        }

        const pharmacyId = pharmacy[0].id;

        const [existing] = await db.query(
            'SELECT id FROM pharmacy_inventory WHERE id = ? AND pharmacy_id = ?',
            [inventoryId, pharmacyId]
        );
        if (existing.length === 0) {
            return res.status(404).json({ error: 'الدواء غير موجود أو لا ينتمي لك' });
        }

        await db.query('DELETE FROM pharmacy_inventory WHERE id = ?', [inventoryId]);

        res.json({ success: true, message: 'تم حذف الدواء بنجاح' });
    } catch (err) {
        console.error('❌ خطأ في حذف دواء:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

// ============================================================
// 6. جلب الصيدليات القريبة التي لديها دواء معين (الخريطة الذكية)
// ============================================================
router.get('/nearby', authenticateToken, async (req, res) => {
    try {
        const { lat, lng, drug, radius } = req.query;

        if (!lat || !lng || !drug) {
            return res.status(400).json({ error: 'خط العرض، خط الطول، واسم الدواء مطلوبة' });
        }

        const searchTerm = `%${drug.trim()}%`;
        const maxRadius = radius || 10; // افتراضي 10 كيلومترات

        // معادلة هافرسين لحساب المسافة بين نقطتين
        const query = `
            SELECT
                p.id,
                p.pharmacy_name,
                p.address,
                p.phone,
                p.latitude,
                p.longitude,
                i.drug_name,
                i.generic_name,
                i.concentration,
                i.price,
                i.quantity_in_stock,
                i.requires_prescription,
                (
                    6371 * ACOS(
                        COS(RADIANS(?)) * COS(RADIANS(p.latitude)) *
                        COS(RADIANS(p.longitude) - RADIANS(?)) +
                        SIN(RADIANS(?)) * SIN(RADIANS(p.latitude))
                    )
                ) AS distance_km
            FROM pharmacy_inventory i
            JOIN pharmacies p ON i.pharmacy_id = p.id
            WHERE (i.drug_name LIKE ? OR i.generic_name LIKE ?)
              AND i.quantity_in_stock > 0
              AND p.latitude IS NOT NULL
              AND p.longitude IS NOT NULL
            HAVING distance_km < ?
            ORDER BY distance_km ASC
            LIMIT 20
        `;

        const [results] = await db.query(query, [
            parseFloat(lat),
            parseFloat(lng),
            parseFloat(lat),
            searchTerm,
            searchTerm,
            maxRadius
        ]);

        res.json({ success: true, results });
    } catch (err) {
        console.error('❌ خطأ في جلب الصيدليات القريبة:', err);
        res.status(500).json({ error: 'حدث خطأ في السيرفر' });
    }
});

module.exports = router;