import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useApp } from "@/contexts/AppContext";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Health Sphere" }, { name: "description", content: "Your profile and health goals." }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useApp();
  const [form, setForm] = useState({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", gender: user?.gender ?? "", dob: user?.dob ?? "", avatar: user?.avatar ?? "" });

  function onAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    const r = new FileReader(); r.onload = () => setForm({ ...form, avatar: String(r.result) }); r.readAsDataURL(f);
  }

  function save(e: React.FormEvent) {
    e.preventDefault();
    updateUser(form); toast.success("Profile updated");
  }

  return (
    <AppShell title="Profile">
      <PageHeader title="Your profile" description="Manage personal details and avatar." />
      <div className="grid lg:grid-cols-3 gap-5">
        <Card className="p-6 flex flex-col items-center text-center">
          <div className="h-28 w-28 rounded-full overflow-hidden flex items-center justify-center text-3xl font-bold text-white" style={{ background: "var(--gradient-primary)" }}>
            {form.avatar ? <img src={form.avatar} alt="" className="h-full w-full object-cover" /> : (form.name.charAt(0) || "U").toUpperCase()}
          </div>
          <div className="font-semibold mt-3">{form.name || "Your name"}</div>
          <div className="text-xs text-muted-foreground">{form.email}</div>
          <Label className="mt-4 cursor-pointer"><span className="text-sm text-primary hover:underline">Upload picture</span><Input type="file" accept="image/*" className="hidden" onChange={onAvatar} /></Label>
        </Card>
        <Card className="p-6 lg:col-span-2">
          <form onSubmit={save} className="grid sm:grid-cols-2 gap-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><Label>Gender</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.gender} onChange={(e)=>setForm({...form,gender:e.target.value})}>
                <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
              </select>
            </div>
            <div><Label>Date of birth</Label><Input type="date" value={form.dob} onChange={(e)=>setForm({...form,dob:e.target.value})} /></div>
            <Button type="submit" className="sm:col-span-2">Save changes</Button>
          </form>
        </Card>
      </div>
    </AppShell>
  );
}