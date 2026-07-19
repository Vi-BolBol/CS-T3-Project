import express from "express";
import { protect, enforceStatus } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getAuditLogs,
  getSuspicious,
  getUserDetail,
  getUserActivity,
  getUserInternships,
  getUserCv,
  moderateInternship,
  getInternshipDetail,
  deleteInternship,
} from "../controllers/admin.controller.js";

const router = express.Router();

// EVERY admin route is admin-only. This only works because the JWT now carries
// `role` (Session A) — before that, req.user.role was undefined and this would
// have 403'd everyone.
//
// `enforceStatus` re-reads the account from the DB: an admin whose own account
// was revoked must not keep moderating on a token that has not expired yet.
router.use(protect, authorize("admin"), enforceStatus);

router.get("/stats", getStats);
router.get("/suspicious", getSuspicious);
router.get("/audit-logs", getAuditLogs);

router.get("/users", getUsers);
router.get("/users/:id", getUserDetail);
router.get("/users/:id/activity", getUserActivity);
router.get("/users/:id/internships", getUserInternships);   // company accounts
router.get("/users/:id/cv", getUserCv);                     // student accounts
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

// Moderating an individual listing without touching the whole company account.
router.get("/internships/:id", getInternshipDetail);   // full listing + applicants
router.patch("/internships/:id/status", moderateInternship);
router.delete("/internships/:id", deleteInternship);

export default router;
