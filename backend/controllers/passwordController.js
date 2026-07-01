const User = require('../models/User');
const ResetToken = require('../models/ResetToken');
const { sendResetEmail } = require('../services/emailService');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ success: false, message: 'البريد الإلكتروني غير مسجل' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 3600000); // 1 hour
        await ResetToken.create(user.id, token, expiresAt);
        await sendResetEmail(email, token);
        res.json({ success: true, message: 'تم إرسال رابط إعادة التعيين إلى بريدك' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const resetData = await ResetToken.findByToken(token);
        if (!resetData) {
            return res.status(400).json({ success: false, message: 'رابط غير صالح أو منتهي الصلاحية' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update(resetData.user_id, { password: hashedPassword });
        await ResetToken.delete(token);
        res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};