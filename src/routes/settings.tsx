import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/contexts/AppContext";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Health Sphere" }, { name: "description", content: "App settings and preferences." }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { theme, setTheme, lang, setLang, data, resetData } = useApp();

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "health-sphere-data.json"; a.click(); URL.revokeObjectURL(url);
    toast.success("Data exported");
  }

  function exportCSV() {
    const rows = [["type","date","value"]];
    data.steps.forEach((s) => rows.push(["steps", s.date, String(s.value)]));
    data.water.forEach((s) => rows.push(["water", s.date, String(s.value)]));
    data.heart.forEach((s) => rows.push(["heart", s.date, String(s.value)]));
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "health-sphere.csv"; a.click(); URL.revokeObjectURL(url);
    toast.success("CSV exported");
  }

  return (
    <AppShell title="Settings">
      <PageHeader title="Settings" description="Theme, language, data and privacy." />
      <div className="grid lg:grid-cols-2 gap-5">
        <Card className="p-5 space-y-4">
          <div className="flex items-center justify-between"><div><div className="font-medium">Dark mode</div><div className="text-xs text-muted-foreground">Easier on the eyes at night.</div></div><Switch checked={theme === "dark"} onCheckedChange={(v) => setTheme(v ? "dark" : "light")} /></div>
          <div className="flex items-center justify-between"><div><div className="font-medium">Language</div><div className="text-xs text-muted-foreground">Display language</div></div>
            <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={lang} onChange={(e) => setLang(e.target.value as "en" | "hi")}><option value="en">English</option><option value="hi">हिन्दी</option></select>
          </div>
        </Card>
        <Card className="p-5 space-y-3">
          <div className="font-semibold">Data & privacy</div>
          <p className="text-sm text-muted-foreground">All data lives in your browser. Export or reset anytime.</p>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={exportJSON}>Export JSON</Button>
            <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
            <Button variant="destructive" onClick={() => { if (confirm("Reset all health data?")) { resetData(); toast.success("Data reset"); } }}>Reset data</Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}