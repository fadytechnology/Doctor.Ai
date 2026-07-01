const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

exports.sendResetEmail = async (to, token) => {
    const resetLink = `http://localhost:5000/reset-password.html?token=${token}`;
    await transporter.sendMail({
        from: `"Doctor.ai" <${process.env.SMTP_USER}>`,
        to,
        subject: 'إعادة تعيين كلمة المرور - Doctor.ai',
        html: `
            <h1>إعادة تعيين كلمة المرور</h1>
            <p>انقر على الرابط التالي لإعادة تعيين كلمة المرور:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>هذا الرابط صالح لمدة ساعة واحدة.</p>
        `
    });
};