import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  saveInternship,
  unsaveInternship,
  getSavedInternships,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  getRecommendedInternships,
} from "../controllers/student.controller.js";

const router = express.Router();

// All student routes require a logged-in user with the student role
router.use(protect, authorize("student"));

router.get("/saved-internships", getSavedInternships);
router.post("/saved-internships/:internshipId", saveInternship);
router.delete("/saved-internships/:internshipId", unsaveInternship);

router.get("/followed-companies", getFollowedCompanies);
router.post("/followed-companies/:companyId", followCompany);
router.delete("/followed-companies/:companyId", unfollowCompany);

router.get("/recommended-internships", getRecommendedInternships);

export default router;
