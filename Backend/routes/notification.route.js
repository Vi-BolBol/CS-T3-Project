import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getMyNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// Every notification route is scoped to the logged-in user.
router.use(protect);

router.get("/", getMyNotifications);
router.get("/unread", getUnreadNotifications);
router.get("/unread-count", getUnreadCount);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", markAsRead);

export default router;
