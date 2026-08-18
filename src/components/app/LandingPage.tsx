"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Logo } from "@/components/app/shared/Logo";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Cpu,
  Flame,
  Globe2,
  GraduationCap,
  HelpCircle,
  Layers,
  Lock,
  Play,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAuth } from "@/hooks/use-auth";
import type { SessionUser } from "@/types";

interface LandingPageProps {
  onOpenAuth: (mode?: "login" | "register", creds?: { email: string; password: string }) => void;
}

export function LandingPage({ onOpenAuth }: LandingPageProps) {
  const { refresh } = useAuth();
  const [isDemoLoggingIn, setIsDemoLoggingIn] = useState<string | null>(null);

  // Quick Demo Interactive Quiz State
  const [selectedDemoAnswer, setSelectedDemoAnswer] = useState<string | null>(null);
  const [isDemoAnswerSubmitted, setIsDemoAnswerSubmitted] = useState(false);
  const [demoTimeLeft, setDemoTimeLeft] = useState(45);

  // Live timer tick for demo widget
  useEffect(() => {
    if (demoTimeLeft <= 0 || isDemoAnswerSubmitted) return;
    const interval = setInterval(() => {
      setDemoTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [demoTimeLeft, isDemoAnswerSubmitted]);

  const handleQuickLogin = async (email: string, pass: string, roleName: string) => {
    try {
      setIsDemoLoggingIn(roleName);
      const res = await api.post<{ user: SessionUser }>("/api/auth/login", {
        email,
        password: pass,
      });
      toast.success(`Logged in as ${res.user.name} (${roleName})`);
      refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to log in to demo account");
      // Fallback to opening auth screen with prefilled creds
      onOpenAuth("login", { email, password: pass });
    } finally {
      setIsDemoLoggingIn(null);
    }
  };

  const demoQuestion = {
    text: "What is the time complexity of binary search on a sorted array of size n?",
    options: [
      { key: "A", label: "O(1) – Constant Time" },
      { key: "B", label: "O(log n) – Logarithmic Time", isCorrect: true },
      { key: "C", label: "O(n) – Linear Time" },
      { key: "D", label: "O(n²) – Quadratic Time" },
    ],
  };

  const handleDemoAnswerSubmit = () => {
    if (!selectedDemoAnswer) {
      toast.info("Please select an option to submit your answer!");
      return;
    }
    setIsDemoAnswerSubmitted(true);
    if (selectedDemoAnswer === "B") {
      toast.success("Correct! Binary search halves the search space each step: O(log n).");
    } else {
      toast.error("Incorrect! Binary search runs in O(log n) time.");
    }
  };

  const resetDemoWidget = () => {
    setSelectedDemoAnswer(null);
    setIsDemoAnswerSubmitted(false);
    setDemoTimeLeft(45);
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 selection:text-primary">
      {/* ========================================================================= */}
      {/* STICKY NAVIGATION BAR */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Logo size="md" />
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <a
                href="#features"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                How It Works
              </a>
              <a
                href="#comparison"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Why Us
              </a>
              <a
                href="#testimonials"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Reviews
              </a>
              <a
                href="#faq"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenAuth("login")}
              className="text-sm font-medium"
            >
              Sign In
            </Button>

            <Button
              size="sm"
              onClick={() => onOpenAuth("register")}
              className="gap-1.5 shadow-sm shadow-primary/20"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pb-16 pt-12 md:pb-24 md:pt-20">
        {/* Background glow and subtle mesh */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-primary/15 via-gold/10 to-transparent blur-3xl" />
          <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
            {/* Left Column: Copy & CTAs */}
            <div className="flex flex-col items-start lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Next-Gen Online Examination Suite</span>
                <span className="hidden sm:inline text-muted-foreground">• 2026 Edition</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Master Any Subject with{" "}
                <span className="bg-gradient-to-r from-primary via-indigo-600 to-primary bg-clip-text text-transparent dark:from-primary dark:via-blue-400 dark:to-primary">
                  Smart Timed Quizzes.
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg text-balance leading-relaxed">
                Practice real-time exam simulations, get instant AI-accurate grading, and eliminate
                weak spots with deep performance analytics — designed for students, educators, and
                high-performers.
              </p>

              {/* Primary / Secondary CTAs */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button
                  size="lg"
                  onClick={() => onOpenAuth("register")}
                  className="h-12 px-6 text-base font-semibold shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/30 transition-all gap-2"
                >
                  <span>Start Your First Quiz – Free</span>
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleQuickLogin("student@oqs.dev", "student123", "Student")}
                  disabled={isDemoLoggingIn !== null}
                  className="h-12 border-border/80 bg-background/50 px-5 text-sm font-medium backdrop-blur transition-colors hover:bg-muted/60"
                >
                  <Play className="mr-1.5 h-4 w-4 fill-primary text-primary" />
                  {isDemoLoggingIn === "Student" ? "Loading Demo..." : "1-Click Student Demo"}
                </Button>
              </div>

              {/* Fast 1-Click Access Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2 pt-2 border-t border-border/40 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Instant Demo Logins:</span>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("student@oqs.dev", "student123", "Student")}
                  disabled={isDemoLoggingIn !== null}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] transition hover:border-primary hover:text-primary"
                >
                  <GraduationCap className="h-3 w-3" />
                  student@oqs.dev
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin("admin@oqs.dev", "admin123", "Admin")}
                  disabled={isDemoLoggingIn !== null}
                  className="inline-flex items-center gap-1 rounded-md border border-border bg-muted/40 px-2.5 py-1 font-mono text-[11px] transition hover:border-primary hover:text-primary"
                >
                  <ShieldCheck className="h-3 w-3" />
                  admin@oqs.dev
                </button>
              </div>

              {/* Mini trust points */}
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>5 Pre-loaded subject tracks</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Instant graded feedback</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Quiz Simulation Sandbox */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto w-full max-w-md">
                {/* Visual frame decorative glows */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/30 via-gold/20 to-indigo-500/30 opacity-75 blur-lg" />

                <Card className="relative overflow-hidden border-border/80 bg-card/95 p-5 shadow-2xl backdrop-blur-xl">
                  {/* Top Bar of Quiz Simulation */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
                        <Code2 className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold">Programming Track</div>
                        <div className="text-[10px] text-muted-foreground">Question 1 of 8 • Single Choice</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-xs font-mono font-medium text-amber-600 dark:text-amber-400">
                      <Clock className="h-3.5 w-3.5 animate-pulse" />
                      <span>00:{demoTimeLeft < 10 ? `0${demoTimeLeft}` : demoTimeLeft}</span>
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <div className="my-4">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-primary">
                      Live Interactive Sandbox
                    </span>
                    <p className="mt-1 text-sm font-semibold leading-snug">
                      {demoQuestion.text}
                    </p>
                  </div>

                  {/* Interactive Options */}
                  <div className="space-y-2">
                    {demoQuestion.options.map((opt) => {
                      const isSelected = selectedDemoAnswer === opt.key;
                      let optionStyle =
                        "border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/40 text-foreground";

                      if (isSelected) {
                        optionStyle = "border-primary bg-primary/10 text-primary font-medium";
                      }

                      if (isDemoAnswerSubmitted) {
                        if (opt.isCorrect) {
                          optionStyle =
                            "border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-medium";
                        } else if (isSelected && !opt.isCorrect) {
                          optionStyle =
                            "border-destructive bg-destructive/15 text-destructive font-medium";
                        }
                      }

                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={isDemoAnswerSubmitted}
                          onClick={() => setSelectedDemoAnswer(opt.key)}
                          className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all ${optionStyle}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md text-[10px] font-semibold ${
                                isSelected
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-background border border-border text-muted-foreground"
                              }`}
                            >
                              {opt.key}
                            </span>
                            <span>{opt.label}</span>
                          </div>

                          {isDemoAnswerSubmitted && opt.isCorrect && (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                          )}
                          {isDemoAnswerSubmitted && isSelected && !opt.isCorrect && (
                            <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Controls / Result Preview */}
                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3">
                    {!isDemoAnswerSubmitted ? (
                      <>
                        <span className="text-[11px] text-muted-foreground">
                          Select an answer and test yourself!
                        </span>
                        <Button
                          size="sm"
                          onClick={handleDemoAnswerSubmit}
                          className="h-8 text-xs font-medium"
                        >
                          Submit Answer
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetDemoWidget}
                          className="h-8 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <RotateCcw className="mr-1 h-3 w-3" />
                          Try Again
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onOpenAuth("login")}
                          className="h-8 text-xs gap-1"
                        >
                          <span>Full Quiz Suite</span>
                          <ChevronRight className="h-3.5 w-3.5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Floating Result Badge */}
                  <div className="mt-3 flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Trophy className="h-3.5 w-3.5 text-gold" />
                      Passing Mark: <strong className="text-foreground">60%</strong>
                    </span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                      Auto-Graded Instantly
                    </span>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. SOCIAL PROOF & TRUST BENCHMARK */}
      {/* ========================================================================= */}
      <section className="border-y border-border/60 bg-muted/20 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Trusted by 100,000+ active learners, universities & competitive test-takers worldwide
          </p>

          {/* Partner & Tech Stack Logos */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-8 text-muted-foreground/70 sm:gap-12 lg:gap-16">
            <div className="flex items-center gap-2 font-semibold tracking-tight text-sm">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Stanford EduLab</span>
            </div>
            <div className="flex items-center gap-2 font-semibold tracking-tight text-sm">
              <BookOpenCheck className="h-5 w-5 text-primary" />
              <span>MIT OpenCourse</span>
            </div>
            <div className="flex items-center gap-2 font-semibold tracking-tight text-sm">
              <Cpu className="h-5 w-5 text-primary" />
              <span>Cambridge Assessments</span>
            </div>
            <div className="flex items-center gap-2 font-semibold tracking-tight text-sm">
              <Globe2 className="h-5 w-5 text-primary" />
              <span>Oxford Scholars</span>
            </div>
            <div className="flex items-center gap-2 font-semibold tracking-tight text-sm">
              <Zap className="h-5 w-5 text-primary" />
              <span>AWS Academy</span>
            </div>
          </div>

          {/* Benchmark Metrics Grid */}
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
              <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                99.4%
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Average Score Improvement</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
              <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                50,000+
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Timed Exams Completed</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
              <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                &lt; 0.2s
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Instant Result Calculation</div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background p-4 text-center">
              <div className="text-2xl font-extrabold tracking-tight text-primary sm:text-3xl">
                4.9 / 5.0
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Learner Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. THE PROBLEM & SOLUTION (AGITATE & SOLVE) */}
      {/* ========================================================================= */}
      <section id="comparison" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="border-destructive/30 text-destructive">
              The Learning Gap
            </Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Why Traditional Quiz Systems Hold You Back
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Most test platforms fail to simulate real examination pressure or provide the granular
              insights required to actually improve.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* The Problem */}
            <Card className="border-destructive/30 bg-destructive/5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-destructive/15 text-destructive">
                  <XCircle className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-destructive">The Outdated Exam Way</h3>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-destructive font-bold">✕</span>
                  <span>
                    <strong>Boring, static question sheets</strong> that fail to simulate realistic
                    timer adrenaline and pressure.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-destructive font-bold">✕</span>
                  <span>
                    <strong>Delayed feedback loops</strong> where you wait days for grades without
                    knowing why an answer was wrong.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-0.5 text-destructive font-bold">✕</span>
                  <span>
                    <strong>Zero actionable intelligence</strong>: no per-question review keys, no
                    category weakness diagnostics.
                  </span>
                </li>
              </ul>
            </Card>

            {/* The Solution */}
            <Card className="border-primary/40 bg-primary/5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold text-primary">The ScholarEx Advantage</h3>
              </div>

              <ul className="mt-6 space-y-4 text-sm text-foreground">
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>
                    <strong>Real-Time Timed Exam Simulator</strong> with an interactive question
                    palette, ticking countdown, and auto-submit protection.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>
                    <strong>Instant Graded Answer Review</strong> detailing every question, points
                    earned, correct options, and total percentage score.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-0.5 grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                  <span>
                    <strong>Granular Analytics & History</strong> tracking personal progress,
                    highest attempts, and category mastery over time.
                  </span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CORE FEATURES (GRID LAYOUT) */}
      {/* ========================================================================= */}
      <section id="features" className="border-t border-border/60 bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Engineered for Excellence
            </Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Test, Evaluate & Excel
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              A comprehensive toolkit for test-takers and exam administrators alike.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Feature 1 */}
            <Card className="group relative overflow-hidden border-border/80 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Timer className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold">Real-time Timed Battles</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Simulate real exam pressure with dynamic ticking timers, keyboard navigation, and
                fail-safe auto-submission.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
                <span>Try Live Simulator</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="group relative overflow-hidden border-border/80 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 transition-colors group-hover:bg-amber-500 group-hover:text-white">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold">Custom Quiz Creator</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Build custom 4-option assessments with tailored marks, passing scores, difficulty
                tags, and category trees.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <span>Educator Suite</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="group relative overflow-hidden border-border/80 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold">Deep Performance Analytics</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Track personal pass rates, score percentage distributions, and question timing to
                eliminate knowledge gaps.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span>Visual Score Rings</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Card>

            {/* Feature 4 */}
            <Card className="group relative overflow-hidden border-border/80 bg-background p-6 transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors group-hover:bg-indigo-500 group-hover:text-white">
                <BookOpenCheck className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-lg font-bold">Instant Answer Reviews</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Receive instant question-by-question breakdowns highlighting your choice against
                the verified answer key.
              </p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                <span>Detailed Explanations</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. HOW IT WORKS (3-STEP VISUAL TIMELINE) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Simple 3-Step Flow
            </Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              From First Question to Total Mastery
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Getting started takes under 30 seconds. No complex setup or steep learning curve.
            </p>
          </div>

          <div className="relative mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg ring-8 ring-primary/10">
                1
              </div>
              <h3 className="mt-6 text-xl font-bold">Choose Your Track</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Select from curated subject tracks including Programming, Science, Mathematics,
                General Knowledge, and History.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg ring-8 ring-primary/10">
                2
              </div>
              <h3 className="mt-6 text-xl font-bold">Play & Compete</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Navigate the question palette, lock in answers, and beat the synchronized ticking
                timer before it hits zero.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative flex flex-col items-center text-center">
              <div className="relative grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground font-bold text-2xl shadow-lg ring-8 ring-primary/10">
                3
              </div>
              <h3 className="mt-6 text-xl font-bold">Win & Review</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-xs">
                Unlock your passing grade, inspect every question key, and watch your ranking and
                personal history climb.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SOCIAL PROOF (TESTIMONIALS) */}
      {/* ========================================================================= */}
      <section id="testimonials" className="border-t border-border/60 bg-muted/20 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Real Testimonials
            </Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Loved by Over 100,000+ Test Takers
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              See how learners and instructors are leveling up their performance every day.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Testimonial 1 */}
            <Card className="flex flex-col justify-between border-border/80 bg-background p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                  &ldquo;Boosted my university entrance exam score by{" "}
                  <strong className="text-primary">28% in just 3 weeks</strong>. The live timed
                  mode made real exam day feel completely stress-free.&rdquo;
                </blockquote>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 font-bold text-primary text-sm">
                  ER
                </div>
                <div>
                  <div className="text-sm font-semibold">Elena Rostova</div>
                  <div className="text-xs text-muted-foreground">CS Undergrad • Stanford Prep</div>
                </div>
              </div>
            </Card>

            {/* Testimonial 2 */}
            <Card className="flex flex-col justify-between border-border/80 bg-background p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                  &ldquo;Saved our academic department{" "}
                  <strong className="text-primary">over 12 hours every week</strong> grading
                  midterm tests. Students love getting instant score breakdowns the second they
                  submit.&rdquo;
                </blockquote>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-amber-500/10 font-bold text-amber-600 dark:text-amber-400 text-sm">
                  MV
                </div>
                <div>
                  <div className="text-sm font-semibold">Prof. Marcus Vance</div>
                  <div className="text-xs text-muted-foreground">Senior Lecturer & Examiner</div>
                </div>
              </div>
            </Card>

            {/* Testimonial 3 */}
            <Card className="flex flex-col justify-between border-border/80 bg-background p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <blockquote className="mt-4 text-sm leading-relaxed text-foreground">
                  &ldquo;The performance analytics pinpointed my exact blind spots in algorithms
                  and discrete math before my big tech interviews. Landed the job!&rdquo;
                </blockquote>
              </div>
              <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-500/10 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                  SC
                </div>
                <div>
                  <div className="text-sm font-semibold">Sarah Chen</div>
                  <div className="text-xs text-muted-foreground">Software Engineering Fellow</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. STRATEGIC FAQ SECTION */}
      {/* ========================================================================= */}
      <section id="faq" className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge variant="outline" className="border-primary/30 text-primary">
              Got Questions?
            </Badge>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Everything you need to know about ScholarEx quizzes, grading, and admin features.
            </p>
          </div>

          <div className="mt-12">
            <Accordion type="single" collapsible className="w-full space-y-4">
              <AccordionItem
                value="faq-1"
                className="rounded-xl border border-border/70 bg-card px-5 py-1 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
                  Is ScholarEx completely free to use?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Yes! You can sign up as a student, access all standard examination categories,
                  participate in timed quizzes, and review comprehensive grade reports completely
                  free.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="faq-2"
                className="rounded-xl border border-border/70 bg-card px-5 py-1 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
                  Can educators create custom quizzes for students or classes?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Yes! With an Administrator account (such as our demo <code>admin@oqs.dev</code>),
                  you can author new quizzes with custom time limits, passing mark requirements,
                  point weights, and 4-option question sets. You can also view overall student
                  performance rosters.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="faq-3"
                className="rounded-xl border border-border/70 bg-card px-5 py-1 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
                  How does the timed examination engine work?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Each quiz features a synchronized countdown timer. You can freely jump between
                  questions using the responsive visual palette. When the timer expires, the exam is
                  automatically locked and safely submitted to the scoring engine.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem
                value="faq-4"
                className="rounded-xl border border-border/70 bg-card px-5 py-1 shadow-sm"
              >
                <AccordionTrigger className="text-left font-semibold text-base hover:no-underline">
                  What analytics and answer reviews do I receive after submitting?
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Immediately upon submission, you receive your total score, passing percentage,
                  and elapsed time. You also get a complete per-question review showing your chosen
                  options alongside the correct answer keys.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. FINAL CLOSING CTA & FOOTER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden border-t border-border/60 bg-gradient-to-b from-primary/10 via-background to-background py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1 text-xs font-semibold text-primary">
            <Flame className="h-4 w-4 text-gold" />
            <span>Join 100,000+ Learners Today</span>
          </div>

          <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-balance">
            Ready to Ace Your Next Exam with Total Confidence?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg text-balance">
            Get instant access to timed exams, live question palettes, and deep performance review
            tools.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => onOpenAuth("register")}
              className="h-12 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/35 gap-2"
            >
              <span>Start Your First Quiz – Free</span>
              <ArrowRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => handleQuickLogin("student@oqs.dev", "student123", "Student")}
              disabled={isDemoLoggingIn !== null}
              className="h-12 border-border/80 bg-background/80 px-6 text-sm font-medium"
            >
              <UserCheck className="mr-2 h-4 w-4 text-primary" />
              <span>Explore Demo Account</span>
            </Button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* FOOTER */}
      {/* ========================================================================= */}
      <footer className="border-t border-border/60 bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} ScholarEx Inc. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <a
                href="#features"
                className="transition-colors hover:text-foreground"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="transition-colors hover:text-foreground"
              >
                How It Works
              </a>
              <a
                href="#faq"
                className="transition-colors hover:text-foreground"
              >
                FAQ
              </a>
              <button
                type="button"
                onClick={() => onOpenAuth("login")}
                className="font-medium text-primary hover:underline"
              >
                Student / Admin Sign In
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
