"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BookOpen,
  ClipboardCheck,
  Loader2,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAuth } from "@/hooks/use-auth";
import { useAppStore } from "@/store/app";
import { formatDateTime, formatRelativeDate } from "@/lib/format";
import type { QuizListItem, ResultListItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ResponsiveContainer,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
} from "recharts";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { StatCard } from "@/components/app/shared/StatCard";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { DifficultyBadge } from "@/components/app/shared/DifficultyBadge";
import { EmptyState } from "@/components/app/shared/EmptyState";

export function DashboardView() {
  const { user } = useAuth();
  const navigate = useAppStore((s) => s.navigate);
  const showInstructions = useAppStore((s) => s.showInstructions);

  const resultsQ = useQuery({
    queryKey: ["results"],
    queryFn: () => api<{ results: ResultListItem[] }>("/api/results"),
  });
  const quizzesQ = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => api<{ quizzes: QuizListItem[] }>("/api/quizzes"),
  });

  const results = resultsQ.data?.results ?? [];
  const quizzes = quizzesQ.data?.quizzes ?? [];

  const attempts = results.length;
  const avg =
    attempts > 0
      ? Number(
          (results.reduce((a, r) => a + r.percentage, 0) / attempts).toFixed(1),
        )
      : 0;
  const best = attempts > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;
  const passed = results.filter((r) => r.status === "PASS").length;
  const passRate = attempts > 0 ? Math.round((passed / attempts) * 100) : 0;

  const chartData = [...results]
    .sort((a, b) => +new Date(a.attemptedAt) - +new Date(b.attemptedAt))
    .map((r, i) => ({
      index: i + 1,
      score: r.percentage,
      label: r.quizTitle,
      date: formatRelativeDate(r.attemptedAt),
    }));

  const recommended = quizzes
    .filter((q) => !q.bestAttempt)
    .slice(0, 3);
  const recent = [...results].slice(0, 4);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title={`Welcome back, ${user?.name.split(" ")[0] ?? "Student"} 👋`}
        description="Here's a snapshot of your examination progress and what to tackle next."
        icon={Sparkles}
        actions={
          <Button onClick={() => navigate("quizzes")}>
            <BookOpen className="mr-2 h-4 w-4" />
            Browse quizzes
          </Button>
        }
      />

      {/* Stats */}
      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={ClipboardCheck}
          label="Quizzes attempted"
          value={attempts}
          hint={attempts === 0 ? "Take your first quiz today" : `${passed} passed`}
          accent="primary"
        />
        <StatCard
          icon={TrendingUp}
          label="Average score"
          value={`${avg}%`}
          hint="Across all attempts"
          accent="gold"
        />
        <StatCard
          icon={Award}
          label="Best score"
          value={`${best}%`}
          hint={attempts === 0 ? "No attempts yet" : "Your personal best"}
          accent="success"
        />
        <StatCard
          icon={TrendingUp}
          label="Pass rate"
          value={`${passRate}%`}
          hint={`${passed}/${attempts} passed`}
          accent="warning"
        />
      </section>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Progress chart */}
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Score progression</h3>
              <p className="text-sm text-muted-foreground">
                Your percentage across recent attempts.
              </p>
            </div>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          {chartData.length === 0 ? (
            <EmptyState
              icon={TrendingUp}
              title="No attempts yet"
              description="Once you complete a quiz, your score progression will appear here."
            />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="oklch(0.52 0.12 162)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="oklch(0.52 0.12 162)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="index" tickLine={false} axisLine={false} fontSize={12} />
                  <YAxis domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                  <RTooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--card)",
                      color: "var(--card-foreground)",
                      fontSize: 12,
                    }}
                    labelFormatter={(l) => `Attempt #${l}`}
                    formatter={(v: number, _i, p) => [`${v}%`, p?.payload?.label ?? "Score"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="oklch(0.52 0.12 162)"
                    strokeWidth={2.5}
                    fill="url(#scoreGrad)"
                    dot={{ r: 3, fill: "oklch(0.52 0.12 162)" }}
                    activeDot={{ r: 5 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        {/* Recommended */}
        <Card className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Recommended for you</h3>
              <p className="text-sm text-muted-foreground">Not attempted yet.</p>
            </div>
            <Sparkles className="h-5 w-5 text-gold" />
          </div>
          {recommended.length === 0 ? (
            <EmptyState
              icon={Award}
              title="All caught up!"
              description="You've attempted every available quiz. Revisit one to beat your best score."
            />
          ) : (
            <ul className="space-y-3">
              {recommended.map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => showInstructions(q.id)}
                    className="group w-full rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/40"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="line-clamp-1 font-medium">{q.title}</p>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{q.category}</span>
                      <span>•</span>
                      <span>{q.questionCount} questions</span>
                      <span>•</span>
                      <span>{q.duration} min</span>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Recent attempts */}
      <section className="mt-8">
        <h3 className="mb-3 font-semibold">Recent attempts</h3>
        {recent.length === 0 ? (
          <EmptyState
            icon={ClipboardCheck}
            title="No attempts to show"
            description="Your recent quiz attempts will be listed here."
            action={
              <Button onClick={() => navigate("quizzes")} variant="outline">
                Browse quizzes
              </Button>
            }
          />
        ) : (
          <Card className="divide-y divide-border">
            {recent.map((r) => (
              <div
                key={r.id}
                className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium">{r.quizTitle}</p>
                  <p className="text-xs text-muted-foreground">
                    {r.category} • {formatDateTime(r.attemptedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden w-40 sm:block">
                    <Progress value={r.percentage} className="h-2" />
                  </div>
                  <span className="w-14 text-right text-sm font-semibold tabular-nums">
                    {r.percentage}%
                  </span>
                  <StatusBadge status={r.status} />
                </div>
              </div>
            ))}
          </Card>
        )}
      </section>

      {(resultsQ.isLoading || quizzesQ.isLoading) && (
        <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading your data…
        </div>
      )}
    </div>
  );
}
