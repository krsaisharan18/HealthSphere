import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartCard } from "@/components/ChartCard";
import { useApp } from "@/contexts/AppContext";
import { bpCategory, todayISO, uid } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";

export const Route = createFileRoute("/bp")({
  head: () => ({ meta: [{ title: "Blood Pressure — Health Sphere" }, { name: "description", content: "Track systolic and diastolic." }] }),
  component: BPPage,
});

function BPPage() {
  const { data, setData } = useApp();
  const [s, setS] = useState(""); const [d, setD] = useState(""); const [date, setDate] = useState(todayISO());

  function add(e: React.FormEvent) {
    e.preventDefault();
    const sys = parseInt(s); const dia = parseInt(d);
    if (!sys || !dia) return toast.error("Enter valid values");
    setData((x) => ({ ...x, bp: [...x.bp, { id: uid(), date, systolic: sys, diastolic: dia }] }));
    setS(""); setD("");
    const cat = bpCategory(sys, dia);
    toast.success(`Logged ${sys}/${dia} — ${cat.label}`);
  }
  function remove(id: string) { setData((x) => ({ ...x, bp: x.bp.filter((b) => b.id !== id) })); }

  const chart = data.bp.map((b) => ({ date: b.date.slice(5), Systolic: b.systolic, Diastolic: b.diastolic }));
  const last = data.bp[data.bp.length - 1];
  const cat = last ? bpCategory(last.systolic, last.diastolic) : null;

  return (
    <AppShell title="Blood Pressure">
      <PageHeader title="Blood Pressure" description="Track systolic & diastolic with category alerts." />
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <Card className="p-5 lg:col-span-1">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Latest</div>
          {last ? (
            <>
              <div className="text-4xl font-bold mt-2">{last.systolic}/{last.diastolic} <span className="text-base text-muted-foreground">mmHg</span></div>
              {cat && <div className="mt-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold text-white" style={{ background: cat.color }}>{cat.label}</div>}
            </>
          ) : <div className="text-muted-foreground mt-2">No readings yet.</div>}
        </Card>
        <Card className="p-5 lg:col-span-2">
          <div className="font-semibold mb-3">Log reading</div>
          <form onSubmit={add} className="grid sm:grid-cols-4 gap-3 items-end">
            <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><Label>Systolic</Label><Input type="number" value={s} onChange={(e) => setS(e.target.value)} placeholder="120" /></div>
            <div><Label>Diastolic</Label><Input type="number" value={d} onChange={(e) => setD(e.target.value)} placeholder="80" /></div>
            <Button type="submit">Add</Button>
          </form>
        </Card>
      </div>
      <ChartCard title="Trend" subtitle="Systolic vs diastolic">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chart}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
            <YAxis stroke="var(--muted-foreground)" fontSize={12} />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
            <Legend />
            <Line dataKey="Systolic" stroke="var(--destructive)" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line dataKey="Diastolic" stroke="var(--secondary)" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
      <Card className="p-5 mt-5">
        <div className="font-semibold mb-3">History</div>
        <div className="divide-y divide-border">
          {[...data.bp].reverse().map((b) => {
            const c = bpCategory(b.systolic, b.diastolic);
            return (
              <div key={b.id} className="flex items-center justify-between py-2">
                <div>
                  <div className="text-sm font-medium">{b.systolic}/{b.diastolic} mmHg <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white" style={{ background: c.color }}>{c.label}</span></div>
                  <div className="text-xs text-muted-foreground">{b.date}</div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => remove(b.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            );
          })}
          {data.bp.length === 0 && <div className="text-sm text-muted-foreground">No entries.</div>}
        </div>
      </Card>
    </AppShell>
  );
}