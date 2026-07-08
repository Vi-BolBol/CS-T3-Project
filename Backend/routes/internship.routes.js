import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
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
router.get("/mine", verifyToken, getMyInternships);
router.post("/", verifyToken, publishInternship);
router.put("/:id", verifyToken, updateInternshipController);
router.delete("/:id", verifyToken, deleteInternshipController);

router.get("/:id", getInternship);

export default router;
