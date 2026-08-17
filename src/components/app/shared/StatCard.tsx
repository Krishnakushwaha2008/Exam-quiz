import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  accent = "primary",
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
  hint?: string;
  accent?: "primary" | "gold" | "success" | "warning";
  className?: string;
}) {
  const accents: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  };
  return (
    <Card className={cn("relative overflow-hidden p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold tracking-tight tabular-nums">
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl",
            accents[accent],
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}
