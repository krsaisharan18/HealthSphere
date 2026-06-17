import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/AppContext";
import { todayTotal, uid } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

export const Route = createFileRoute("/goals")({
  head: () => ({ meta: [{ title: "Goals — Health Sphere" }, { name: "description", content: "Set and track health goals." }] }),
  component: GoalsPage,
});

function GoalsPage() {
  const { data, setData } = useApp();
  const [form, setForm] = useState({ type: "steps", target: "10000", period: "daily" as const });

  const progress = (type: string, target: number) => {
    if (type === "steps") return Math.min(100, (todayTotal(data.steps) / target) * 100);
    if (type === "water") return Math.min(100, (todayTotal(data.water) / target) * 100);
    if (type === "sleep") { const s = data.sleep[data.sleep.length-1]; return Math.min(100, ((s?.hours ?? 0) / target) * 100); }
    if (type === "workouts") return Math.min(100, (data.workouts.length / target) * 100);
    return 0;
  };

  function add(e: React.FormEvent) {
    e.preventDefault();
    setData((d) => ({ ...d, goals: [...d.goals, { id: uid(), type: form.type, target: parseFloat(form.target), period: form.period }] }));
    toast.success("Goal added");
  }

  return (
    <AppShell title="Goals">
      <PageHeader title="Goals" description="Daily, weekly and monthly health goals." />
      <Card className="p-5 mb-5">
        <form onSubmit={add} className="grid sm:grid-cols-4 gap-3 items-end">
          <div><Label>Type</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})}>
              <option value="steps">Steps</option><option value="water">Water (ml)</option><option value="sleep">Sleep (hours)</option><option value="workouts">Workouts</option><option value="weight">Weight (kg)</option>
            </select>
          </div>
          <div><Label>Target</Label><Input type="number" value={form.target} onChange={(e)=>setForm({...form,target:e.target.value})} /></div>
          <div><Label>Period</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.period} onChange={(e)=>setForm({...form,period:e.target.value as any})}>
              <option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option>
            </select>
          </div>
          <Button type="submit">Add goal</Button>
        </form>
      </Card>
      <div className="grid sm:grid-cols-2 gap-4">
        {data.goals.map((g) => {
          const p = progress(g.type, g.target);
          return (
            <Card key={g.id} className="p-5">
              <div className="flex items-center justify-between">
                <div><div className="font-semibold capitalize">{g.type}</div><div className="text-xs text-muted-foreground">{g.period} · target {g.target}</div></div>
                <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, goals: d.goals.filter((x) => x.id !== g.id) }))}><Trash2 className="h-4 w-4" /></Button>
              </div>
              <Progress value={p} className="mt-4" />
              <div className="text-xs text-muted-foreground mt-2">{Math.round(p)}% complete</div>
            </Card>
          );
        })}
      </div>
    </AppShell>
  );
}