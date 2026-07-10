import "dotenv/config";
import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import authRoutes from "../routes/auth.routes.js";
import cvRoutes from "../routes/cv.routes.js";
import internshipRoutes from "../routes/internship.routes.js";
import studentRoutes from "../routes/student.routes.js";

const prisma = new PrismaClient();
const app = express();
// Middleware
app.use(cors());
app.use(express.json({ limit: "22mb" }));
app.use(express.urlencoded({ extended: true, limit: "22mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/cv", cvRoutes);
app.use("/api/internships", internshipRoutes);
app.use("/api/student", studentRoutes);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Internship Finder API is running" });
});

app.get("/health", (req , res) => {
  res.json({ status: "ok" });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});