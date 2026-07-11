import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAuditLogs,
  getSuspicious,
} from "../controllers/admin.controller.js";

const router = express.Router();

// EVERY admin route is admin-only. This only works because the JWT now carries
// `role` (Session A) — before that, req.user.role was undefined and this would
// have 403'd everyone.
router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);
router.get("/audit-logs", getAuditLogs);
router.get("/suspicious", getSuspicious);

export default router;
