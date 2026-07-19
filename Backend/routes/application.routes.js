import express from "express";
import { protect, enforceStatus } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  apply,
  getMyApplications,
  withdrawApplication,
  getInternshipApplicants,
  getCompanyApplications,
  decideApplication,
  getMyAlerts,
  markSeen,
} from "../controllers/application.controller.js";

const router = express.Router();

/* Student
   `enforceStatus` on the mutations only: reads stay cheap, but a suspended
   student cannot apply or withdraw on a token issued before the suspension. */
router.post("/", protect, authorize("student"), enforceStatus, apply);
router.get("/mine", protect, authorize("student"), getMyApplications);
router.get("/alerts", protect, authorize("student"), getMyAlerts);
router.patch("/seen", protect, authorize("student"), markSeen);
router.delete("/:id", protect, authorize("student"), enforceStatus, withdrawApplication);

/* Company */
router.get("/company", protect, authorize("company"), getCompanyApplications);
router.get("/internship/:internshipId", protect, authorize("company"), getInternshipApplicants);
router.patch("/:id/status", protect, authorize("company"), enforceStatus, decideApplication);

export default router;
