import express from "express";
import { generatePhoto, scoreCv, parseUploadedCv } from "../controllers/cv.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protected routes - require authentication
router.post("/generate-photo", protect, generatePhoto);
router.post("/score", protect, scoreCv);
router.post("/parse-upload", protect, parseUploadedCv);

export default router;
