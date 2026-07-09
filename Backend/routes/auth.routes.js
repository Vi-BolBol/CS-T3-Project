import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/role.middleware.js";

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", protect, (req, res) => {
    res.json(req.user);
});

// Admin only
router.get(
    "/admin",
    protect,
    authorize("ADMIN"),
    (req, res) => {
        res.json({ message: "Welcome Admin" });
    }
);

export default router;