import { Logo } from "@/components/app/shared/Logo";
import { ShieldCheck, Timer, ChartBar } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/70 bg-card/40">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-sm">
            <Logo size="sm" />
            <p className="mt-3 text-sm text-muted-foreground">
              A secure, modern examination platform for students and educators.
              Take timed quizzes, get instant results, and track progress over
              time.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FooterItem
              icon={ShieldCheck}
              title="Secure & Validated"
              desc="Zod-validated input, hashed passwords, JWT sessions."
            />
            <FooterItem
              icon={Timer}
              title="Timed Exams"
              desc="Auto-submit on timeout with a live question palette."
            />
            <FooterItem
              icon={ChartBar}
              title="Instant Analytics"
              desc="Per-question review and pass-rate analytics."
            />
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} ScholarEx Examination Suite. Built
            with Next.js 16, Prisma & Tailwind CSS.
          </p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            All systems operational
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterItem({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ElementType;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}
