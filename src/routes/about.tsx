import { createFileRoute } from "@tanstack/react-router";
import { PublicNav, PublicFooter } from "@/components/layout/PublicNav";

export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About — Health Sphere" }, { name: "description", content: "About Health Sphere." }] }),
  component: () => (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="max-w-3xl mx-auto px-4 lg:px-8 py-16 prose prose-neutral dark:prose-invert">
        <h1 className="text-4xl font-bold tracking-tight">About Health Sphere</h1>
        <p className="text-muted-foreground mt-3">Health Sphere is a premium personal health operating system. We help people track every important metric — steps, heart rate, sleep, hydration, BP, sugar, diet, workouts and medications — in one beautifully designed dashboard.</p>
        <p className="mt-4">Built privacy-first: your data stays on your device. No accounts required to start. Inspired by Apple Health, Fitbit and Google Fit, refined for the modern web.</p>
      </main>
      <PublicFooter />
    </div>
  ),
});