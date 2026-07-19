import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import { generatePhoto, scoreCv, parseUploadedCv } from "../controllers/cv.controller.js";
import { saveCv, getMyCv, deleteMyCv } from "../controllers/cvStore.controller.js";

const router = express.Router();

/* Persistence — the Cv model finally has routes. */
router.post("/", protect, authorize("student"), saveCv);
router.get("/mine", protect, authorize("student"), getMyCv);
router.delete("/mine", protect, authorize("student"), deleteMyCv);

/* AI features. These call paid APIs (Gemini / HuggingFace) — previously they had
   no auth at all, so anyone could loop them and drain the quota. */
router.post("/generate-photo", protect, generatePhoto);
router.post("/score", protect, scoreCv);
router.post("/parse-upload", protect, parseUploadedCv);

export default router;
