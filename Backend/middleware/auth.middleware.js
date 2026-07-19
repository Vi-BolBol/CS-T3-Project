import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

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

/**
 * Re-reads the account status from the database and refuses the request if the
 * user has been suspended or deleted since their token was issued.
 *
 * `protect` deliberately does NOT do this — a DB round trip on every single
 * request is a real cost. Instead this runs only on sensitive actions (applying,
 * posting a listing, deciding an application, saving a CV), which together with
 * the page-load session check means a suspension bites within one navigation
 * rather than waiting out the token's full lifetime.
 *
 * Always mount AFTER `protect`.
 */
export const enforceStatus = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(req.user.id) },
            select: { id: true, status: true, suspendedUntil: true, suspensionReason: true },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                reason: "deleted",
                message: "This account no longer exists.",
            });
        }

        if (user.status === "suspended") {
            // A timed suspension that has run its course should not keep blocking.
            if (user.suspendedUntil && new Date(user.suspendedUntil) <= new Date()) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: { status: "active", suspendedAt: null, suspendedUntil: null, suspensionReason: null },
                });
                return next();
            }
            return res.status(403).json({
                success: false,
                reason: "suspended",
                message: "Your account is suspended.",
                suspension: { reason: user.suspensionReason || null, until: user.suspendedUntil || null },
            });
        }

        if (user.status === "inactive") {
            return res.status(403).json({
                success: false,
                reason: "inactive",
                message: "This account is inactive.",
            });
        }

        return next();
    } catch (err) {
        return next(err);
    }
};
