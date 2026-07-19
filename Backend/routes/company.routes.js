import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";
import {
  getMyCompany,
  updateMyCompany,
  getMyStats,
  getConnections,
  search,
} from "../controllers/company.controller.js";

const router = express.Router();

router.use(protect, authorize("company"));

router.get("/profile", getMyCompany);
router.put("/profile", updateMyCompany);
router.get("/stats", getMyStats);
router.get("/connections", getConnections);
router.get("/search", search);   // students + companies + internships

export default router;
