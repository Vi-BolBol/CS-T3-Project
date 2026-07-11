import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  apply,
  getMyApplications,
  withdrawApplication,
  getInternshipApplicants,
  getCompanyApplications,
  decideApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

/* Student */
router.post("/", protect, authorize("student"), apply);
router.get("/mine", protect, authorize("student"), getMyApplications);
router.delete("/:id", protect, authorize("student"), withdrawApplication);

/* Company */
router.get("/company", protect, authorize("company"), getCompanyApplications);
router.get("/internship/:internshipId", protect, authorize("company"), getInternshipApplicants);
router.patch("/:id/status", protect, authorize("company"), decideApplication);

export default router;
