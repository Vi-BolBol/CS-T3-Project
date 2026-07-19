import {
  saveInternshipService,
  unsaveInternshipService,
  listSavedInternshipsService,
  followCompanyService,
  unfollowCompanyService,
  listFollowedCompaniesService,
  listRecommendedInternshipsService,
  getMyProfileService,
  updateMyProfileService,
  getPublicStudentProfileService,
} from "../services/student.service.js";

// ── Saved Internships ──────────────────────────────────────────────

export const saveInternship = async (req, res) => {
  try {
    const internshipId = Number(req.params.internshipId);
    const result = await saveInternshipService(req.user.id, internshipId);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Save internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unsaveInternship = async (req, res) => {
  try {
    const internshipId = Number(req.params.internshipId);
    const result = await unsaveInternshipService(req.user.id, internshipId);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Unsave internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getSavedInternships = async (req, res) => {
  try {
    const result = await listSavedInternshipsService(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List saved internships error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Followed Companies ─────────────────────────────────────────────

export const followCompany = async (req, res) => {
  try {
    const companyId = Number(req.params.companyId);
    const result = await followCompanyService(req.user.id, companyId);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Follow company error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const unfollowCompany = async (req, res) => {
  try {
    const companyId = Number(req.params.companyId);
    const result = await unfollowCompanyService(req.user.id, companyId);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Unfollow company error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getFollowedCompanies = async (req, res) => {
  try {
    const result = await listFollowedCompaniesService(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List followed companies error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ── Recommendations ────────────────────────────────────────────────

export const getRecommendedInternships = async (req, res) => {
  try {
    const result = await listRecommendedInternshipsService(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List recommended internships error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------- Student profile ---------- */

export const getMyProfile = async (req, res, next) => {
  try { return res.status(200).json(await getMyProfileService(req.user.id)); }
  catch (err) { next(err); }
};

export const updateMyProfile = async (req, res, next) => {
  try {
    const result = await updateMyProfileService(req.user.id, req.body);
    return res.status(result.success ? 200 : 400).json(result);
  } catch (err) { next(err); }
};

/** Read another student's profile — company reviewing an applicant, or admin. */
export const getStudentProfileById = async (req, res, next) => {
  try {
    const result = await getPublicStudentProfileService(req.params.id, req.user.role);
    return res.status(result.success ? 200 : 404).json(result);
  } catch (err) { next(err); }
};
