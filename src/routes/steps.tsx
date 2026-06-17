import { createFileRoute } from "@tanstack/react-router";
import { SimpleTracker } from "@/components/TrackerLayout";

export const Route = createFileRoute("/steps")({
  head: () => ({ meta: [{ title: "Step Tracker — Health Sphere" }, { name: "description", content: "Track your daily steps." }] }),
  component: () => <SimpleTracker title="Step Tracker" description="Daily steps, weekly trends and achievements." dataKey="steps" unit="steps" />,
});