// ============================================================
// ===== controllers/walletController.js =====
// ============================================================

const db = require('../config/db');

// ----- جلب بيانات المحفظة -----
exports.getWallet = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT points, cashback, balance FROM wallets WHERE user_id = ?',
            [req.userId]
        );
        if (rows.length === 0) {
            await db.query('INSERT INTO wallets (user_id, points, cashback, balance) VALUES (?, 0, 0, 0)', [req.userId]);
            return res.json({ success: true, data: { points: 0, cashback: 0, balance: 0 } });
        }
        res.json({ success: true, data: rows[0] });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- إضافة نقاط (بعد شراء أو مشاهدة إعلان) -----
exports.addPoints = async (req, res) => {
    try {
        const { points, reason } = req.body;
        if (!points) return res.status(400).json({ success: false, message: 'عدد النقاط مطلوب' });

        await db.query(
            'UPDATE wallets SET points = points + ?, updated_at = NOW() WHERE user_id = ?',
            [points, req.userId]
        );
        await db.query(
            'INSERT INTO wallet_transactions (user_id, type, amount, description) VALUES (?, "earned", ?, ?)',
            [req.userId, points, reason || 'نقاط مكتسبة']
        );

        res.json({ success: true, message: '✅ تم إضافة النقاط' });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};

// ----- استبدال النقاط بخصم -----
exports.redeemPoints = async (req, res) => {
    try {
        const [wallet] = await db.query('SELECT points FROM wallets WHERE user_id = ?', [req.userId]);
        if (wallet.length === 0 || wallet[0].points < 100) {
            return res.status(400).json({ success: false, message: '⚠️ تحتاج 100 نقطة على الأقل' });
        }

        const usedPoints = Math.floor(wallet[0].points / 100) * 100;
        const discount = usedPoints / 10;

        await db.query('UPDATE wallets SET points = points - ?, balance = balance + ?, updated_at = NOW() WHERE user_id = ?', 
            [usedPoints, discount, req.userId]);
        await db.query(
            'INSERT INTO wallet_transactions (user_id, type, amount, description) VALUES (?, "redeemed", ?, ?)',
            [req.userId, discount, 'استبدال نقاط بخصم']
        );

        res.json({ success: true, message: '✅ تم استبدال النقاط', discount });
    } catch (error) {
        console.error('❌ خطأ:', error);
        res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
    }
};