import {
  publishInternshipService,
  listCompanyInternshipsService,
  listPublicInternshipsService,
  getInternshipService,
  updateInternshipService,
  deleteInternshipService,
} from "../services/internship.service.js";

export const publishInternship = async (req, res) => {
  try {
    const result = await publishInternshipService(req.user.id, req.body);

    if (!result.success) {
      return res.status(result.errors ? 422 : 400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Publish internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getMyInternships = async (req, res) => {
  try {
    const result = await listCompanyInternshipsService(req.user.id);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List company internships error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPublicInternships = async (req, res) => {
  try {
    const result = await listPublicInternshipsService(req.query);
    return res.status(200).json(result);
  } catch (error) {
    console.error("List public internships error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getInternship = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "Invalid internship id" });

    const result = await getInternshipService(id, req.user || null);
    if (!result.success) return res.status(404).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Get internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateInternshipController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "Invalid internship id" });

    const result = await updateInternshipService(req.user.id, id, req.body);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Update internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteInternshipController = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json({ success: false, message: "Invalid internship id" });

    const result = await deleteInternshipService(req.user.id, id);
    if (!result.success) return res.status(400).json(result);
    return res.status(200).json(result);
  } catch (error) {
    console.error("Delete internship error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
