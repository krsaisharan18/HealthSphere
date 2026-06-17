import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Activity, Apple, Bot, CalendarCheck, Droplet, Dumbbell, Footprints,
  HeartPulse, Moon, Pill, ShieldCheck, Sparkles, Target, Trophy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PublicNav, PublicFooter } from "@/components/layout/PublicNav";
import { RingProgress } from "@/components/RingProgress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Health Sphere — Your Premium Health OS" },
      { name: "description", content: "Track steps, heart rate, sleep, water, BP, sugar, diet and more in one beautiful dashboard. Built for people who care about their health." },
      { property: "og:title", content: "Health Sphere — Your Premium Health OS" },
      { property: "og:description", content: "All-in-one personal health tracking with AI insights, goals, achievements and reminders." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Footprints, title: "Step Tracking", desc: "Daily, weekly & monthly insights with goal rings." },
  { icon: HeartPulse, title: "Heart Rate", desc: "Log resting heart rate and trend analysis." },
  { icon: Activity, title: "Blood Pressure", desc: "Track systolic & diastolic with category alerts." },
  { icon: Moon, title: "Sleep", desc: "Hours, quality, and weekly sleep reports." },
  { icon: Apple, title: "Diet & Calories", desc: "Indian food database, meal planner, macros." },
  { icon: Droplet, title: "Water Intake", desc: "Hydration ring + smart reminders." },
  { icon: Dumbbell, title: "Workouts", desc: "Run, gym, yoga, cycling — calories burned." },
  { icon: Pill, title: "Medication Reminders", desc: "Never miss a dose, browser notifications." },
  { icon: CalendarCheck, title: "Appointments", desc: "Book and remind your doctor visits." },
  { icon: Bot, title: "AI Assistant", desc: "Personalized health & fitness tips on demand." },
  { icon: Target, title: "Goals & Streaks", desc: "Daily/weekly goals with progress tracking." },
  { icon: Trophy, title: "Achievements", desc: "Earn badges and level up your wellness." },
];

const testimonials = [
  { name: "Aarav Sharma", role: "Marathon runner", quote: "Best health dashboard I've used. The rings remind me of Apple Health but with way more depth." },
  { name: "Dr. Priya Iyer", role: "General physician", quote: "I recommend Health Sphere to patients. Clean reports, easy logging, real adherence improvements." },
  { name: "Rahul Verma", role: "Software engineer", quote: "Tracking water and sleep changed my energy levels. The AI tips are surprisingly useful." },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: "var(--gradient-hero)" }}>
        <div className="absolute inset-0 -z-0 opacity-30">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl" style={{ background: "var(--gradient-primary)" }} />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full blur-3xl" style={{ background: "var(--gradient-primary)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium mb-5">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Premium health tracking, reimagined
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
              Your complete <span className="gradient-text">health OS</span>, beautifully simple.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Track steps, heart rate, sleep, diet, hydration, BP, sugar, workouts and more — all in one premium dashboard with AI insights and reminders.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup"><Button size="lg" className="shadow-lg">Start free</Button></Link>
              <Link to="/login"><Button size="lg" variant="outline">Sign in</Button></Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "10+", l: "Trackers" },
                { v: "AI", l: "Assistant" },
                { v: "100%", l: "Private" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-bold gradient-text">{s.v}</div>
                  <div className="text-xs text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} className="relative">
            <Card className="glass p-8 relative" style={{ boxShadow: "var(--shadow-elegant)" }}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Health Score</div>
                  <div className="text-sm font-medium">Today's overview</div>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: "var(--gradient-primary)" }}>
                  <HeartPulse className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center py-4">
                <RingProgress value={87} size={180} stroke={14} sub="out of 100" />
              </div>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {[{l:"Steps",v:"8,420"},{l:"Sleep",v:"7.5h"},{l:"Water",v:"2.1L"}].map((m) => (
                  <div key={m.l} className="rounded-lg p-3 text-center" style={{ background: "color-mix(in oklab, var(--primary) 8%, transparent)" }}>
                    <div className="text-sm font-semibold">{m.v}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.l}</div>
                  </div>
                ))}
              </div>
            </Card>
            <div className="absolute -bottom-6 -left-6 hidden md:block">
              <Card className="glass p-4 flex items-center gap-3" style={{ boxShadow: "var(--shadow-elegant)" }}>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center text-white" style={{ background: "var(--gradient-primary)" }}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">10K steps unlocked</div>
                  <div className="text-xs text-muted-foreground">+50 XP earned</div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Everything you need</div>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">One app for every health metric</h2>
          <p className="text-muted-foreground mt-3">Designed for clarity. Built for daily use. Powered by your data.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={f.title} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow" style={{ background: "var(--gradient-card)" }}>
                  <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "color-mix(in oklab, var(--primary) 15%, transparent)", color: "var(--primary)" }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="font-semibold mb-1">{f.title}</div>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Insights */}
      <section className="bg-muted/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 grid md:grid-cols-3 gap-6">
          {[
            { icon: ShieldCheck, title: "Private by design", desc: "Your data lives on your device. No accounts required to start." },
            { icon: Sparkles, title: "AI insights", desc: "Conversational tips on diet, fitness and recovery." },
            { icon: Trophy, title: "Stay motivated", desc: "Streaks, badges and XP that make healthy habits stick." },
          ].map((b) => {
            const I = b.icon;
            return (
              <Card key={b.title} className="p-6">
                <I className="h-6 w-6 text-primary mb-3" />
                <div className="font-semibold mb-1">{b.title}</div>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Loved by health-conscious people</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <Card key={t.name} className="p-6" style={{ background: "var(--gradient-card)" }}>
              <p className="text-sm leading-relaxed">"{t.quote}"</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: "var(--gradient-primary)" }}>{t.name.charAt(0)}</div>
                <div>
                  <div className="text-sm font-semibold">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
        <Card className="p-10 lg:p-16 text-center relative overflow-hidden" style={{ background: "var(--gradient-primary)", color: "white" }}>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight">Take control of your health today</h2>
          <p className="mt-3 opacity-90 max-w-xl mx-auto">Start free in 30 seconds. No credit card. Your data, your device.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/signup"><Button size="lg" variant="secondary">Create account</Button></Link>
            <Link to="/dashboard"><Button size="lg" variant="outline" className="bg-white/10 text-white border-white/30 hover:bg-white/20">Try dashboard</Button></Link>
          </div>
        </Card>
      </section>

      <PublicFooter />
    </div>
  );
}
