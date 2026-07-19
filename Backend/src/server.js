import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

import authRoutes from "../routes/auth.routes.js";
import cvRoutes from "../routes/cv.routes.js";
import internshipRoutes from "../routes/internship.routes.js";
import studentRoutes from "../routes/student.routes.js";
import applicationRoutes from "../routes/application.routes.js";
import adminRoutes from "../routes/admin.routes.js";
import companyRoutes from "../routes/company.routes.js";
import publicRoutes from "../routes/public.routes.js";
import notificationRoutes from "../routes/notification.route.js";
import { notFound, errorHandler } from "../middleware/error.middleware.js";
import { startInternshipDeadlineJob } from "../jobs/internshipDeadline.job.js";

const prisma = new PrismaClient();
const app = express();

/* ---------- Middleware pipeline (order matters) ---------- */
app.use(helmet());                       // security headers

/*
  CORS allowlist.

  Note: CLIENT_URL must be the FRONTEND origin (Vite = 5173), not the backend's
  own port. The README shipped with CLIENT_URL=http://localhost:3000, which is
  the API itself — that blocks the real frontend. We allow the Vite dev origins
  by default and merge in CLIENT_URL only if it's set to something sensible.
*/
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5175",
  "http://localhost:5176",
  "http://127.0.0.1:5176",
];

const allowedOrigins = [
  ...defaultOrigins,
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(
  cors({
    origin(origin, callback) {
      // Allow same-origin/non-browser callers (Postman, curl, SSR) which send no Origin.
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} is not allowed`));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "22mb" }));
app.use(express.urlencoded({ extended: true, limit: "22mb" }));
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

/* ---------- Rate limiting ---------- */
// Brute-force protection on credentials.
const authLimiter = rateLimit({
  windowMs: 60 * 1000,                   // 60-second window
  max: 10,                               // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  // Only credential POSTs are brute-forceable. GET /api/auth/session is polled
  // on every page load, so limiting it would lock out a normal browsing session.
  skip: (req) => req.method === "GET",
  message: { success: false, message: "Too many attempts. Try again in a minute." },
});

// The CV routes call paid AI APIs — cap them separately.
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,              // 1 hour
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "AI request limit reached. Try again later." },
});

/* ---------- Routes ---------- */
app.get("/", (req, res) => res.json({ message: "Internship Finder API is running" }));
app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/cv", aiLimiter, cvRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/public", publicRoutes);   // logged-out browsing: companies + unified search
app.use("/api/notifications", notificationRoutes);

/* ---------- Error handling (must come last) ---------- */
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  startInternshipDeadlineJob();
});

/* ---------- Graceful shutdown ---------- */
const shutdown = async () => {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default app;
