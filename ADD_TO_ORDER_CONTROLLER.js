// ============================================================
// ===== إضافة إلى orderController.js (منطق خصم المخزون) =====
// ============================================================

// ----- تعديل دالة createOrder في orderController.js -----
// استبدل الجزء الخاص بإنشاء الطلب وأضف هذا المنطق:

// 1. التحقق من الكمية في المخزون
if (drug_id) {
    const [inventory] = await db.query(
        'SELECT quantity FROM pharmacy_inventory WHERE pharmacy_id = (SELECT id FROM pharmacies WHERE user_id = ?) AND drug_id = ?',
        [pharmacy_user_id, drug_id]
    );
    if (inventory.length === 0 || inventory[0].quantity < quantity) {
        return res.status(400).json({
            success: false,
            message: '⚠️ الكمية المطلوبة غير متوفرة في المخزون'
        });
    }
}

// 2. إنشاء الطلب
const [orderResult] = await db.query(
    'INSERT INTO orders (patient_id, pharmacy_id, drug_id, quantity, total_price, notes) VALUES (?, ?, ?, ?, ?, ?)',
    [patient_id, pharmacy_id, drug_id, quantity, total_price, notes || '']
);

// 3. خصم الكمية من المخزون
await db.query(
    'UPDATE pharmacy_inventory SET quantity = quantity - ? WHERE pharmacy_id = (SELECT id FROM pharmacies WHERE user_id = ?) AND drug_id = ?',
    [quantity, pharmacy_user_id, drug_id]
);

// 4. إضافة نقاط للمريض (نقطة لكل 10 جنيه)
const pointsEarned = Math.floor(total_price / 10);
await db.query(
    'UPDATE wallets SET points = points + ?, updated_at = NOW() WHERE user_id = ?',
    [pointsEarned, patient_id]
);
await db.query(
    'INSERT INTO wallet_transactions (user_id, type, amount, description) VALUES (?, "earned", ?, ?)',
    [patient_id, pointsEarned, 'نقاط من شراء']
);