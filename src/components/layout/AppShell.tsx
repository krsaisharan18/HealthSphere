import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/contexts/AppContext";
import {
  LayoutDashboard, Footprints, HeartPulse, Activity, Droplet, Moon, Dumbbell,
  Apple, UtensilsCrossed, Pill, CalendarCheck, FileText, Bot, Target, Trophy,
  Bell, Settings, User as UserIcon, LogOut, Sun, Calculator, Gauge, ShieldCheck,
  Menu, X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/steps", label: "Steps", icon: Footprints },
  { to: "/heart", label: "Heart Rate", icon: HeartPulse },
  { to: "/bp", label: "Blood Pressure", icon: Activity },
  { to: "/sugar", label: "Blood Sugar", icon: Gauge },
  { to: "/bmi", label: "BMI", icon: Calculator },
  { to: "/water", label: "Water", icon: Droplet },
  { to: "/sleep", label: "Sleep", icon: Moon },
  { to: "/workouts", label: "Workouts", icon: Dumbbell },
  { to: "/calories", label: "Calories", icon: Apple },
  { to: "/diet", label: "Diet Planner", icon: UtensilsCrossed },
  { to: "/medications", label: "Medications", icon: Pill },
  { to: "/appointments", label: "Appointments", icon: CalendarCheck },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/achievements", label: "Achievements", icon: Trophy },
] as const;

export function AppShell({ children, title }: { children: ReactNode; title?: string }) {
  const { user, logout, theme, setTheme } = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  if (!user) {
    if (typeof window !== "undefined") navigate({ to: "/login" });
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 z-40 h-screen w-72 shrink-0 border-r border-sidebar-border bg-sidebar transition-transform ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="flex h-16 items-center gap-2 px-6 border-b border-sidebar-border">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: "var(--gradient-primary)", boxShadow: "var(--shadow-glow)" }}>
            <HeartPulse className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sidebar-foreground tracking-tight">Health Sphere</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Premium Health OS</div>
          </div>
        </div>
        <nav className="p-3 overflow-y-auto h-[calc(100vh-4rem-5rem)] no-scrollbar">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 my-0.5 text-sm font-medium transition-colors ${active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent"}`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-sidebar-border p-3 bg-sidebar">
          <Link to="/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-sidebar-accent">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground truncate">{user.email}</div>
            </div>
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 glass border-b border-border h-16 flex items-center px-4 lg:px-8 gap-3">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen((o) => !o)}>
            {open ? <X /> : <Menu />}
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold tracking-tight">{title ?? "Dashboard"}</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Link to="/notifications"><Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button></Link>
          <Link to="/settings"><Button variant="ghost" size="icon"><Settings className="h-4 w-4" /></Button></Link>
          {user.role === "admin" && <Link to="/admin"><Button variant="ghost" size="icon"><ShieldCheck className="h-4 w-4" /></Button></Link>}
          <Link to="/profile"><Button variant="ghost" size="icon"><UserIcon className="h-4 w-4" /></Button></Link>
          <Button variant="ghost" size="icon" onClick={() => { logout(); navigate({ to: "/login" }); }}><LogOut className="h-4 w-4" /></Button>
        </header>
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="p-4 lg:p-8 max-w-7xl mx-auto"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}