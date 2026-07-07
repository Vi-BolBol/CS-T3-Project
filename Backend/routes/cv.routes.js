import express from "express";
import { generatePhoto, scoreCv, parseUploadedCv } from "../controllers/cv.controller.js";

const router = express.Router();

router.post("/generate-photo", generatePhoto);
router.post("/score", scoreCv);
router.post("/parse-upload", parseUploadedCv);

export default router;
