import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Forgot Password — Health Sphere" }, { name: "description", content: "Reset your Health Sphere password." }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const [email, setEmail] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--gradient-hero)" }}>
      <Card className="w-full max-w-md p-8 glass" style={{ boxShadow: "var(--shadow-elegant)" }}>
        <Link to="/" className="flex items-center gap-2 mb-6">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)" }}><HeartPulse className="h-5 w-5 text-white" /></div>
          <span className="font-bold">Health Sphere</span>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send a reset link.</p>
        <form onSubmit={(e) => { e.preventDefault(); toast.success("If an account exists, a reset link has been sent."); }} className="space-y-4">
          <div><Label>Email</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          <Button type="submit" className="w-full" size="lg">Send reset link</Button>
        </form>
        <div className="text-sm text-center mt-6 text-muted-foreground">
          Remembered it? <Link to="/login" className="text-primary font-medium hover:underline">Back to sign in</Link>
        </div>
      </Card>
    </div>
  );
}