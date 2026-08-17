import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showWordmark = true,
  size = "md",
}: {
  className?: string;
  showWordmark?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  const dim =
    size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "sm" ? 18 : size === "lg" ? 26 : 22;
  const text = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "relative grid place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm",
          "ring-1 ring-primary/30",
          dim,
        )}
      >
        <GraduationCap
          className="h-auto w-auto"
          style={{ width: icon, height: icon }}
          strokeWidth={2.2}
        />
        <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-gold ring-2 ring-background" />
      </div>
      {showWordmark && (
        <div className="leading-none">
          <span className={cn("font-semibold tracking-tight", text)}>
            Scholar<span className="text-primary">Ex</span>
          </span>
          <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Examination Suite
          </span>
        </div>
      )}
    </div>
  );
}
