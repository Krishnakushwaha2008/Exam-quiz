"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  Clock,
  Flag,
  Loader2,
  Send,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import type { AnswerOption, QuizDetail } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatClock } from "@/lib/format";
import { Logo } from "@/components/app/shared/Logo";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const OPTION_LABELS: AnswerOption[] = ["A", "B", "C", "D"];

export function QuizAttemptView() {
  const quizId = useAppStore((s) => s.activeQuizId);
  const showResult = useAppStore((s) => s.showResult);
  const navigate = useAppStore((s) => s.navigate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz", quizId],
    enabled: !!quizId,
    queryFn: () => api<{ quiz: QuizDetail }>(`/api/quizzes/${quizId}`),
  });

  const quiz = data?.quiz;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerOption>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [quizKey, setQuizKey] = useState<string | null>(null);
  const [deadline, setDeadline] = useState(0);
  const startedAt = useRef<number>(0);
  const submittedRef = useRef(false);
  const submitRef = useRef<() => void>(() => {});
  const qc = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async () => {
      const timeSpent = Math.max(0, Math.round((Date.now() - startedAt.current) / 1000));
      return api<{ resultId: string }>(`/api/quizzes/${quizId}/submit`, {
        method: "POST",
        json: { answers, timeSpent },
      });
    },
    onSuccess: (res) => {
      submittedRef.current = true;
      qc.invalidateQueries({ queryKey: ["results"] });
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      toast.success("Exam submitted successfully!");
      showResult(res.resultId);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Submission failed.");
      submittedRef.current = false;
    },
  });

  useEffect(() => {
    submitRef.current = () => submitMutation.mutate();
  });

  // Initialise timer state when a quiz loads.
  useEffect(() => {
    if (quiz && quiz.id !== quizKey) {
      setQuizKey(quiz.id);
      setTimeLeft(quiz.duration * 60);
      setDeadline(Date.now() + quiz.duration * 60 * 1000);
      startedAt.current = Date.now();
      submittedRef.current = false;
    }
  }, [quiz, quizKey]);

  // Countdown — ticks every second and auto-submits at zero. All setState
  // calls live inside the interval callback, which the lint rules allow.
  useEffect(() => {
    if (!quizKey || deadline === 0) return;
    const t = setInterval(() => {
      const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining === 0) {
        clearInterval(t);
        if (!submittedRef.current) {
          submittedRef.current = true;
          setShowConfirm(false);
          toast.info("Time's up — submitting your exam automatically.");
          submitRef.current();
        }
      }
    }, 1000);
    return () => clearInterval(t);
  }, [quizKey, deadline]);

  const answeredCount = Object.keys(answers).length;
  const total = quiz?.questions.length ?? 0;

  const handleSelect = (option: AnswerOption) => {
    if (!quiz) return;
    const q = quiz.questions[current];
    setAnswers((a) => ({ ...a, [q.id]: option }));
  };

  if (isLoading) {
    return (
      <Full>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Preparing your exam…</p>
      </Full>
    );
  }
  if (isError || !quiz) {
    return (
      <Full>
        <AlertTriangle className="h-10 w-10 text-rose-500" />
        <p className="font-semibold">Unable to load this quiz.</p>
        <Button onClick={() => navigate("quizzes")}>Back to library</Button>
      </Full>
    );
  }

  const question = quiz.questions[current];
  const isLast = current === total - 1;
  const low = timeLeft <= 30 && timeLeft > 0;

  const doSubmit = () => {
    setShowConfirm(false);
    submitMutation.mutate();
  };

  const answered = question.id in answers;
  const selected = answers[question.id];

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* ===================== Top exam bar ===================== */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Logo size="sm" showWordmark={false} />
          <div className="min-w-0 flex-1 text-center">
            <p className="truncate text-sm font-semibold">{quiz.title}</p>
            <p className="text-xs text-muted-foreground">
              Question {current + 1} of {total} • {answeredCount}/{total} answered
            </p>
          </div>
          <div
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-sm font-semibold tabular-nums transition-colors",
              low
                ? "border-rose-500/40 bg-rose-500/10 text-rose-600 dark:text-rose-300"
                : timeLeft <= 120
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-300"
                  : "border-border bg-muted/40 text-foreground",
            )}
            aria-label="Time remaining"
          >
            <Clock className="h-4 w-4" />
            {formatClock(timeLeft)}
          </div>
          <Button
            size="sm"
            onClick={() => setShowConfirm(true)}
            disabled={submitMutation.isPending}
          >
            <Send className="mr-1.5 h-4 w-4" />
            Submit
          </Button>
        </div>
      </header>

      {/* ===================== Body ===================== */}
      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        {/* Question card */}
        <main className="flex flex-col gap-4">
          <Card className="flex flex-1 flex-col p-6 sm:p-8">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                {current + 1}
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  {question.marks} {question.marks === 1 ? "mark" : "marks"}
                </p>
                <p className="mt-1 text-lg font-medium leading-relaxed text-foreground">
                  {question.questionText}
                </p>
              </div>
            </div>

            <RadioGroup
              value={selected ?? ""}
              onValueChange={(v) => handleSelect(v as AnswerOption)}
              className="mt-6 grid gap-3"
            >
              {OPTION_LABELS.map((opt) => {
                const text =
                  opt === "A"
                    ? question.optionA
                    : opt === "B"
                      ? question.optionB
                      : opt === "C"
                        ? question.optionC
                        : question.optionD;
                const isSelected = selected === opt;
                return (
                  <Label
                    key={opt}
                    htmlFor={`opt-${opt}`}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-all hover:bg-muted/40",
                      isSelected
                        ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                        : "border-border",
                    )}
                  >
                    <RadioGroupItem value={opt} id={`opt-${opt}`} className="sr-only" />
                    <span
                      className={cn(
                        "grid h-8 w-8 shrink-0 place-items-center rounded-lg border text-sm font-bold transition-colors",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground",
                      )}
                    >
                      {opt}
                    </span>
                    <span className="text-sm leading-relaxed">{text}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </Card>

          {/* Prev / Next */}
          <div className="flex items-center justify-between gap-3">
            <Button
              variant="outline"
              onClick={() => setCurrent((c) => Math.max(0, c - 1))}
              disabled={current === 0}
            >
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Previous
            </Button>
            <p className="hidden text-xs text-muted-foreground sm:block">
              {answered ? "Answer recorded" : "Unanswered"}
            </p>
            {isLast ? (
              <Button onClick={() => setShowConfirm(true)} disabled={submitMutation.isPending}>
                <Flag className="mr-1.5 h-4 w-4" />
                Finish & submit
              </Button>
            ) : (
              <Button onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}>
                Next
                <ChevronRight className="ml-1.5 h-4 w-4" />
              </Button>
            )}
          </div>
        </main>

        {/* Palette sidebar */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">Question palette</h3>
              <CircleDot className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
              {quiz.questions.map((q, i) => {
                const isAnswered = q.id in answers;
                const isCurrent = i === current;
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to question ${i + 1}`}
                    className={cn(
                      "grid h-9 w-9 place-items-center rounded-lg border text-sm font-medium transition-colors",
                      isCurrent
                        ? "border-primary bg-primary text-primary-foreground"
                        : isAnswered
                          ? "border-primary/40 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
              <Legend swatch="bg-primary text-primary-foreground" label="Current" />
              <Legend swatch="bg-primary/10 text-primary border-primary/40" label="Answered" />
              <Legend swatch="bg-card text-muted-foreground border-border" label="Unanswered" />
            </div>
            <div className="mt-4 rounded-lg bg-muted/40 p-3 text-center">
              <p className="text-xs text-muted-foreground">Answered</p>
              <p className="text-lg font-bold tabular-nums">
                {answeredCount}
                <span className="text-muted-foreground">/{total}</span>
              </p>
            </div>
            <Button
              className="mt-3 w-full"
              variant="secondary"
              onClick={() => setShowConfirm(true)}
              disabled={submitMutation.isPending}
            >
              <Send className="mr-1.5 h-4 w-4" />
              Submit exam
            </Button>
          </Card>
        </aside>
      </div>

      {/* ===================== Confirm dialog ===================== */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit your exam?</AlertDialogTitle>
            <AlertDialogDescription>
              {answeredCount === total
                ? "You have answered all questions. "
                : `You have answered ${answeredCount} of ${total} questions. Unanswered questions will score zero. `}
              You can review your answers before submitting. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitMutation.isPending}>
              Keep working
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={doSubmit}
              disabled={submitMutation.isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {submitMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit now"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function Full({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
      {children}
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("grid h-5 w-5 place-items-center rounded border text-[10px]", swatch)}>
        •
      </span>
      <span>{label}</span>
    </div>
  );
}
