import express from "express";
import {
  createNotificationEntry,
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").get(protect, getNotifications).post(protect, createNotificationEntry);
router.patch("/read-all", protect, markAllNotificationsRead);
router.patch("/:id/read", protect, markNotificationRead);

export default router;

