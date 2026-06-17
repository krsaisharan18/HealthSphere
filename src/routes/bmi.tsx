import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { bmiCategory, uid, todayISO } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/bmi")({
  head: () => ({ meta: [{ title: "BMI Calculator — Health Sphere" }, { name: "description", content: "Calculate your BMI." }] }),
  component: BMIPage,
});

function BMIPage() {
  const { data, setData } = useApp();
  const lastWeight = data.weight[data.weight.length - 1]?.value ?? 70;
  const [h, setH] = useState(String(data.height));
  const [w, setW] = useState(String(lastWeight));
  const height = parseFloat(h) || 0; const weight = parseFloat(w) || 0;
  const bmi = height > 0 ? weight / Math.pow(height / 100, 2) : 0;
  const cat = bmi > 0 ? bmiCategory(bmi) : null;

  function save() {
    setData((d) => ({ ...d, height: height, weight: [...d.weight, { id: uid(), date: todayISO(), value: weight }] }));
    toast.success("Saved!");
  }

  const recs: Record<string, string> = {
    Underweight: "Aim for 300–500 extra calories/day with protein-rich foods.",
    Normal: "Maintain with balanced diet, 30 min of activity daily.",
    Overweight: "Create a 400–600 cal deficit, walk 8–10k steps daily.",
    Obese: "Consult a doctor; focus on movement, sleep, hydration first.",
  };

  return (
    <AppShell title="BMI Calculator">
      <PageHeader title="BMI Calculator" description="Body mass index with personalized recommendations." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-6">
          <div className="space-y-4">
            <div><Label>Height (cm)</Label><Input type="number" value={h} onChange={(e)=>setH(e.target.value)} /></div>
            <div><Label>Weight (kg)</Label><Input type="number" value={w} onChange={(e)=>setW(e.target.value)} /></div>
            <Button onClick={save} className="w-full">Save measurements</Button>
          </div>
        </Card>
        <Card className="p-6 flex flex-col items-center justify-center text-center" style={{ background: "var(--gradient-card)" }}>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Your BMI</div>
          <div className="text-6xl font-bold mt-2">{bmi ? bmi.toFixed(1) : "—"}</div>
          {cat && <div className="mt-3 px-4 py-1.5 rounded-full text-sm font-semibold text-white" style={{ background: cat.color }}>{cat.label}</div>}
          {cat && <p className="mt-4 text-sm text-muted-foreground max-w-xs">{recs[cat.label]}</p>}
        </Card>
      </div>
      <Card className="p-6 mt-5">
        <div className="font-semibold mb-3">BMI Categories</div>
        <div className="grid sm:grid-cols-4 gap-3 text-sm">
          {[{l:"Underweight",r:"< 18.5"},{l:"Normal",r:"18.5 – 24.9"},{l:"Overweight",r:"25 – 29.9"},{l:"Obese",r:"≥ 30"}].map((x)=>(
            <div key={x.l} className="p-3 rounded-lg bg-muted/50"><div className="font-medium">{x.l}</div><div className="text-xs text-muted-foreground">{x.r}</div></div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}