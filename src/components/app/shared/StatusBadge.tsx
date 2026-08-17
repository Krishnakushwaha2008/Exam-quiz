import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ExamStatus } from "@/types";

export function StatusBadge({
  status,
  className,
}: {
  status: ExamStatus;
  className?: string;
}) {
  if (status === "PASS") {
    return (
      <Badge
        className={cn(
          "gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
          className,
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5" />
        Passed
      </Badge>
    );
  }
  return (
    <Badge
      className={cn(
        "gap-1 border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
        className,
      )}
    >
      <XCircle className="h-3.5 w-3.5" />
      Failed
    </Badge>
  );
}
