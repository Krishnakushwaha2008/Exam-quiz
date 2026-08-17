import { cn } from "@/lib/utils";

/** Circular SVG progress ring used for scores & percentages. */
export function ScoreRing({
  value,
  size = 140,
  stroke = 12,
  label,
  sublabel,
  status,
  className,
}: {
  value: number; // 0-100
  size?: number;
  stroke?: number;
  label?: string;
  sublabel?: string;
  status?: "PASS" | "FAIL";
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = c - (clamped / 100) * c;

  const color =
    status === "FAIL"
      ? "oklch(0.58 0.22 25)"
      : clamped >= 60
        ? "oklch(0.55 0.13 158)"
        : "oklch(0.78 0.16 70)";

  return (
    <div
      className={cn("relative grid place-items-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--muted)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums">{label ?? `${Math.round(clamped)}%`}</span>
        {sublabel && (
          <span className="mt-0.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
}
