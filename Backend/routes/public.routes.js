import express from "express";
import { listCompanies, getCompany, search } from "../controllers/public.controller.js";

/**
 * Deliberately unauthenticated — this is the logged-out browsing surface.
 * Everything here is read-only and exposes no personal data. Applying still
 * requires a student token (POST /api/applications is protect-ed), which is
 * what the frontend's apply-gate relies on.
 */
const router = express.Router();

router.get("/companies", listCompanies);
router.get("/companies/:id", getCompany);
router.get("/search", search);   // internships + companies

export default router;
