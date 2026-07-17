const Notification = require("../models/Notification");
const mongoose = require("mongoose");

// GET /notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name")
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// PUT /notifications/read
const markAsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body; // Array of IDs to mark as read

    if (notificationIds !== undefined && !Array.isArray(notificationIds)) {
      return res.status(400).json({ message: "notificationIds must be an array" });
    }

    if (notificationIds && notificationIds.length > 0) {
      const invalidId = notificationIds.find((id) => !mongoose.Types.ObjectId.isValid(id));
      if (invalidId) {
        return res.status(400).json({ message: "Invalid notification id" });
      }

      await Notification.updateMany(
        { _id: { $in: notificationIds }, recipient: req.user._id },
        { $set: { isRead: true } }
      );
    } else {
      // Mark all as read if no specific IDs provided
      await Notification.updateMany(
        { recipient: req.user._id, isRead: false },
        { $set: { isRead: true } }
      );
    }
    
    res.json({ message: "Notifications marked as read" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Helper function to create notification internally (e.g. from Socket or other controllers)
const createNotification = async (recipientId, senderId, type, content, relatedId) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      content,
      relatedId,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
  }
};

module.exports = { getNotifications, markAsRead, createNotification };
