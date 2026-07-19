import express from "express";
import { protect, enforceStatus } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  saveInternship,
  unsaveInternship,
  getSavedInternships,
  followCompany,
  unfollowCompany,
  getFollowedCompanies,
  getRecommendedInternships,
  getMyProfile,
  updateMyProfile,
  getStudentProfileById,
} from "../controllers/student.controller.js";

const router = express.Router();

/*
  Reading ANOTHER student's profile is declared before the student-only guard.

  A company reviewing an applicant and an admin inspecting an account both need
  this route, so restricting the whole router to `student` would lock out the
  two roles that need it most. It keeps `protect`, so it is never public.
*/
router.get(
  "/profile/:id",
  protect,
  authorize("student", "company", "admin"),
  getStudentProfileById
);

// Everything below is the signed-in student acting on their own data.
router.use(protect, authorize("student"));

router.get("/profile", getMyProfile);
router.put("/profile", enforceStatus, updateMyProfile);

router.get("/saved-internships", getSavedInternships);
router.post("/saved-internships/:internshipId", saveInternship);
router.delete("/saved-internships/:internshipId", unsaveInternship);

router.get("/followed-companies", getFollowedCompanies);
router.post("/followed-companies/:companyId", followCompany);
router.delete("/followed-companies/:companyId", unfollowCompany);

router.get("/recommended-internships", getRecommendedInternships);

export default router;
