import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

export function ChartCard({ title, subtitle, children, action }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <Card className="p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="font-semibold tracking-tight">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground">{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}