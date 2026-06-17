import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { loadLS } from "@/lib/storage";
import { healthScore } from "@/lib/health";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Health Sphere" }, { name: "description", content: "Admin dashboard." }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, data } = useApp();
  const users = loadLS<Array<{ id: string; name: string; email: string }>>("hs:users", []);
  if (user?.role !== "admin") {
    return <AppShell title="Admin"><Card className="p-8 text-center"><div className="font-semibold">Admin access only</div><div className="text-sm text-muted-foreground mt-1">Sign up with an email containing "admin" to view this page.</div></Card></AppShell>;
  }
  return (
    <AppShell title="Admin">
      <PageHeader title="Admin dashboard" description="Users and platform health." />
      <div className="grid sm:grid-cols-3 gap-4 mb-5">
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Total users</div><div className="text-3xl font-bold mt-1">{users.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Reports stored</div><div className="text-3xl font-bold mt-1">{data.reports.length}</div></Card>
        <Card className="p-5"><div className="text-xs uppercase tracking-wider text-muted-foreground">Avg health score</div><div className="text-3xl font-bold mt-1">{healthScore(data)}</div></Card>
      </div>
      <Card className="p-5">
        <div className="font-semibold mb-3">Users</div>
        <div className="divide-y divide-border">
          {users.map((u) => (
            <div key={u.id} className="flex items-center gap-3 py-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: "var(--gradient-primary)" }}>{u.name.charAt(0)}</div>
              <div className="flex-1"><div className="text-sm font-medium">{u.name}</div><div className="text-xs text-muted-foreground">{u.email}</div></div>
            </div>
          ))}
          {users.length === 0 && <div className="text-sm text-muted-foreground">No registered users yet.</div>}
        </div>
      </Card>
    </AppShell>
  );
}