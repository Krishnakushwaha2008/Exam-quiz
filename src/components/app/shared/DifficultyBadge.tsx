import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types";

const config: Record<Difficulty, { label: string; className: string }> = {
  EASY: {
    label: "Easy",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  MEDIUM: {
    label: "Medium",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  HARD: {
    label: "Hard",
    className:
      "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
};

export function DifficultyBadge({
  difficulty,
  className,
}: {
  difficulty: Difficulty;
  className?: string;
}) {
  const c = config[difficulty];
  return (
    <Badge variant="outline" className={cn("font-medium", c.className, className)}>
      {c.label}
    </Badge>
  );
}
