import {
  saveInternshipService,
  unsaveInternshipService,
  listSavedInternshipsService,
  followCompanyService,
  unfollowCompanyService,
  listFollowedCompaniesService,
  listRecommendedInternshipsService,
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
