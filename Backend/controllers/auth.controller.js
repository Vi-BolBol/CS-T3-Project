import { registerService, loginService, getSessionService } from "../services/auth.service.js";

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check empty input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const result = await registerService(req.body);

    if (!result.success) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginService(req.body);

    if (!result.success) {
      // A suspension is a permissions problem, not a bad request — 403 lets the
      // frontend tell it apart from "wrong password" without string-matching.
      return res.status(result.suspended ? 403 : 400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/**
 * GET /api/auth/session — re-validates the signed-in account against the DB.
 *
 * `protect` only checks the JWT signature, so a suspended or deleted user would
 * otherwise keep working until their token expired. The frontend calls this on
 * page load and before sensitive actions.
 */
export const session = async (req, res, next) => {
  try {
    return res.status(200).json(await getSessionService(req.user.id));
  } catch (err) { next(err); }
};
