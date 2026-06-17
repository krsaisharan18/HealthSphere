import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChartCard } from "@/components/ChartCard";
import { useApp } from "@/contexts/AppContext";
import { todayISO, uid } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/sleep")({
  head: () => ({ meta: [{ title: "Sleep Tracker — Health Sphere" }, { name: "description", content: "Track sleep hours and quality." }] }),
  component: SleepPage,
});

function SleepPage() {
  const { data, setData } = useApp();
  const [bed, setBed] = useState("22:30");
  const [wake, setWake] = useState("06:30");
  const [quality, setQuality] = useState("80");
  const [date, setDate] = useState(todayISO());

  function hoursBetween(b: string, w: string) {
    const [bh, bm] = b.split(":").map(Number); const [wh, wm] = w.split(":").map(Number);
    let mins = (wh*60+wm) - (bh*60+bm); if (mins <= 0) mins += 24*60;
    return mins / 60;
  }

  function add(e: React.FormEvent) {
    e.preventDefault();
    const hours = hoursBetween(bed, wake);
    setData((d) => ({ ...d, sleep: [...d.sleep, { id: uid(), date, hours, quality: parseInt(quality) || 70 }] }));
    toast.success(`Logged ${hours.toFixed(1)}h of sleep`);
  }

  const chart = data.sleep.map((s) => ({ date: s.date.slice(5), hours: Number(s.hours.toFixed(1)), quality: s.quality }));

  return (
    <AppShell title="Sleep Tracker">
      <PageHeader title="Sleep Tracker" description="Track sleep duration and quality." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <form onSubmit={add} className="grid sm:grid-cols-2 gap-3">
            <div><Label>Date</Label><Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} /></div>
            <div><Label>Quality (0–100)</Label><Input type="number" value={quality} onChange={(e)=>setQuality(e.target.value)} /></div>
            <div><Label>Bed time</Label><Input type="time" value={bed} onChange={(e)=>setBed(e.target.value)} /></div>
            <div><Label>Wake time</Label><Input type="time" value={wake} onChange={(e)=>setWake(e.target.value)} /></div>
            <Button type="submit" className="sm:col-span-2">Add sleep entry</Button>
          </form>
        </Card>
        <ChartCard title="Sleep trend" subtitle="Hours per night">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={chart}>
              <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--secondary)" stopOpacity={0.5} /><stop offset="100%" stopColor="var(--secondary)" stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Area dataKey="hours" stroke="var(--secondary)" fill="url(#sg)" strokeWidth={2.5} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <Card className="p-5 mt-5">
        <div className="font-semibold mb-3">History</div>
        <div className="divide-y divide-border">
          {[...data.sleep].reverse().map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{s.hours.toFixed(1)} hours · Quality {s.quality}%</div>
                <div className="text-xs text-muted-foreground">{s.date}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, sleep: d.sleep.filter((x) => x.id !== s.id) }))}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}