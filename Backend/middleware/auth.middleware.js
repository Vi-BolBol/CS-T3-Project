import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token"
        });
    }
};

/**
 * Like `protect`, but never rejects.
 *
 * For routes that are public but behave differently for a signed-in user —
 * GET /api/internships/:id, where an anonymous visitor must not see a draft
 * listing, but the company that owns it must. A bad or missing token simply
 * leaves `req.user` undefined; it does not 401.
 *
 * Never use this to guard anything. It is not a guard.
 */
export const optionalAuth = (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            req.user = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
        } catch {
            // Expired or forged — treat as anonymous rather than failing the request.
        }
    }

    next();
};
