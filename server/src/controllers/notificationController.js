import Notification from "../models/Notification.js";
import { createNotification } from "../services/notificationService.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id })
    .populate("issueId", "title status")
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  res.json({
    success: true,
    unreadCount: notifications.filter((item) => !item.isRead).length,
    notifications
  });
});

export const createNotificationEntry = asyncHandler(async (req, res) => {
  const { message, issueId } = req.body;
  if (!message?.trim()) {
    throw new AppError("Notification message is required.", 400);
  }

  const notification = await createNotification({
    userId: req.user._id,
    message: message.trim(),
    issueId: issueId || null
  });

  res.status(201).json({
    success: true,
    notification
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { isRead: true },
    { new: true }
  ).lean();

  if (!notification) {
    throw new AppError("Notification not found.", 404);
  }

  res.json({
    success: true,
    notification
  });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });

  res.json({
    success: true,
    message: "All notifications marked as read."
  });
});
