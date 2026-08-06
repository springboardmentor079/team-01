const Notification = require("../models/Notification");

exports.getMyNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      userId: req.user?.id,
    }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user?.id },
      { isRead: true },
      { new: true },
    );
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json(notification);
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user?.id, isRead: false },
      { isRead: true },
    );
    res.json({ message: "All notifications marked as read" });
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      userId: req.user?.id,
    });
    if (!notification)
      return res.status(404).json({ message: "Notification not found" });
    res.json({ message: "Notification deleted" });
  } catch (err) {
    next(err);
  }
};
