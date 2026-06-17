import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { uid } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Pill, Trash2, Bell } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/medications")({
  head: () => ({ meta: [{ title: "Medications — Health Sphere" }, { name: "description", content: "Medication reminders." }] }),
  component: MedPage,
});

function MedPage() {
  const { data, setData } = useApp();
  const [form, setForm] = useState({ name: "", dosage: "", time: "08:00", frequency: "Daily" });

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) return toast.error("Enter medicine name");
    setData((d) => ({ ...d, medications: [...d.medications, { id: uid(), ...form, active: true }] }));
    setForm({ name: "", dosage: "", time: "08:00", frequency: "Daily" });
    toast.success("Reminder added");
    if (typeof Notification !== "undefined" && Notification.permission === "default") Notification.requestPermission();
  }

  function requestNotif() {
    if (typeof Notification === "undefined") return toast.error("Notifications not supported");
    Notification.requestPermission().then((p) => { if (p === "granted") new Notification("Health Sphere", { body: "Reminders enabled ✓" }); });
  }

  return (
    <AppShell title="Medications">
      <PageHeader title="Medication Reminders" description="Never miss a dose." action={<Button variant="outline" onClick={requestNotif}><Bell className="h-4 w-4 mr-1" />Enable notifications</Button>} />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5">
          <div className="font-semibold mb-3">Add reminder</div>
          <form onSubmit={add} className="grid sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2"><Label>Medicine</Label><Input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="e.g. Metformin" /></div>
            <div><Label>Dosage</Label><Input value={form.dosage} onChange={(e)=>setForm({...form,dosage:e.target.value})} placeholder="500 mg" /></div>
            <div><Label>Time</Label><Input type="time" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} /></div>
            <div className="sm:col-span-2"><Label>Frequency</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.frequency} onChange={(e)=>setForm({...form,frequency:e.target.value})}>
                <option>Daily</option><option>Twice daily</option><option>Three times daily</option><option>Weekly</option>
              </select>
            </div>
            <Button type="submit" className="sm:col-span-2">Add reminder</Button>
          </form>
        </Card>
        <Card className="p-5">
          <div className="font-semibold mb-3">Your medications</div>
          <div className="divide-y divide-border">
            {data.medications.map((m) => (
              <div key={m.id} className="flex items-center gap-3 py-3">
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)", color: "var(--primary)" }}><Pill className="h-5 w-5" /></div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{m.name} <span className="text-xs text-muted-foreground">{m.dosage}</span></div>
                  <div className="text-xs text-muted-foreground">{m.time} · {m.frequency}</div>
                </div>
                <Switch checked={m.active} onCheckedChange={(v) => setData((d) => ({ ...d, medications: d.medications.map((x) => x.id === m.id ? { ...x, active: v } : x) }))} />
                <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, medications: d.medications.filter((x) => x.id !== m.id) }))}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            {data.medications.length === 0 && <div className="text-sm text-muted-foreground">No reminders yet.</div>}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}