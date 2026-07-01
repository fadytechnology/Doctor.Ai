const User = require('../models/User');
exports.updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, birth_date, blood_type } = req.body;
    const userId = req.userId;
    await User.update(userId, { full_name, phone, address, birth_date, blood_type });
    const updatedUser = await User.findById(userId);
    res.json({ success: true, message: 'تم تحديث الملف الشخصي', user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};