"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/lib/fetch";
import { Logo } from "@/components/app/shared/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  BookOpenCheck,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Timer,
  TrendingUp,
} from "lucide-react";
import type { SessionUser } from "@/types";

export function AuthScreen() {
  const { refresh } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  const onDone = (user: SessionUser) => {
    toast.success(
      tab === "login" ? `Welcome back, ${user.name.split(" ")[0]}!` : "Account created — welcome aboard!",
    );
    refresh();
  };

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* ===================== Hero / brand panel ===================== */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-primary p-10 text-primary-foreground lg:flex">
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-emerald-300/20 blur-3xl" />

        <div className="relative">
          <Logo size="lg" className="[&_*]:!text-primary-foreground" />
        </div>

        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Online Examination Platform
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-balance">
            Where knowledge meets its measure.
          </h1>
          <p className="mt-4 text-base text-primary-foreground/80">
            Take timed quizzes, get instant graded results with per-question
            review, and watch your progress climb with detailed analytics —
            all in one focused, modern workspace.
          </p>

          <ul className="mt-8 space-y-3">
            {[
              { icon: Timer, text: "Timed exams with auto-submit & a live question palette" },
              { icon: BookOpenCheck, text: "Per-question answer review & instant scoring" },
              { icon: TrendingUp, text: "Track best scores and personal progress over time" },
              { icon: ShieldCheck, text: "Secure JWT sessions with role-based access control" },
            ].map((f) => (
              <li key={f.text} className="flex items-start gap-3">
                <div className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-white/15">
                  <f.icon className="h-4 w-4" />
                </div>
                <span className="text-sm text-primary-foreground/90">{f.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} ScholarEx. Built for students & educators.
        </div>
      </aside>

      {/* ===================== Auth form panel ===================== */}
      <div className="flex flex-col items-center justify-center bg-background px-4 py-10 sm:px-6">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <Logo size="md" />
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight">
              {tab === "login" ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tab === "login"
                ? "Enter your credentials below to continue."
                : "Register as a student to start taking quizzes."}
            </p>
          </div>

          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "register")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign in</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <LoginForm onDone={onDone} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onDone={onDone} switchToLogin={() => setTab("login")} />
            </TabsContent>
          </Tabs>

          <DemoAccountsCard onPick={(email, pw) => {}} />
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onDone }: { onDone: (u: SessionUser) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await api<SessionUser>("/api/auth/login", {
        method: "POST",
        json: { email, password },
      });
      onDone(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <Field label="Email">
        <Input
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Password">
        <Input
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </Field>
      {error && <ErrorBanner message={error} />}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

function RegisterForm({
  onDone,
  switchToLogin,
}: {
  onDone: (u: SessionUser) => void;
  switchToLogin: () => void;
}) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await api<SessionUser>("/api/auth/register", {
        method: "POST",
        json: form,
      });
      onDone(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-4 space-y-4">
      <Field label="Full name">
        <Input
          required
          minLength={2}
          value={form.name}
          onChange={set("name")}
          placeholder="Jane Doe"
        />
      </Field>
      <Field label="Email">
        <Input
          type="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={set("email")}
          placeholder="you@example.com"
        />
      </Field>
      <Field label="Password" hint="At least 6 characters.">
        <Input
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          value={form.password}
          onChange={set("password")}
          placeholder="••••••••"
        />
      </Field>
      {error && <ErrorBanner message={error} />}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating account…" : "Create student account"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <button
          type="button"
          onClick={switchToLogin}
          className="font-medium text-primary hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
      {message}
    </div>
  );
}

function DemoAccountsCard({ onPick }: { onPick: (email: string, pw: string) => void }) {
  return (
    <Card className="mt-6 border-dashed bg-muted/30 p-4">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <GraduationCap className="h-4 w-4" />
        Demo accounts
      </div>
      <ul className="space-y-1.5 text-sm">
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">
            Student: <span className="font-mono text-foreground">student@oqs.dev</span> /{" "}
            <span className="font-mono text-foreground">student123</span>
          </span>
        </li>
        <li className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">
            Admin: <span className="font-mono text-foreground">admin@oqs.dev</span> /{" "}
            <span className="font-mono text-foreground">admin123</span>
          </span>
        </li>
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Use these credentials to explore both the student and admin experiences.
      </p>
    </Card>
  );
}
