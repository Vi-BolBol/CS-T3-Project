import { Router } from "express";
import { register, login, session } from "../controllers/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// Re-validates the signed-in account against the database. This is what makes a
// suspension or deletion take effect without waiting for the JWT to expire.
router.get("/session", protect, session);

export default router;
