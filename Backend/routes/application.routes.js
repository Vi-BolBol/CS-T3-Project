import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import {
  applyToInternship,
  getApplicantsForInternship,
  getMyApplications,
  getApplicationDetail,
  updateApplicationStatusController,
} from "../controllers/application.controller.js";

const router = express.Router();

// Student routes
router.post("/", verifyToken, applyToInternship);
router.get("/mine", verifyToken, getMyApplications);

// Company routes
router.get("/internship/:internshipId", verifyToken, getApplicantsForInternship);
router.get("/:id", verifyToken, getApplicationDetail);
router.patch("/:id/status", verifyToken, updateApplicationStatusController);

export default router;
