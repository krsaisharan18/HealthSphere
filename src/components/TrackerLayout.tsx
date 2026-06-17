import { AppShell } from "@/components/layout/AppShell";
import { ChartCard } from "@/components/ChartCard";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { uid, todayISO, type Entry, type DataState } from "@/lib/health";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line } from "recharts";

type Key = "steps" | "heart" | "water" | "weight";

export function SimpleTracker({
  title, description, dataKey, unit, color = "var(--primary)", chart = "area", extra, suffix,
}: {
  title: string;
  description: string;
  dataKey: Key;
  unit: string;
  color?: string;
  chart?: "area" | "line";
  extra?: (entries: Entry[]) => ReactNode;
  suffix?: ReactNode;
}) {
  const { data, setData } = useApp();
  const entries = data[dataKey] as Entry[];
  const [value, setValue] = useState("");
  const [date, setDate] = useState(todayISO());

  function add(e: React.FormEvent) {
    e.preventDefault();
    const v = parseFloat(value);
    if (!v || v <= 0) return toast.error("Enter a valid value");
    setData((d) => ({ ...d, [dataKey]: [...(d[dataKey] as Entry[]), { id: uid(), date, value: v }] } as DataState));
    setValue("");
    toast.success(`${title} entry added`);
  }
  function remove(id: string) {
    setData((d) => ({ ...d, [dataKey]: (d[dataKey] as Entry[]).filter((x) => x.id !== id) } as DataState));
  }

  const chartData = entries.map((e) => ({ date: e.date.slice(5), value: e.value }));
  const avg = entries.length ? Math.round(entries.reduce((s, e) => s + e.value, 0) / entries.length) : 0;
  const max = entries.length ? Math.max(...entries.map((e) => e.value)) : 0;

  return (
    <AppShell title={title}>
      <PageHeader title={title} description={description} />
      <div className="grid lg:grid-cols-3 gap-5 mb-5">
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Average</div><div className="text-3xl font-bold mt-1">{avg.toLocaleString()} <span className="text-sm text-muted-foreground">{unit}</span></div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Best</div><div className="text-3xl font-bold mt-1">{max.toLocaleString()} <span className="text-sm text-muted-foreground">{unit}</span></div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Entries</div><div className="text-3xl font-bold mt-1">{entries.length}</div></Card>
      </div>
      {extra && extra(entries)}
      <div className="grid lg:grid-cols-3 gap-5">
        <ChartCard title="Trend" subtitle={`Recent ${title.toLowerCase()} entries`}>
          <ResponsiveContainer width="100%" height={260}>
            {chart === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="trkg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity={0.5} />
                    <stop offset="100%" stopColor={color} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Area type="monotone" dataKey="value" stroke={color} fill="url(#trkg)" strokeWidth={2.5} />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </ChartCard>
        <Card className="p-5">
          <div className="font-semibold mb-3">Add entry</div>
          <form onSubmit={add} className="space-y-3">
            <div><Label>Date</Label><Input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></div>
            <div><Label>Value ({unit})</Label><Input type="number" step="any" value={value} onChange={(e) => setValue(e.target.value)} placeholder={`e.g. 8500`} /></div>
            <Button type="submit" className="w-full">Add</Button>
          </form>
          {suffix}
        </Card>
      </div>
      <Card className="p-5 mt-5">
        <div className="font-semibold mb-3">History</div>
        <div className="divide-y divide-border">
          {[...entries].reverse().map((e) => (
            <div key={e.id} className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium">{e.value.toLocaleString()} {unit}</div>
                <div className="text-xs text-muted-foreground">{e.date}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          {entries.length === 0 && <div className="text-sm text-muted-foreground">No entries yet.</div>}
        </div>
      </Card>
    </AppShell>
  );
}