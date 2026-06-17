import mongoose, { type Document, Schema } from "mongoose";

// ── Sub-document schemas ──────────────────────────────────────────────────────

const EntrySchema = new Schema(
  {
    id: String,
    date: String,
    value: Number,
    note: String,
  },
  { _id: false }
);

const BPEntrySchema = new Schema(
  {
    id: String,
    date: String,
    systolic: Number,
    diastolic: Number,
    note: String,
  },
  { _id: false }
);

const SleepEntrySchema = new Schema(
  {
    id: String,
    date: String,
    hours: Number,
    quality: Number,
  },
  { _id: false }
);

const WorkoutEntrySchema = new Schema(
  {
    id: String,
    date: String,
    type: String,
    duration: Number,
    calories: Number,
  },
  { _id: false }
);

const FoodEntrySchema = new Schema(
  {
    id: String,
    date: String,
    name: String,
    calories: Number,
    meal: String,
  },
  { _id: false }
);

const MedicationSchema = new Schema(
  {
    id: String,
    name: String,
    dosage: String,
    time: String,
    frequency: String,
    active: Boolean,
  },
  { _id: false }
);

const AppointmentSchema = new Schema(
  {
    id: String,
    doctor: String,
    hospital: String,
    date: String,
    time: String,
    notes: String,
  },
  { _id: false }
);

const ReportSchema = new Schema(
  {
    id: String,
    name: String,
    category: String,
    date: String,
    dataUrl: String,
  },
  { _id: false }
);

const GoalSchema = new Schema(
  {
    id: String,
    type: String,
    target: Number,
    period: { type: String, enum: ["daily", "weekly", "monthly"] },
  },
  { _id: false }
);

const ReminderSchema = new Schema(
  {
    id: String,
    title: String,
    date: String,
    type: String,
    read: Boolean,
  },
  { _id: false }
);

const SugarEntrySchema = new Schema(
  {
    id: String,
    date: String,
    value: Number,
    note: String,
    type: { type: String, enum: ["fasting", "random", "hba1c"] },
  },
  { _id: false }
);

// ── Main document ─────────────────────────────────────────────────────────────

export interface IHealthData extends Document {
  userId: mongoose.Types.ObjectId;
  steps: typeof EntrySchema[];
  heart: typeof EntrySchema[];
  bp: typeof BPEntrySchema[];
  sugar: typeof SugarEntrySchema[];
  water: typeof EntrySchema[];
  sleep: typeof SleepEntrySchema[];
  workouts: typeof WorkoutEntrySchema[];
  foods: typeof FoodEntrySchema[];
  weight: typeof EntrySchema[];
  height: number;
  medications: typeof MedicationSchema[];
  appointments: typeof AppointmentSchema[];
  reports: typeof ReportSchema[];
  goals: typeof GoalSchema[];
  reminders: typeof ReminderSchema[];
  xp: number;
  updatedAt: Date;
}

const HealthDataSchema = new Schema<IHealthData>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    steps: [EntrySchema],
    heart: [EntrySchema],
    bp: [BPEntrySchema],
    sugar: [SugarEntrySchema],
    water: [EntrySchema],
    sleep: [SleepEntrySchema],
    workouts: [WorkoutEntrySchema],
    foods: [FoodEntrySchema],
    weight: [EntrySchema],
    height: { type: Number, default: 170 },
    medications: [MedicationSchema],
    appointments: [AppointmentSchema],
    reports: [ReportSchema],
    goals: [GoalSchema],
    reminders: [ReminderSchema],
    xp: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const HealthData = mongoose.model<IHealthData>(
  "HealthData",
  HealthDataSchema
);
