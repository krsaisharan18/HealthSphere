import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import healthRoutes from "./routes/health.js";
import adminRoutes from "./routes/admin.js";

const app = express();
const PORT = process.env.PORT ?? 5000;
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" })); // allow large health data payloads

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/admin", adminRoutes);

// Health check endpoint
app.get("/api/ping", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Health Sphere API running on http://localhost:${PORT}`);
    console.log(`📋 Endpoints:`);
    console.log(`   POST /api/auth/signup`);
    console.log(`   POST /api/auth/login`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   PATCH /api/auth/profile`);
    console.log(`   POST /api/auth/change-password`);
    console.log(`   GET  /api/health`);
    console.log(`   PUT  /api/health`);
    console.log(`   DELETE /api/health`);
    console.log(`   GET  /api/admin/users`);
    console.log(`   GET  /api/admin/stats`);
  });
});
