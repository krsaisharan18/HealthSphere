import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { useApp } from "@/contexts/AppContext";
import { achievementsList } from "@/lib/health";
import { Trophy, Lock } from "lucide-react";

export const Route = createFileRoute("/achievements")({
  head: () => ({ meta: [{ title: "Achievements — Health Sphere" }, { name: "description", content: "Badges, streaks and XP." }] }),
  component: AchievementsPage,
});

function AchievementsPage() {
  const { data } = useApp();
  const unlocked = achievementsList.filter((a) => a.check(data));
  return (
    <AppShell title="Achievements">
      <PageHeader title="Achievements" description="Earn badges by building healthy habits." />
      <Card className="p-6 mb-5 flex items-center justify-between" style={{ background: "var(--gradient-primary)", color: "white" }}>
        <div><div className="text-xs uppercase tracking-widest opacity-90">Level {Math.floor(data.xp / 100) + 1}</div><div className="text-3xl font-bold mt-1">{data.xp} XP</div></div>
        <Trophy className="h-12 w-12" />
      </Card>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievementsList.map((a) => {
          const got = a.check(data);
          return (
            <Card key={a.id} className={`p-5 ${got ? "" : "opacity-60"}`}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white" style={{ background: got ? "var(--gradient-primary)" : "var(--muted)" }}>
                  {got ? <Trophy className="h-6 w-6" /> : <Lock className="h-5 w-5 text-muted-foreground" />}
                </div>
                <div><div className="font-semibold">{a.title}</div><div className="text-xs text-muted-foreground">{a.desc}</div></div>
              </div>
            </Card>
          );
        })}
      </div>
      <div className="mt-5 text-sm text-muted-foreground">{unlocked.length} of {achievementsList.length} unlocked</div>
    </AppShell>
  );
}