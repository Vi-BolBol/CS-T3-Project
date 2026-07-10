import {
  applyToInternshipService,
  listApplicantsForInternshipService,
  listMyApplicationsService,
  updateApplicationStatusService,
  getApplicationForCompanyService,
} from "../services/application.service.js";

export const applyToInternship = async (req, res) => {
  try {
    const internshipId = Number(req.body.internshipId);
    if (Number.isNaN(internshipId)) {
      return res.status(400).json({ success: false, message: "Invalid internship id" });
    }

    const result = await applyToInternshipService(req.user.id, internshipId, req.body.cvId || null);
    if (!result.success) return res.status(400).json(result);
    return res.status(201).json(result);
  } catch (error) {
    console.error("Apply to internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApplicantsForInternship = async (req, res) => {
  try {
    const internshipId = Number(req.params.internshipId);
    if (Number.isNaN(internshipId)) {
      return res.status(400).json({ success: false, message: "Invalid internship id" });
    }

    const result = await listApplicantsForInternshipService(req.user.id, internshipId);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List applicants error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    const result = await listMyApplicationsService(req.user.id);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List my applications error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getApplicationDetail = async (req, res) => {
  try {
    const applicationId = Number(req.params.id);
    if (Number.isNaN(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const result = await getApplicationForCompanyService(req.user.id, applicationId);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Get application detail error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateApplicationStatusController = async (req, res) => {
  try {
    const applicationId = Number(req.params.id);
    if (Number.isNaN(applicationId)) {
      return res.status(400).json({ success: false, message: "Invalid application id" });
    }

    const result = await updateApplicationStatusService(req.user.id, applicationId, req.body.status);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
