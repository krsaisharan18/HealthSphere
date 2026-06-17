import { createFileRoute } from "@tanstack/react-router";
import { SimpleTracker } from "@/components/TrackerLayout";
import { heartCategory } from "@/lib/health";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/heart")({
  head: () => ({ meta: [{ title: "Heart Rate — Health Sphere" }, { name: "description", content: "Log and track heart rate." }] }),
  component: () => (
    <SimpleTracker title="Heart Rate" description="Log resting heart rate and watch trends." dataKey="heart" unit="bpm" color="oklch(0.62 0.22 25)" chart="line"
      extra={(entries) => {
        const last = entries[entries.length - 1];
        const cat = heartCategory(last?.value ?? 75);
        return <Card className="p-5 mb-5 flex items-center gap-4"><div className="h-12 w-12 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: cat.color }}>{last?.value ?? "—"}</div><div><div className="text-sm text-muted-foreground">Latest reading</div><div className="font-semibold">{cat.label}</div></div></Card>;
      }}
    />
  ),
});