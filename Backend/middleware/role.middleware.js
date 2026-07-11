/**
 * Role-based authorization. Runs AFTER `protect`, which populates req.user.
 *
 * Note: this only works because the JWT now carries `role`. It previously did
 * not, so req.user.role was always undefined and every check here would 403.
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Defensive: authorize() must never run before protect().
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.user.role) {
      return res.status(403).json({
        success: false,
        message: "Access denied: token carries no role. Please log in again.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: requires role ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

export default { authorize };
