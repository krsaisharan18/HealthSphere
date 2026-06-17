import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { foodDatabase, todayISO, uid } from "@/lib/health";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Trash2, Search } from "lucide-react";

export const Route = createFileRoute("/calories")({
  head: () => ({ meta: [{ title: "Calorie Tracker — Health Sphere" }, { name: "description", content: "Track calories with Indian food database." }] }),
  component: CaloriePage,
});

const MEALS = ["Breakfast", "Lunch", "Snacks", "Dinner"];

function CaloriePage() {
  const { data, setData } = useApp();
  const [q, setQ] = useState("");
  const [meal, setMeal] = useState("Breakfast");
  const matches = useMemo(() => q ? foodDatabase.filter((f) => f.name.toLowerCase().includes(q.toLowerCase())) : foodDatabase.slice(0, 8), [q]);

  function addFood(name: string, cal: number) {
    setData((d) => ({ ...d, foods: [...d.foods, { id: uid(), date: todayISO(), name, calories: cal, meal }] }));
    toast.success(`${name} added to ${meal}`);
  }

  const today = data.foods.filter((f) => f.date === todayISO());
  const total = today.reduce((s,f)=>s+f.calories,0);
  const burned = data.workouts.filter((w)=>w.date===todayISO()).reduce((s,w)=>s+w.calories,0);

  return (
    <AppShell title="Calorie Tracker">
      <PageHeader title="Calorie Tracker" description="Indian food database + workout burn." />
      <div className="grid sm:grid-cols-3 gap-5 mb-5">
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Consumed today</div><div className="text-3xl font-bold mt-1">{total} <span className="text-sm text-muted-foreground">kcal</span></div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Burned today</div><div className="text-3xl font-bold mt-1">{burned} <span className="text-sm text-muted-foreground">kcal</span></div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Net</div><div className="text-3xl font-bold mt-1">{total - burned} <span className="text-sm text-muted-foreground">kcal</span></div></Card>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search foods..." value={q} onChange={(e)=>setQ(e.target.value)} />
            </div>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={meal} onChange={(e)=>setMeal(e.target.value)}>
              {MEALS.map((m)=><option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="max-h-80 overflow-auto divide-y divide-border">
            {matches.map((f) => (
              <div key={f.name} className="flex items-center justify-between py-2">
                <div><div className="text-sm font-medium">{f.name}</div><div className="text-xs text-muted-foreground">{f.calories} kcal</div></div>
                <Button size="sm" onClick={() => addFood(f.name, f.calories)}>Add</Button>
              </div>
            ))}
          </div>
          <CustomFoodAdd onAdd={(n,c) => addFood(n, c)} />
        </Card>
        <Card className="p-5">
          <div className="font-semibold mb-3">Today's intake</div>
          {MEALS.map((m) => {
            const items = today.filter((f) => f.meal === m);
            const sum = items.reduce((s,f)=>s+f.calories,0);
            return (
              <div key={m} className="mb-4">
                <div className="flex items-center justify-between mb-1.5"><div className="text-sm font-semibold">{m}</div><div className="text-xs text-muted-foreground">{sum} kcal</div></div>
                <div className="divide-y divide-border">
                  {items.map((f) => (
                    <div key={f.id} className="flex items-center justify-between py-1.5">
                      <div className="text-sm">{f.name} <span className="text-xs text-muted-foreground">· {f.calories} kcal</span></div>
                      <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, foods: d.foods.filter((x) => x.id !== f.id) }))}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  ))}
                  {items.length === 0 && <div className="text-xs text-muted-foreground py-1.5">Nothing logged</div>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </AppShell>
  );
}

function CustomFoodAdd({ onAdd }: { onAdd: (name: string, cal: number) => void }) {
  const [n, setN] = useState(""); const [c, setC] = useState("");
  return (
    <form onSubmit={(e) => { e.preventDefault(); const cn = parseFloat(c); if (!n || !cn) return; onAdd(n, cn); setN(""); setC(""); }} className="mt-4 grid grid-cols-[1fr_120px_auto] gap-2">
      <Input placeholder="Custom food name" value={n} onChange={(e)=>setN(e.target.value)} />
      <Input type="number" placeholder="kcal" value={c} onChange={(e)=>setC(e.target.value)} />
      <Button type="submit">Add</Button>
    </form>
  );
}