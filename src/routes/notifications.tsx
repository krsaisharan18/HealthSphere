import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/contexts/AppContext";
import { Bell, Check } from "lucide-react";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Health Sphere" }, { name: "description", content: "Your reminders and alerts." }] }),
  component: NotificationsPage,
});

function NotificationsPage() {
  const { data, setData } = useApp();
  return (
    <AppShell title="Notifications">
      <PageHeader title="Notifications" description="Reminders, goal alerts and updates." action={<Button variant="outline" onClick={() => setData((d) => ({ ...d, reminders: d.reminders.map((r) => ({ ...r, read: true })) }))}><Check className="h-4 w-4 mr-1" />Mark all read</Button>} />
      <Card className="p-3">
        <div className="divide-y divide-border">
          {data.reminders.map((r) => (
            <div key={r.id} className={`flex items-center gap-3 p-3 ${r.read ? "opacity-60" : ""}`}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--gradient-primary)" }}><Bell className="h-4 w-4" /></div>
              <div className="flex-1"><div className="text-sm font-medium">{r.title}</div><div className="text-xs text-muted-foreground">{new Date(r.date).toLocaleString()} · {r.type}</div></div>
            </div>
          ))}
          {data.reminders.length === 0 && <div className="text-sm text-muted-foreground p-3">No notifications.</div>}
        </div>
      </Card>
    </AppShell>
  );
}