"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Clock,
  ListChecks,
  Loader2,
  PlayCircle,
  ShieldQuestion,
  Target,
  Trophy,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import type { QuizDetail } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { DifficultyBadge } from "@/components/app/shared/DifficultyBadge";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { formatRelativeDate } from "@/lib/format";

export function QuizInstructionsView() {
  const quizId = useAppStore((s) => s.activeQuizId);
  const startQuiz = useAppStore((s) => s.startQuiz);
  const navigate = useAppStore((s) => s.navigate);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["quiz", quizId],
    enabled: !!quizId,
    queryFn: () => api<{ quiz: QuizDetail }>(`/api/quizzes/${quizId}`),
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-3 px-4 py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading quiz details…</p>
      </div>
    );
  }

  if (isError || !data?.quiz) {
    return (
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <Card className="p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-rose-500" />
          <h2 className="mt-3 text-lg font-semibold">Quiz not found</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            The quiz you're looking for may have been removed.
          </p>
          <Button className="mt-4" onClick={() => navigate("quizzes")}>
            Back to library
          </Button>
        </Card>
      </div>
    );
  }

  const quiz = data.quiz;
  const passMarkPercent = quiz.totalMarks
    ? Math.round((quiz.passingMarks / quiz.totalMarks) * 100)
    : 0;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate("quizzes")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to library
      </button>

      <PageHeader
        title={quiz.title}
        description={quiz.description}
        icon={ShieldQuestion}
        actions={<DifficultyBadge difficulty={quiz.difficulty} />}
      />

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <InfoTile icon={ListChecks} label="Questions" value={quiz.questions.length} />
        <InfoTile icon={Clock} label="Duration" value={`${quiz.duration} min`} />
        <InfoTile icon={Trophy} label="Total marks" value={quiz.totalMarks} />
        <InfoTile icon={Target} label="Pass mark" value={`${quiz.passingMarks} (${passMarkPercent}%)`} />
      </div>

      {data.bestAttempt && (
        <Card className="mt-6 border-emerald-500/30 bg-emerald-500/5 p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-semibold">Previous best: {data.bestAttempt.percentage}%</p>
                <p className="text-xs text-muted-foreground">
                  Last attempt {formatRelativeDate(data.bestAttempt.attemptedAt)}
                </p>
              </div>
            </div>
            <StatusBadge status={data.bestAttempt.status} />
          </div>
        </Card>
      )}

      {/* Rules */}
      <Card className="mt-6 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <BookOpen className="h-5 w-5 text-primary" />
          Examination guidelines
        </h2>
        <ul className="mt-4 space-y-3">
          {[
            `The exam runs for ${quiz.duration} minutes. The timer starts the moment you begin and auto-submits when it reaches zero.`,
            "You can navigate freely between questions using the question palette — unanswered questions are not penalised beyond their marks.",
            "Each question has exactly one correct option. Selecting the correct option awards the question's full marks.",
            `You need ${quiz.passingMarks} out of ${quiz.totalMarks} (${passMarkPercent}%) to pass.`,
            "Once submitted, the result is final — but you may retake the quiz later to improve your best score.",
          ].map((rule, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span className="text-foreground/90">{rule}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          Ready? Make sure you have a stable connection and {quiz.duration} uninterrupted minutes.
        </p>
        <Button
          size="lg"
          className="w-full sm:w-auto"
          onClick={() => startQuiz(quiz.id)}
        >
          <PlayCircle className="mr-2 h-5 w-5" />
          Begin examination
        </Button>
      </div>
    </div>
  );
}

function InfoTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums">{value}</p>
    </Card>
  );
}
