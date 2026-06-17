import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApp } from "@/contexts/AppContext";
import { healthScore } from "@/lib/health";
import { useState } from "react";
import { Bot, User } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — Health Sphere" }, { name: "description", content: "Personalized health tips." }] }),
  component: AssistantPage,
});

type Msg = { role: "user" | "bot"; text: string };

function reply(q: string, score: number): string {
  const s = q.toLowerCase();
  if (s.includes("water") || s.includes("hydrat")) return "Aim for 2.5–3L of water daily. Sip every 30 mins, more on workout days.";
  if (s.includes("sleep")) return "Adults need 7–9 hours. Fixed schedule, no screens 30 min before bed, cool dark room.";
  if (s.includes("weight loss") || s.includes("lose weight")) return "Create a 400–600 cal deficit, prioritize protein (1.6g/kg), strength train 3x/week, walk 8–10k steps.";
  if (s.includes("weight gain") || s.includes("muscle")) return "Eat 300–500 cal surplus, 1.8g/kg protein, progressive overload, 7+ hours sleep.";
  if (s.includes("blood pressure") || s.includes("bp")) return "Reduce sodium, manage stress, 30 min cardio 5x/week, limit alcohol. Track weekly.";
  if (s.includes("sugar") || s.includes("diabet")) return "Limit refined carbs, prefer whole grains/protein/fiber. Walk 10 min after meals to flatten glucose spikes.";
  if (s.includes("workout") || s.includes("exercise")) return "Mix 3 strength + 2 cardio sessions weekly, 1 active recovery day. Warm up 5 min.";
  if (s.includes("diet") || s.includes("food")) return "Use the Diet Planner — pick your goal and follow the meal suggestions. Aim for balanced macros.";
  if (s.includes("score")) return `Your current health score is ${score}/100. Focus on whichever metric is lowest — usually water, steps or sleep.`;
  return "I can help with diet, sleep, workouts, blood pressure, sugar and hydration. Ask anything specific!";
}

function AssistantPage() {
  const { data } = useApp();
  const score = healthScore(data);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: `Hi! I'm your health assistant. Your score today is ${score}/100. Ask me about diet, sleep, workouts or anything health-related.` }]);
  const [input, setInput] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input;
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: reply(q, score) }]);
    setInput("");
  }

  const suggestions = ["How can I sleep better?", "Tips for weight loss", "How much water should I drink?", "Suggest a workout plan"];

  return (
    <AppShell title="AI Assistant">
      <PageHeader title="AI Health Assistant" description="Personalized fitness, diet and recovery tips." />
      <Card className="p-0 flex flex-col h-[70vh] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {msgs.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0" style={{ background: m.role === "user" ? "var(--secondary)" : "var(--gradient-primary)", color: "white" }}>
                {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${m.role === "user" ? "bg-secondary text-secondary-foreground" : "bg-muted"}`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex gap-2 flex-wrap">
          {suggestions.map((s) => <Button key={s} variant="outline" size="sm" onClick={() => { setInput(s); }}>{s}</Button>)}
        </div>
        <form onSubmit={send} className="p-3 border-t border-border flex gap-2">
          <Input placeholder="Ask anything about your health..." value={input} onChange={(e) => setInput(e.target.value)} />
          <Button type="submit">Send</Button>
        </form>
      </Card>
    </AppShell>
  );
}