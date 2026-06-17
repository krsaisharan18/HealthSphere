import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { uid, todayISO } from "@/lib/health";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, FileText, Download, Search } from "lucide-react";

const CATS = ["Lab Report", "Prescription", "Scan", "Other"];

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Health Reports — Health Sphere" }, { name: "description", content: "Upload and organize lab reports." }] }),
  component: ReportsPage,
});

function ReportsPage() {
  const { data, setData } = useApp();
  const [name, setName] = useState(""); const [cat, setCat] = useState("Lab Report"); const [q, setQ] = useState("");

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setData((d) => ({ ...d, reports: [...d.reports, { id: uid(), name: name || file.name, category: cat, date: todayISO(), dataUrl }] }));
      setName("");
      toast.success("Report uploaded");
    };
    reader.readAsDataURL(file);
  }

  const filtered = data.reports.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <AppShell title="Health Reports">
      <PageHeader title="Health Reports" description="Upload prescriptions, lab and scan reports. Stored on your device." />
      <Card className="p-5 mb-5">
        <div className="grid sm:grid-cols-[1fr_180px_auto] gap-3 items-end">
          <div><Label>Report name</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="e.g. Blood test - Sept" /></div>
          <div><Label>Category</Label>
            <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={cat} onChange={(e)=>setCat(e.target.value)}>
              {CATS.map((c)=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div><Label>Upload</Label><Input type="file" accept="image/*,application/pdf" onChange={onFile} /></div>
        </div>
      </Card>
      <div className="relative mb-4">
        <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search reports..." value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <Card key={r.id} className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)", color: "var(--primary)" }}><FileText className="h-5 w-5" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.category} · {r.date}</div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {r.dataUrl && <a href={r.dataUrl} download={r.name}><Button variant="outline" size="sm"><Download className="h-3.5 w-3.5 mr-1" />Download</Button></a>}
              <Button variant="ghost" size="sm" onClick={() => setData((d) => ({ ...d, reports: d.reports.filter((x) => x.id !== r.id) }))}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-sm text-muted-foreground">No reports.</div>}
      </div>
    </AppShell>
  );
}