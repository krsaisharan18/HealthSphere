import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/contexts/AppContext";
import { uid, todayISO } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, CalendarCheck } from "lucide-react";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Appointments — Health Sphere" }, { name: "description", content: "Book and track doctor visits." }] }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const { data, setData } = useApp();
  const [form, setForm] = useState({ doctor: "", hospital: "", date: todayISO(), time: "10:00", notes: "" });

  function add(e: React.FormEvent) {
    e.preventDefault();
    if (!form.doctor) return toast.error("Doctor name required");
    setData((d) => ({ ...d, appointments: [...d.appointments, { id: uid(), ...form }] }));
    setForm({ doctor: "", hospital: "", date: todayISO(), time: "10:00", notes: "" });
    toast.success("Appointment booked");
  }

  const now = new Date();
  const upcoming = data.appointments.filter((a) => new Date(`${a.date}T${a.time}`) >= now).sort((a,b)=> a.date.localeCompare(b.date));
  const past = data.appointments.filter((a) => new Date(`${a.date}T${a.time}`) < now).sort((a,b)=> b.date.localeCompare(a.date));

  return (
    <AppShell title="Appointments">
      <PageHeader title="Appointments" description="Manage doctor visits with reminders." />
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-5">
          <div className="font-semibold mb-3">Book appointment</div>
          <form onSubmit={add} className="space-y-3">
            <div><Label>Doctor</Label><Input value={form.doctor} onChange={(e)=>setForm({...form,doctor:e.target.value})} /></div>
            <div><Label>Hospital / clinic</Label><Input value={form.hospital} onChange={(e)=>setForm({...form,hospital:e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-2"><div><Label>Date</Label><Input type="date" value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} /></div><div><Label>Time</Label><Input type="time" value={form.time} onChange={(e)=>setForm({...form,time:e.target.value})} /></div></div>
            <div><Label>Notes</Label><Textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} /></div>
            <Button type="submit" className="w-full">Add</Button>
          </form>
        </Card>
        <div className="lg:col-span-2 space-y-5">
          <Card className="p-5">
            <div className="font-semibold mb-3">Upcoming</div>
            <div className="space-y-2">
              {upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--gradient-primary)" }}><CalendarCheck className="h-5 w-5" /></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.doctor} <span className="text-xs text-muted-foreground">· {a.hospital}</span></div>
                    <div className="text-xs text-muted-foreground">{a.date} at {a.time}{a.notes ? ` — ${a.notes}` : ""}</div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, appointments: d.appointments.filter((x) => x.id !== a.id) }))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              {upcoming.length === 0 && <div className="text-sm text-muted-foreground">No upcoming appointments.</div>}
            </div>
          </Card>
          <Card className="p-5">
            <div className="font-semibold mb-3">Past</div>
            <div className="space-y-2">
              {past.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/40 opacity-80">
                  <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1 text-sm">{a.doctor} · {a.date} {a.time}</div>
                  <Button variant="ghost" size="icon" onClick={() => setData((d) => ({ ...d, appointments: d.appointments.filter((x) => x.id !== a.id) }))}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
              {past.length === 0 && <div className="text-sm text-muted-foreground">No past appointments.</div>}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}