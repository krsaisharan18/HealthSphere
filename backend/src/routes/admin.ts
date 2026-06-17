import { Router, type Response } from "express";
import { User } from "../models/User.js";
import { HealthData } from "../models/HealthData.js";
import {
  authenticate,
  requireAdmin,
  type AuthRequest,
} from "../middleware/auth.js";

const router = Router();

// All admin routes require auth + admin role
router.use(authenticate, requireAdmin);

// ── GET /api/admin/users ──────────────────────────────────────────────────────
router.get("/users", async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/admin/users/:id ───────────────────────────────────────────────
router.delete(
  "/users/:id",
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      await User.findByIdAndDelete(req.params.id);
      await HealthData.findOneAndDelete({ userId: req.params.id });
      res.json({ message: "User deleted" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ── GET /api/admin/stats ──────────────────────────────────────────────────────
router.get("/stats", async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await User.countDocuments();
    const adminUsers = await User.countDocuments({ role: "admin" });
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({ totalUsers, adminUsers, recentUsers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
