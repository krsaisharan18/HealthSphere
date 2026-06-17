import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { todayISO, uid } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

const TYPES = ["Running", "Walking", "Cycling", "Gym", "Yoga", "Swimming"];
const CAL_PER_MIN: Record<string, number> = { Running: 11, Walking: 4, Cycling: 8, Gym: 7, Yoga: 3, Swimming: 10 };

export const Route = createFileRoute("/workouts")({
  head: () => ({ meta: [{ title: "Workouts — Health Sphere" }, { name: "description", content: "Track workouts and calories." }] }),
  component: WorkoutPage,
});

function WorkoutPage() {
  const { data, setData } = useApp();
  const [type, setType] = useState("Running");
  const [duration, setDuration] = useState("30");
  const [date, setDate] = useState(todayISO());

  function add(e: React.FormEvent) {
    e.preventDefault();
    const dur = parseInt(duration); if (!dur) return;
    const cal = Math.round(CAL_PER_MIN[type] * dur);
    setData((d) => ({ ...d, workouts: [...d.workouts, { id: uid(), date, type, duration: dur, calories: cal }] }));
    toast.success(`${type} · ${dur} min · ${cal} kcal`);
  }

  const totalCal = data.workouts.reduce((s,w)=>s+w.calories,0);
  const totalMin = data.workouts.reduce((s,w)=>s+w.duration,0);

  return (
    <AppShell title="Workouts">
      <PageHeader title="Workout Tracker" description="Running, gym, yoga, cycling and more." />
      <div className="grid sm:grid-cols-3 gap-5 mb-5">
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total sessions</div><div className="text-3xl font-bold mt-1">{data.workouts.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total minutes</div><div className="text-3xl font-bold mt-1">{totalMin}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Calories burned</div><div className="text-3xl font-bold mt-1">{totalCal}</div></Card>
      </div>
      <Card className="p-5 mb-5">
        <div className="font-semibold mb-3">Log workout</div>
        <form onSubmit={add} className="grid sm:grid-cols-4 gap-3 items-end">
          <div><Label>Date</Label><Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} /></div>
          <div><Label>Type</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={type} onChange={(e)=>setType(e.target.value)}>
              {TYPES.map((t)=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div><Label>Duration (min)</Label><Input type="number" value={duration} onChange={(e)=>setDuration(e.target.value)} /></div>
          <Button type="submit">Add workout</Button>
        </form>
      </Card>
      <Card className="p-5">
        <div className="font-semibold mb-3">History</div>
        <div className="divide-y divide-border">
          {[...data.workouts].reverse().map((w) => (
            <div key={w.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{w.type} · {w.duration} min · {w.calories} kcal</div>
                <div className="text-xs text-muted-foreground">{w.date}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, workouts: d.workouts.filter((x) => x.id !== w.id) }))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          {data.workouts.length === 0 && <div className="text-sm text-muted-foreground">No workouts logged.</div>}
        </div>
      </Card>
    </AppShell>
  );
}