import { Router, type Response } from "express";
import { HealthData } from "../models/HealthData.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// All health routes require authentication
router.use(authenticate);

// ── GET /api/health ───────────────────────────────────────────────────────────
// Get the current user's full health data
router.get("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let healthData = await HealthData.findOne({ userId: req.userId });
    if (!healthData) {
      // Create a blank record if somehow missing
      healthData = await HealthData.create({ userId: req.userId });
    }
    res.json(healthData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/health ───────────────────────────────────────────────────────────
// Replace the full health data (sync from client)
router.put("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const update = req.body;
    // Strip fields that shouldn't be overwritten
    delete update._id;
    delete update.userId;
    delete update.__v;

    const healthData = await HealthData.findOneAndUpdate(
      { userId: req.userId },
      { $set: update },
      { new: true, upsert: true, runValidators: false }
    );
    res.json(healthData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── PATCH /api/health ─────────────────────────────────────────────────────────
// Partially update health data (e.g. push a new entry to one array)
router.patch("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const patch = req.body;
    delete patch._id;
    delete patch.userId;
    delete patch.__v;

    const healthData = await HealthData.findOneAndUpdate(
      { userId: req.userId },
      { $set: patch },
      { new: true, upsert: true }
    );
    res.json(healthData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/health ────────────────────────────────────────────────────────
// Reset health data to empty defaults
router.delete("/", async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await HealthData.findOneAndUpdate(
      { userId: req.userId },
      {
        $set: {
          steps: [],
          heart: [],
          bp: [],
          sugar: [],
          water: [],
          sleep: [],
          workouts: [],
          foods: [],
          weight: [],
          height: 170,
          medications: [],
          appointments: [],
          reports: [],
          goals: [],
          reminders: [],
          xp: 0,
        },
      },
      { upsert: true }
    );
    res.json({ message: "Health data reset" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
