import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { MetricCard } from "@/components/MetricCard";
import { RingProgress } from "@/components/RingProgress";
import { ChartCard } from "@/components/ChartCard";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { healthScore, todayTotal, heartCategory, bpCategory } from "@/lib/health";
import {
  Activity, Apple, Droplet, Footprints, HeartPulse, Moon, Trophy, Bell
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid
} from "recharts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Health Sphere" }, { name: "description", content: "Your daily health summary." }] }),
  component: DashboardPage,
});

function DashboardPage() {
  const { data, user } = useApp();
  const score = healthScore(data);
  const stepsToday = todayTotal(data.steps);
  const waterToday = todayTotal(data.water);
  const lastHeart = data.heart[data.heart.length - 1]?.value ?? 0;
  const lastSleep = data.sleep[data.sleep.length - 1];
  const lastBP = data.bp[data.bp.length - 1];
  const todayCalories = data.foods.filter((f) => f.date === new Date().toISOString().slice(0,10)).reduce((s, f) => s + f.calories, 0);

  const stepsChart = data.steps.map((e) => ({ date: e.date.slice(5), value: e.value }));
  const waterChart = data.water.map((e) => ({ date: e.date.slice(5), value: e.value }));
  const sleepChart = data.sleep.map((e) => ({ date: e.date.slice(5), value: Number(e.hours.toFixed(1)) }));

  return (
    <AppShell title={`Hi, ${user?.name.split(" ")[0] ?? "there"} 👋`}>
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Health score */}
        <Card className="p-6 lg:col-span-1 flex flex-col items-center" style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-soft)" }}>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Health Score</div>
          <RingProgress value={score} size={200} stroke={16} sub="out of 100" />
          <div className="mt-4 text-sm text-muted-foreground text-center">
            {score >= 80 ? "Excellent — keep it up!" : score >= 60 ? "Good — small wins ahead." : "Let's improve your daily basics."}
          </div>
        </Card>

        {/* Summary cards */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-5">
          <MetricCard icon={Footprints} label="Steps Today" value={stepsToday.toLocaleString()} unit="steps" accent="primary" trend={`Goal 10,000 (${Math.round((stepsToday/10000)*100)}%)`} />
          <MetricCard icon={Droplet} label="Water" value={(waterToday/1000).toFixed(1)} unit="L" accent="secondary" trend="Goal 2.5L" />
          <MetricCard icon={HeartPulse} label="Heart Rate" value={lastHeart} unit="bpm" accent="danger" trend={heartCategory(lastHeart || 75).label} />
          <MetricCard icon={Moon} label="Sleep" value={lastSleep ? lastSleep.hours.toFixed(1) : "—"} unit="hrs" accent="secondary" trend={lastSleep ? `Quality ${lastSleep.quality}%` : "No data"} />
          <MetricCard icon={Activity} label="Blood Pressure" value={lastBP ? `${lastBP.systolic}/${lastBP.diastolic}` : "—"} unit="mmHg" accent="warn" trend={lastBP ? bpCategory(lastBP.systolic, lastBP.diastolic).label : "No data"} />
          <MetricCard icon={Apple} label="Calories" value={todayCalories} unit="kcal" accent="primary" trend="Today's intake" />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mt-5">
        <ChartCard title="Steps — 7 days" subtitle="Daily step count">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={stepsChart}>
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="value" stroke="var(--primary)" fill="url(#g1)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Water intake" subtitle="ml per day">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={waterChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="value" fill="var(--secondary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Sleep trend" subtitle="Hours per night">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={sleepChart}>
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area type="monotone" dataKey="value" stroke="var(--secondary)" fill="url(#g2)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card className="p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="font-semibold tracking-tight">Reminders</div>
              <div className="text-xs text-muted-foreground">Upcoming today</div>
            </div>
            <Link to="/notifications" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="space-y-2">
            {data.reminders.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Bell className="h-4 w-4 text-primary" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.title}</div>
                  <div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleString()}</div>
                </div>
              </div>
            ))}
            {data.reminders.length === 0 && <div className="text-sm text-muted-foreground">No reminders.</div>}
          </div>
          <div className="mt-4 p-4 rounded-lg flex items-center gap-3" style={{ background: "var(--gradient-primary)", color: "white" }}>
            <Trophy className="h-6 w-6" />
            <div>
              <div className="text-sm font-semibold">{data.xp} XP earned</div>
              <div className="text-xs opacity-90">Level {Math.floor(data.xp / 100) + 1} · keep going!</div>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}