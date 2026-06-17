import { createFileRoute } from "@tanstack/react-router";
import { PublicNav, PublicFooter } from "@/components/layout/PublicNav";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — Health Sphere" }, { name: "description", content: "Our privacy practices." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-16 prose prose-neutral dark:prose-invert">
        <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="text-muted-foreground mt-3">Health Sphere stores your health data locally in your browser. We do not transmit your personal health information to any server. You can export or delete your data at any time from Settings.</p>
        <h2 className="mt-6 text-xl font-semibold">Data we collect</h2>
        <p>Nothing leaves your device unless you explicitly export it.</p>
        <h2 className="mt-6 text-xl font-semibold">Your rights</h2>
        <p>You can export, modify or delete your data anytime.</p>
      </main>
      <PublicFooter />
    </div>
  ),
});