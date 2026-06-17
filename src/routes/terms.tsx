import { createFileRoute } from "@tanstack/react-router";
import { PublicNav, PublicFooter } from "@/components/layout/PublicNav";

export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms — Health Sphere" }, { name: "description", content: "Terms & conditions." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-16 prose prose-neutral dark:prose-invert">
        <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
        <p className="text-muted-foreground mt-3">Health Sphere is provided for personal wellness tracking. It is not a medical device and does not provide medical advice. Always consult a qualified physician for medical concerns.</p>
        <p className="mt-4">By using this app you agree to use it responsibly and accept that the developers are not liable for any decisions made based on its information.</p>
      </main>
      <PublicFooter />
    </div>
  ),
});