import express from "express";
import { protect, optionalAuth } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  publishInternship,
  getMyInternships,
  getPublicInternships,
  getInternship,
  updateInternshipController,
  deleteInternshipController,
} from "../controllers/internship.controller.js";

const router = express.Router();

// Public browsing (student side)
router.get("/", getPublicInternships);

// Company-only routes — must come before "/:id" so "mine" isn't parsed as an id.
// protect = authenticated; authorize("company") = correct role (403 otherwise).
router.get("/mine", protect, authorize("company"), getMyInternships);
router.post("/", protect, authorize("company"), publishInternship);
router.put("/:id", protect, authorize("company"), updateInternshipController);
router.delete("/:id", protect, authorize("company"), deleteInternshipController);

router.get("/:id", optionalAuth, getInternship);   // public, but the owner sees more

export default router;
