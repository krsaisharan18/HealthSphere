export type Entry = { id: string; date: string; value: number; note?: string };
export type BPEntry = { id: string; date: string; systolic: number; diastolic: number; note?: string };
export type SleepEntry = { id: string; date: string; hours: number; quality: number };
export type WorkoutEntry = { id: string; date: string; type: string; duration: number; calories: number };
export type FoodEntry = { id: string; date: string; name: string; calories: number; meal: string };
export type Medication = { id: string; name: string; dosage: string; time: string; frequency: string; active: boolean };
export type Appointment = { id: string; doctor: string; hospital: string; date: string; time: string; notes?: string };
export type Report = { id: string; name: string; category: string; date: string; dataUrl?: string };
export type Goal = { id: string; type: string; target: number; period: "daily" | "weekly" | "monthly" };
export type Reminder = { id: string; title: string; date: string; type: string; read: boolean };

export const todayISO = () => new Date().toISOString().slice(0, 10);
export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export function bpCategory(s: number, d: number) {
  if (s < 120 && d < 80) return { label: "Normal", color: "oklch(0.62 0.16 165)" };
  if (s < 130 && d < 80) return { label: "Elevated", color: "oklch(0.7 0.18 80)" };
  if (s < 140 || d < 90) return { label: "Stage 1", color: "oklch(0.68 0.18 50)" };
  return { label: "Stage 2", color: "oklch(0.62 0.22 25)" };
}

export function heartCategory(bpm: number) {
  if (bpm < 60) return { label: "Low", color: "oklch(0.55 0.18 235)" };
  if (bpm <= 100) return { label: "Normal", color: "oklch(0.62 0.16 165)" };
  return { label: "High", color: "oklch(0.62 0.22 25)" };
}

export function bmiCategory(bmi: number) {
  if (bmi < 18.5) return { label: "Underweight", color: "oklch(0.55 0.18 235)" };
  if (bmi < 25) return { label: "Normal", color: "oklch(0.62 0.16 165)" };
  if (bmi < 30) return { label: "Overweight", color: "oklch(0.68 0.18 50)" };
  return { label: "Obese", color: "oklch(0.62 0.22 25)" };
}

export function sugarCategory(mgdl: number, fasting = true) {
  if (fasting) {
    if (mgdl < 70) return { label: "Low", color: "oklch(0.55 0.18 235)" };
    if (mgdl < 100) return { label: "Normal", color: "oklch(0.62 0.16 165)" };
    if (mgdl < 126) return { label: "Pre-diabetic", color: "oklch(0.68 0.18 50)" };
    return { label: "Diabetic", color: "oklch(0.62 0.22 25)" };
  }
  if (mgdl < 140) return { label: "Normal", color: "oklch(0.62 0.16 165)" };
  if (mgdl < 200) return { label: "Pre-diabetic", color: "oklch(0.68 0.18 50)" };
  return { label: "Diabetic", color: "oklch(0.62 0.22 25)" };
}

export type DataState = {
  steps: Entry[];
  heart: Entry[];
  bp: BPEntry[];
  sugar: (Entry & { type: "fasting" | "random" | "hba1c" })[];
  water: Entry[]; // value in ml
  sleep: SleepEntry[];
  workouts: WorkoutEntry[];
  foods: FoodEntry[];
  weight: Entry[];
  height: number; // cm
  medications: Medication[];
  appointments: Appointment[];
  reports: Report[];
  goals: Goal[];
  reminders: Reminder[];
  xp: number;
};

export const defaultData: DataState = {
  steps: seedSteps(),
  heart: seedHeart(),
  bp: seedBP(),
  sugar: [],
  water: seedWater(),
  sleep: seedSleep(),
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
    { id: uid(), title: "Drink a glass of water", date: new Date().toISOString(), type: "water", read: false },
    { id: uid(), title: "Evening walk reminder", date: new Date().toISOString(), type: "workout", read: false },
  ],
  xp: 240,
};

