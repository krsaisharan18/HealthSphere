import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { RingProgress } from "@/components/RingProgress";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { todayISO, todayTotal, uid } from "@/lib/health";
import { toast } from "sonner";
import { Droplet, Trash2 } from "lucide-react";
import { ChartCard } from "@/components/ChartCard";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/water")({
  head: () => ({ meta: [{ title: "Water Tracker — Health Sphere" }, { name: "description", content: "Track your daily water intake." }] }),
  component: WaterPage,
});

function WaterPage() {
  const { data, setData } = useApp();
  const today = todayTotal(data.water);
  const goal = 2500;
  const pct = Math.round((today / goal) * 100);

  function add(ml: number) {
    setData((d) => ({ ...d, water: [...d.water, { id: uid(), date: todayISO(), value: ml }] }));
    toast.success(`+${ml} ml added`);
  }
  function remove(id: string) { setData((d) => ({ ...d, water: d.water.filter((x) => x.id !== id) })); }

  const chartData = data.water.map((e) => ({ date: e.date.slice(5), value: e.value }));

  return (
    <AppShell title="Water Tracker">
      <PageHeader title="Water Tracker" description="Stay hydrated. Goal: 2.5L per day." />
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 flex flex-col items-center" style={{ background: "var(--gradient-card)" }}>
          <RingProgress value={pct} size={200} stroke={16} sub={`${(today/1000).toFixed(2)}L of ${(goal/1000).toFixed(1)}L`} label="%" />
          <div className="mt-5 grid grid-cols-3 gap-2 w-full">
            {[250, 500, 1000].map((ml) => (
              <Button key={ml} variant="outline" onClick={() => add(ml)}><Droplet className="h-4 w-4 mr-1" />{ml}ml</Button>
            ))}
          </div>
        </Card>
        <ChartCard title="Last 7 days" subtitle="Daily intake (ml)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis stroke="var(--muted-foreground)" fontSize={12} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
              <Bar dataKey="value" fill="var(--secondary)" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card className="p-5">
          <div className="font-semibold mb-3">Recent logs</div>
          <div className="max-h-72 overflow-auto divide-y divide-border">
            {[...data.water].reverse().slice(0, 20).map((e) => (
              <div key={e.id} className="flex items-center justify-between py-2">
                <div><div className="text-sm font-medium">{e.value} ml</div><div className="text-xs text-muted-foreground">{e.date}</div></div>
                <Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}