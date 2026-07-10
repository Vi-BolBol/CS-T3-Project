import express from "express";
import { protect } from "../middleware/auth.middleware.js";
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

// Company-only routes — must come before "/:id" so "mine" isn't parsed as an id
router.get("/mine", protect, getMyInternships);
router.post("/", protect, publishInternship);
router.put("/:id", protect, updateInternshipController);
router.delete("/:id", protect, deleteInternshipController);

router.get("/:id", getInternship);

export default router;
