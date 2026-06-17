import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign up — Health Sphere" },
      { name: "description", content: "Create your Health Sphere account." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "", gender: "", dob: "" });
  const [submitting, setSubmitting] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords do not match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setSubmitting(true);
    try {
      const ok = await signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        gender: form.gender,
        dob: form.dob,
      });
      if (!ok) return toast.error("That email is already registered");
      toast.success("Account created!");
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      toast.error((err as Error).message ?? "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  const u = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  return (
    <div className="min-h-screen flex" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-xl p-8 glass" style={{ boxShadow: "var(--shadow-elegant)" }}>
          <Link to="/" className="flex items-center gap-2 mb-6">
            <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}>
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">Health Sphere</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="text-sm text-muted-foreground mb-6">Start tracking your health in under a minute.</p>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label>Full name</Label>
              <Input required value={form.name} onChange={u("name")} />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" required value={form.email} onChange={u("email")} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={u("phone")} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type="password" required value={form.password} onChange={u("password")} />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input type="password" required value={form.confirm} onChange={u("confirm")} />
            </div>
            <div>
              <Label>Gender</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" value={form.gender} onChange={u("gender")}>
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <Label>Date of birth</Label>
              <Input type="date" value={form.dob} onChange={u("dob")} />
            </div>
            <Button type="submit" className="sm:col-span-2" size="lg" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <div className="text-sm text-center mt-6 text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
