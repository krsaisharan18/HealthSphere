import { createFileRoute } from "@tanstack/react-router";
import { PublicNav, PublicFooter } from "@/components/layout/PublicNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — Health Sphere" }, { name: "description", content: "Get in touch with us." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="max-w-2xl mx-auto px-4 lg:px-8 py-16">
        <h1 className="text-4xl font-bold tracking-tight">Contact us</h1>
        <p className="text-muted-foreground mt-2">We'd love to hear from you. Reach us at hello@healthsphere.app.</p>
        <Card className="p-6 mt-8">
          <form onSubmit={(e) => { e.preventDefault(); toast.success("Message sent!"); }} className="space-y-4">
            <div><Label>Name</Label><Input required /></div>
            <div><Label>Email</Label><Input type="email" required /></div>
            <div><Label>Message</Label><Textarea required rows={5} /></div>
            <Button type="submit">Send message</Button>
          </form>
        </Card>
      </main>
      <PublicFooter />
    </div>
  ),
});