function seedSteps(): Entry[] {
  const arr: Entry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({ id: uid(), date: d.toISOString().slice(0, 10), value: 4000 + Math.floor(Math.random() * 7000) });
  }
  return arr;
}
function seedHeart(): Entry[] {
  const arr: Entry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({ id: uid(), date: d.toISOString().slice(0, 10), value: 65 + Math.floor(Math.random() * 25) });
  }
  return arr;
}
function seedBP(): BPEntry[] {
  const arr: BPEntry[] = [];
  for (let i = 4; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({
      id: uid(),
      date: d.toISOString().slice(0, 10),
      systolic: 110 + Math.floor(Math.random() * 20),
      diastolic: 70 + Math.floor(Math.random() * 15),
    });
  }
  return arr;
}
function seedWater(): Entry[] {
  const arr: Entry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({ id: uid(), date: d.toISOString().slice(0, 10), value: 1500 + Math.floor(Math.random() * 1500) });
  }
  return arr;
}
function seedSleep(): SleepEntry[] {
  const arr: SleepEntry[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    arr.push({
      id: uid(),
      date: d.toISOString().slice(0, 10),
      hours: 5 + Math.random() * 4,
      quality: 60 + Math.floor(Math.random() * 40),
    });
  }
  return arr;
}

export function todayTotal(entries: { date: string; value: number }[]) {
  const t = todayISO();
  return entries.filter((e) => e.date === t).reduce((sum, e) => sum + e.value, 0);
}

export function lastValue<T extends { value: number }>(entries: T[]): number {
  return entries.length ? entries[entries.length - 1].value : 0;
}

export function healthScore(d: DataState): number {
  const stepsToday = todayTotal(d.steps);
  const waterToday = todayTotal(d.water);
  const sleepEntry = d.sleep[d.sleep.length - 1];
  const heart = d.heart[d.heart.length - 1]?.value ?? 75;
  const bp = d.bp[d.bp.length - 1];
  const s = Math.min(100, (stepsToday / 10000) * 100) * 0.25
    + Math.min(100, (waterToday / 2500) * 100) * 0.2
    + Math.min(100, ((sleepEntry?.hours ?? 7) / 8) * 100) * 0.2
    + (heart >= 60 && heart <= 100 ? 100 : 60) * 0.15
    + (bp && bp.systolic < 130 && bp.diastolic < 85 ? 100 : 65) * 0.2;
  return Math.round(s);
}

export const foodDatabase: { name: string; calories: number }[] = [
  { name: "Roti (1 piece)", calories: 120 },
  { name: "Rice (1 cup)", calories: 200 },
  { name: "Dal (1 cup)", calories: 180 },
  { name: "Paneer (100g)", calories: 265 },
  { name: "Idli (2 pcs)", calories: 130 },
  { name: "Dosa (1)", calories: 168 },
  { name: "Chicken curry (1 cup)", calories: 280 },
  { name: "Apple", calories: 95 },
  { name: "Banana", calories: 105 },
  { name: "Egg (boiled)", calories: 78 },
  { name: "Milk (1 cup)", calories: 150 },
  { name: "Oats (1 cup)", calories: 154 },
  { name: "Salad bowl", calories: 90 },
  { name: "Burger", calories: 540 },
  { name: "Pizza slice", calories: 285 },
  { name: "Samosa", calories: 250 },
];

export const achievementsList = [
  { id: "steps10k", title: "10K Steps", desc: "Walk 10,000 steps in a day", check: (d: DataState) => d.steps.some((s) => s.value >= 10000) },
  { id: "hydration", title: "Hydration Master", desc: "Drink 2.5L in a day", check: (d: DataState) => d.water.some((w) => w.value >= 2500) },
  { id: "sleep", title: "Sleep Champion", desc: "Sleep 8+ hours", check: (d: DataState) => d.sleep.some((s) => s.hours >= 8) },
  { id: "fitness", title: "Fitness Warrior", desc: "Log 5 workouts", check: (d: DataState) => d.workouts.length >= 5 },
  { id: "streak", title: "Healthy Streak", desc: "Track water 7 days", check: (d: DataState) => d.water.length >= 7 },
  { id: "logger", title: "Diligent Logger", desc: "Log 10 foods", check: (d: DataState) => d.foods.length >= 10 },
];