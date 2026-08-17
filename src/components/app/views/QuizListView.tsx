"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Clock,
  ListChecks,
  Loader2,
  BookOpen,
  RotateCcw,
  Search,
  Trophy,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import type { QuizListItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { DifficultyBadge } from "@/components/app/shared/DifficultyBadge";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { EmptyState } from "@/components/app/shared/EmptyState";

export function QuizListView() {
  const showInstructions = useAppStore((s) => s.showInstructions);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => api<{ quizzes: QuizListItem[] }>("/api/quizzes"),
  });

  const quizzes = data?.quizzes ?? [];
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(quizzes.map((q) => q.category)))],
    [quizzes],
  );

  const filtered = quizzes.filter((q) => {
    const matchCat = category === "All" || q.category === category;
    const matchSearch =
      !search ||
      q.title.toLowerCase().includes(search.toLowerCase()) ||
      q.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Quiz Library"
        description="Choose a quiz to begin. You can retake any quiz to improve your best score."
        icon={BookOpen}
      />

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search quizzes by title or description…"
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors " +
                (category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground")
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading quizzes…
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="mt-10"
          icon={Search}
          title="No quizzes match your search"
          description="Try a different keyword or category filter."
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((q) => (
            <QuizCard key={q.id} quiz={q} onStart={() => showInstructions(q.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizCard({
  quiz,
  onStart,
}: {
  quiz: QuizListItem;
  onStart: () => void;
}) {
  const attempted = !!quiz.bestAttempt;
  return (
    <Card className="group flex flex-col overflow-hidden p-0 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
      <div className="border-b border-border/60 p-5">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="font-medium">
            {quiz.category}
          </Badge>
          <DifficultyBadge difficulty={quiz.difficulty} />
        </div>
        <h3 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug">
          {quiz.title}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">
          {quiz.description}
        </p>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="grid grid-cols-3 gap-3 text-center">
          <Metric icon={ListChecks} label="Questions" value={quiz.questionCount} />
          <Metric icon={Clock} label="Duration" value={`${quiz.duration}m`} />
          <Metric icon={Trophy} label="Marks" value={quiz.totalMarks} />
        </div>

        {attempted ? (
          <div className="mt-4 rounded-xl border border-border bg-muted/30 p-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Trophy className="h-3.5 w-3.5" /> Best score
              </span>
              <StatusBadge status={quiz.bestAttempt!.status} />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <Progress value={quiz.bestAttempt!.percentage} className="h-2" />
              <span className="w-12 text-right text-sm font-semibold tabular-nums">
                {quiz.bestAttempt!.percentage}%
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
            Not attempted yet
          </div>
        )}

        <div className="mt-4 flex gap-2">
          <Button onClick={onStart} className="flex-1">
            {attempted ? (
              <>
                <RotateCcw className="mr-2 h-4 w-4" />
                Retake quiz
              </>
            ) : (
              <>
                Start quiz
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/40 px-2 py-2.5">
      <Icon className="mx-auto h-4 w-4 text-muted-foreground" />
      <p className="mt-1 text-sm font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
