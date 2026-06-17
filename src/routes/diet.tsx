import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/diet")({
  head: () => ({ meta: [{ title: "Diet Planner — Health Sphere" }, { name: "description", content: "AI meal plans for your goal." }] }),
  component: DietPage,
});

const PLANS = {
  "Weight Loss": {
    Breakfast: [{ name: "Oats with berries", c: 280, p: 10, ca: 45, f: 6 }, { name: "Egg white omelette", c: 180, p: 18, ca: 4, f: 9 }],
    Lunch: [{ name: "Grilled chicken salad", c: 420, p: 38, ca: 22, f: 18 }, { name: "Dal + 1 roti + salad", c: 380, p: 18, ca: 50, f: 9 }],
    Snacks: [{ name: "Apple + handful almonds", c: 230, p: 5, ca: 25, f: 12 }],
    Dinner: [{ name: "Paneer tikka + sautéed veggies", c: 410, p: 26, ca: 18, f: 22 }],
  },
  "Weight Gain": {
    Breakfast: [{ name: "Peanut butter banana toast + milk", c: 620, p: 22, ca: 80, f: 22 }],
    Lunch: [{ name: "Rajma chawal + curd + salad", c: 780, p: 28, ca: 110, f: 18 }],
    Snacks: [{ name: "Mass-gainer shake + dates", c: 520, p: 30, ca: 70, f: 10 }],
    Dinner: [{ name: "Chicken curry + 2 rotis + rice", c: 820, p: 50, ca: 90, f: 22 }],
  },
  Maintenance: {
    Breakfast: [{ name: "Idli + sambar + chutney", c: 380, p: 12, ca: 65, f: 6 }],
    Lunch: [{ name: "Dal + rice + veg sabzi + curd", c: 600, p: 22, ca: 85, f: 12 }],
    Snacks: [{ name: "Fruit bowl + green tea", c: 180, p: 3, ca: 40, f: 1 }],
    Dinner: [{ name: "Roti + paneer bhurji + salad", c: 540, p: 26, ca: 50, f: 20 }],
  },
} as const;

function DietPage() {
  const [goal, setGoal] = useState<keyof typeof PLANS>("Maintenance");
  const plan = PLANS[goal];
  const items = Object.values(plan).flat() as Array<{ c: number }>;
  const total = items.reduce((s, m) => s + m.c, 0);

  return (
    <AppShell title="Diet Planner">
      <PageHeader title="Diet Planner" description="Personalized meal suggestions by goal." />
      <div className="flex gap-2 mb-5">
        {(Object.keys(PLANS) as Array<keyof typeof PLANS>).map((g) => (
          <Button key={g} variant={goal === g ? "default" : "outline"} onClick={() => setGoal(g)}>{g}</Button>
        ))}
      </div>
      <Card className="p-5 mb-5 flex items-center justify-between" style={{ background: "var(--gradient-card)" }}>
        <div><div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated daily total</div><div className="text-3xl font-bold mt-1">{total} kcal</div></div>
        <div className="text-sm text-muted-foreground max-w-md text-right">Adjust portions to match your TDEE. Hydrate well; sleep 7–9 hours.</div>
      </Card>
      <div className="grid sm:grid-cols-2 gap-5">
        {(Object.entries(plan) as Array<[string, Array<{ name: string; c: number; p: number; ca: number; f: number }>]>).map(([meal, items]) => (
          <Card key={meal} className="p-5">
            <div className="font-semibold mb-3">{meal}</div>
            <div className="space-y-3">
              {items.map((m) => (
                <div key={m.name} className="rounded-lg p-3 bg-muted/50">
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{m.c} kcal · P {m.p}g · C {m.ca}g · F {m.f}g</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}