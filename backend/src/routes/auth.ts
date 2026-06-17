import { Router, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { HealthData } from "../models/HealthData.js";
import { authenticate, type AuthRequest } from "../middleware/auth.js";

const router = Router();

// Helper to generate JWT
function signToken(userId: string, role: string): string {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
}

// Helper to create default health data for new users
function defaultHealthData() {
  const uid = () =>
    Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  const todayISO = () => new Date().toISOString().slice(0, 10);

  const steps = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      id: uid(),
      date: d.toISOString().slice(0, 10),
      value: 4000 + Math.floor(Math.random() * 7000),
    };
  });

  const heart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      id: uid(),
      date: d.toISOString().slice(0, 10),
      value: 65 + Math.floor(Math.random() * 25),
    };
  });

  const bp = Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (4 - i));
    return {
      id: uid(),
      date: d.toISOString().slice(0, 10),
      systolic: 110 + Math.floor(Math.random() * 20),
      diastolic: 70 + Math.floor(Math.random() * 15),
    };
  });

  const water = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      id: uid(),
      date: d.toISOString().slice(0, 10),
      value: 1500 + Math.floor(Math.random() * 1500),
    };
  });

  const sleep = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      id: uid(),
      date: d.toISOString().slice(0, 10),
      hours: 5 + Math.random() * 4,
      quality: 60 + Math.floor(Math.random() * 40),
    };
  });

  return {
    steps,
    heart,
    bp,
    sugar: [],
    water,
    sleep,
    workouts: [],
    foods: [],
    weight: [{ id: uid(), date: todayISO(), value: 70 }],
    height: 170,
    medications: [],
    appointments: [],
    reports: [],
    goals: [
      { id: uid(), type: "steps", target: 10000, period: "daily" },
      { id: uid(), type: "water", target: 2500, period: "daily" },
      { id: uid(), type: "sleep", target: 8, period: "daily" },
    ],
    reminders: [
      {
        id: uid(),
        title: "Drink a glass of water",
        date: new Date().toISOString(),
        type: "water",
        read: false,
      },
      {
        id: uid(),
        title: "Evening walk reminder",
        date: new Date().toISOString(),
        type: "workout",
        read: false,
      },
    ],
    xp: 240,
  };
}

// ── POST /api/auth/signup ─────────────────────────────────────────────────────
router.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone, gender, dob } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      res.status(400).json({ message: "Name, email and password are required" });
      return;
    }
    if (password.length < 6) {
      res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
      return;
    }

    // Check if email already exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      res.status(409).json({ message: "That email is already registered" });
      return;
    }

    // Determine role: if email contains "admin" → admin, else user
    const role = email.toLowerCase().includes("admin") ? "admin" : "user";

    // Create user (password gets hashed by pre-save hook in model)
    const user = await User.create({ name, email, password, phone, gender, dob, role });

    // Create default health data for this user
    await HealthData.create({ userId: user._id, ...defaultHealthData() });

    const token = signToken(user._id.toString(), user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        role: user.role,
      },
    });
  } catch (err: unknown) {
    const error = err as Error & { code?: number };
    // Mongoose duplicate key
    if (error.code === 11000) {
      res.status(409).json({ message: "That email is already registered" });
      return;
    }
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error during signup" });
  }
});

// ── POST /api/auth/login ──────────────────────────────────────────────────────
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    // Demo user shortcut
    if (email === "demo@health.app" && password === "demo1234") {
      const token = signToken("demo", "user");
      res.json({
        token,
        user: {
          id: "demo",
          name: "Demo User",
          email: "demo@health.app",
          role: "user",
        },
      });
      return;
    }

    // Find user with password field included
    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password");

    if (!user) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid email or password" });
      return;
    }

    const token = signToken(user._id.toString(), user.role);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
});

// ── GET /api/auth/me ──────────────────────────────────────────────────────────
router.get(
  "/me",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ── PATCH /api/auth/profile ───────────────────────────────────────────────────
router.patch(
  "/profile",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { name, phone, gender, dob, avatar } = req.body;
      const user = await User.findByIdAndUpdate(
        req.userId,
        { $set: { name, phone, gender, dob, avatar } },
        { new: true, runValidators: true }
      );
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dob: user.dob,
        avatar: user.avatar,
        role: user.role,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ── POST /api/auth/change-password ───────────────────────────────────────────
router.post(
  "/change-password",
  authenticate,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res
          .status(400)
          .json({ message: "Current and new password are required" });
        return;
      }
      if (newPassword.length < 6) {
        res
          .status(400)
          .json({ message: "New password must be at least 6 characters" });
        return;
      }

      const user = await User.findById(req.userId).select("+password");
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        res.status(401).json({ message: "Current password is incorrect" });
        return;
      }

      user.password = newPassword; // pre-save hook re-hashes
      await user.save();

      res.json({ message: "Password changed successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
