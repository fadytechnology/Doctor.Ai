const Notification = require('../models/Notification');
const ActivityLog = require('../models/ActivityLog');
exports.sendNotification = async (req, res) => {
  try {
    const { userId, title, message, link } = req.body;
    await Notification.create(userId, title, message, link);
    await ActivityLog.create(req.userId, 'إرسال إشعار', 'admin', 'إلى المستخدم ' + userId);
    res.json({ success: true, message: 'تم إرسال الإشعار' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.getByUser(req.userId);
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.markRead = async (req, res) => {
  try {
    await Notification.markRead(req.params.id);
    res.json({ success: true, message: 'تم تحديث الإشعار' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};