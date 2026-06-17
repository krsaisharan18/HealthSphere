import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartCard } from "@/components/ChartCard";
import { useApp } from "@/contexts/AppContext";
import { sugarCategory, todayISO, uid } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/sugar")({
  head: () => ({ meta: [{ title: "Blood Sugar — Health Sphere" }, { name: "description", content: "Track glucose levels." }] }),
  component: SugarPage,
});

function SugarPage() {
  const { data, setData } = useApp();
  const [value, setValue] = useState("");
  const [type, setType] = useState<"fasting" | "random" | "hba1c">("fasting");
  const [date, setDate] = useState(todayISO());

  function add(e: React.FormEvent) {
    e.preventDefault();
    const v = parseFloat(value);
    if (!v) return toast.error("Enter a valid value");
    setData((d) => ({ ...d, sugar: [...d.sugar, { id: uid(), date, value: v, type }] }));
    setValue("");
    toast.success("Glucose entry added");
  }

  const chart = data.sugar.map((s) => ({ date: s.date.slice(5), value: s.value }));
  const avg = data.sugar.length ? Math.round(data.sugar.reduce((s,e)=>s+e.value,0)/data.sugar.length) : 0;

  return (
    <AppShell title="Blood Sugar">
      <PageHeader title="Blood Sugar" description="Fasting, random and HbA1c tracking." />
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Average</div><div className="text-3xl font-bold mt-1">{avg} <span className="text-sm text-muted-foreground">mg/dL</span></div></Card>
        <Card className="p-5 lg:col-span-2">
          <form onSubmit={add} className="grid sm:grid-cols-4 gap-3 items-end">
            <div><Label>Date</Label><Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} /></div>
            <div><Label>Type</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={type} onChange={(e)=>setType(e.target.value as any)}>
                <option value="fasting">Fasting</option><option value="random">Random</option><option value="hba1c">HbA1c (%)</option>
              </select>
            </div>
            <div><Label>Value</Label><Input type="number" step="any" value={value} onChange={(e)=>setValue(e.target.value)} /></div>
            <Button type="submit">Add</Button>
          </form>
        </Card>
      </div>
      <ChartCard title="Glucose trend">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Line dataKey="value" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <Card className="p-5 mt-5">
        <div className="font-semibold mb-3">History</div>
        <div className="divide-y divide-border">
          {[...data.sugar].reverse().map((s) => {
            const cat = s.type === "hba1c" ? { label: s.value < 5.7 ? "Normal" : s.value < 6.5 ? "Pre-diabetic" : "Diabetic", color: "var(--primary)" } : sugarCategory(s.value, s.type === "fasting");
            return (
              <div key={s.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium">{s.value}{s.type==="hba1c"?"%":" mg/dL"} <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white" style={{ background: cat.color }}>{cat.label}</span></div>
                  <div className="text-xs text-muted-foreground">{s.date} · {s.type}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, sugar: d.sugar.filter((x) => x.id !== s.id) }))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            );
          })}
          {data.sugar.length === 0 && <div className="text-sm text-muted-foreground">No entries.</div>}
        </div>
      </Card>
    </AppShell>
  );
}