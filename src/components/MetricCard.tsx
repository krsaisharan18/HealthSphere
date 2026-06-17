import { Card } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

export function MetricCard({
  icon: Icon, label, value, unit, accent = "primary", trend, onClick,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  accent?: "primary" | "secondary" | "warn" | "danger";
  trend?: string;
  onClick?: () => void;
}) {
  const colors: Record<string, string> = {
    primary: "oklch(0.62 0.16 165)",
    secondary: "oklch(0.55 0.18 235)",
    warn: "oklch(0.68 0.18 50)",
    danger: "oklch(0.62 0.22 25)",
  };
  return (
    <motion.div whileHover={{ y: -3 }} onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
      <Card className="p-5 relative overflow-hidden" style={{ background: "var(--gradient-card)", boxShadow: "var(--shadow-soft)" }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase tracking-wider text-muted-foreground font-medium">{label}</span>
          <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `color-mix(in oklab, ${colors[accent]} 15%, transparent)`, color: colors[accent] }}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-1.5">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {unit && <div className="text-sm text-muted-foreground">{unit}</div>}
        </div>
        {trend && <div className="text-xs text-muted-foreground mt-1">{trend}</div>}
      </Card>
    </motion.div>
  );
}