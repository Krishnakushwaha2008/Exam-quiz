"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  ListChecks,
  Loader2,
  RefreshCw,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import type { AnswerOption, ResultDetail } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { ScoreRing } from "@/components/app/shared/ScoreRing";
import { formatDuration, formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

const OPTIONS: AnswerOption[] = ["A", "B", "C", "D"];

export function QuizResultView() {
  const resultId = useAppStore((s) => s.activeResultId);
  const quizId = useAppStore((s) => s.activeQuizId);
  const navigate = useAppStore((s) => s.navigate);
  const showInstructions = useAppStore((s) => s.showInstructions);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["result", resultId],
    enabled: !!resultId,
    queryFn: () => api<{ result: ResultDetail }>(`/api/results/${resultId}`),
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-center gap-3 px-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Grading your exam…</p>
      </div>
    );
  }
  if (isError || !data?.result) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12">
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-semibold">Result not found</h2>
          <Button className="mt-4" onClick={() => navigate("dashboard")}>
            Back to dashboard
          </Button>
        </Card>
      </div>
    );
  }

  const r = data.result;
  const correct = r.answers.filter((a) => a.isCorrect).length;
  const incorrect = r.answers.filter(
    (a) => a.selectedAnswer !== null && !a.isCorrect,
  ).length;
  const unanswered = r.answers.filter((a) => a.selectedAnswer === null).length;
  const passMarkPercent = r.totalMarks
    ? Math.round((r.passingMarks / r.totalMarks) * 100)
    : 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate("dashboard")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </button>

      <PageHeader
        title="Exam Result"
        description={`${r.quizTitle} • ${r.category}`}
        icon={Trophy}
        actions={<StatusBadge status={r.status} />}
      />

      {/* Hero score card */}
      <Card className="mt-6 overflow-hidden">
        <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-[auto_1fr] sm:p-8">
          <div className="flex flex-col items-center justify-center">
            <ScoreRing
              value={r.percentage}
              status={r.status}
              size={170}
              sublabel={r.status === "PASS" ? "Passed" : "Failed"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ScoreStat icon={Target} label="Score" value={`${r.score}/${r.totalMarks}`} accent="primary" />
            <ScoreStat
              icon={Target}
              label="Pass mark"
              value={`${r.passingMarks} (${passMarkPercent}%)`}
              accent="gold"
            />
            <ScoreStat icon={Clock} label="Time spent" value={formatDuration(r.timeSpent)} accent="success" />
            <ScoreStat
              icon={ListChecks}
              label="Accuracy"
              value={`${Math.round((correct / r.answers.length) * 100)}%`}
              accent="warning"
            />
            <div className="col-span-2 sm:col-span-4">
              <p className="text-xs text-muted-foreground">
                Attempted on {formatDateTime(r.attemptedAt)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Breakdown */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <BreakdownCard
          icon={CheckCircle2}
          tone="success"
          label="Correct"
          value={correct}
          total={r.answers.length}
        />
        <BreakdownCard
          icon={XCircle}
          tone="danger"
          label="Incorrect"
          value={incorrect}
          total={r.answers.length}
        />
        <BreakdownCard
          icon={Circle}
          tone="muted"
          label="Unanswered"
          value={unanswered}
          total={r.answers.length}
        />
      </div>

      {/* Answer review */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Answer review</h3>
          <Badge variant="secondary">{r.answers.length} questions</Badge>
        </div>
        <div className="space-y-4">
          {r.answers.map((a, i) => (
            <Card
              key={a.id}
              className={cn(
                "overflow-hidden p-0",
                a.isCorrect
                  ? "border-emerald-500/30"
                  : a.selectedAnswer === null
                    ? "border-border"
                    : "border-rose-500/30",
              )}
            >
              <div className="flex items-start gap-3 border-b border-border/60 p-4 sm:p-5">
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-xs font-bold",
                    a.isCorrect
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300"
                      : a.selectedAnswer === null
                        ? "bg-muted text-muted-foreground"
                        : "bg-rose-500/15 text-rose-600 dark:text-rose-300",
                  )}
                >
                  {i + 1}
                </span>
                <p className="flex-1 font-medium leading-relaxed">
                  {a.questionText}
                </p>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="tabular-nums">
                    {a.marks} {a.marks === 1 ? "mark" : "marks"}
                  </Badge>
                  {a.isCorrect ? (
                    <StatusBadge status="PASS" />
                  ) : a.selectedAnswer === null ? (
                    <Badge variant="secondary">Skipped</Badge>
                  ) : (
                    <StatusBadge status="FAIL" />
                  )}
                </div>
              </div>
              <div className="grid gap-2 p-4 sm:grid-cols-2 sm:p-5">
                {OPTIONS.map((opt) => {
                  const text =
                    opt === "A"
                      ? a.optionA
                      : opt === "B"
                        ? a.optionB
                        : opt === "C"
                          ? a.optionC
                          : a.optionD;
                  const isCorrect = a.correctAnswer === opt;
                  const isSelected = a.selectedAnswer === opt;
                  return (
                    <div
                      key={opt}
                      className={cn(
                        "flex items-center gap-3 rounded-lg border p-3 text-sm",
                        isCorrect
                          ? "border-emerald-500/40 bg-emerald-500/10"
                          : isSelected
                            ? "border-rose-500/40 bg-rose-500/10"
                            : "border-border bg-card",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-6 w-6 shrink-0 place-items-center rounded-md border text-xs font-bold",
                          isCorrect
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : isSelected
                              ? "border-rose-500 bg-rose-500 text-white"
                              : "border-border text-muted-foreground",
                        )}
                      >
                        {opt}
                      </span>
                      <span className="flex-1">{text}</span>
                      {isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-600 dark:text-rose-300" />
                      )}
                      {isSelected && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Your answer
                        </span>
                      )}
                      {isCorrect && (
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-300">
                          Correct
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          variant="outline"
          onClick={() => navigate("quizzes")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to library
        </Button>
        <Button onClick={() => showInstructions(quizId ?? r.quizId)}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Retake this quiz
        </Button>
      </div>
    </div>
  );
}

function ScoreStat({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: "primary" | "gold" | "success" | "warning";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    gold: "bg-gold/15 text-gold",
    success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    warning: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
  };
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <span className={cn("grid h-7 w-7 place-items-center rounded-lg", tones[accent])}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums">{value}</p>
    </div>
  );
}

function BreakdownCard({
  icon: Icon,
  tone,
  label,
  value,
  total,
}: {
  icon: React.ElementType;
  tone: "success" | "danger" | "muted";
  label: string;
  value: number;
  total: number;
}) {
  const tones = {
    success: "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-300",
    danger: "border-rose-500/30 bg-rose-500/5 text-rose-600 dark:text-rose-300",
    muted: "border-border bg-muted/30 text-muted-foreground",
  };
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <Card className={cn("p-5", tones[tone])}>
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5" />
        <span className="text-2xl font-bold tabular-nums">{value}</span>
      </div>
      <p className="mt-2 text-sm font-medium">{label}</p>
      <p className="text-xs opacity-80">{pct}% of questions</p>
    </Card>
  );
}
