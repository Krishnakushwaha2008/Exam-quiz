"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Award,
  CalendarDays,
  ClipboardList,
  Loader2,
  Mail,
  Target,
  TrendingUp,
  User as UserIcon,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAuth } from "@/hooks/use-auth";
import { useAppStore } from "@/store/app";
import type { ResultListItem } from "@/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { StatCard } from "@/components/app/shared/StatCard";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { EmptyState } from "@/components/app/shared/EmptyState";
import { formatDate, formatDateTime } from "@/lib/format";

export function ProfileView() {
  const { user } = useAuth();
  const showResult = useAppStore((s) => s.showResult);
  const navigate = useAppStore((s) => s.navigate);

  const { data, isLoading } = useQuery({
    queryKey: ["results"],
    queryFn: () => api<{ results: ResultListItem[] }>("/api/results"),
  });

  const results = data?.results ?? [];
  const attempts = results.length;
  const avg =
    attempts > 0
      ? Number(
          (results.reduce((a, r) => a + r.percentage, 0) / attempts).toFixed(1),
        )
      : 0;
  const best = attempts > 0 ? Math.max(...results.map((r) => r.percentage)) : 0;
  const passed = results.filter((r) => r.status === "PASS").length;

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="My Profile"
        description="Your account details and full examination history."
        icon={UserIcon}
      />

      {/* Profile card */}
      <Card className="mt-6 overflow-hidden">
        <div className="relative border-b border-border bg-primary/5 p-6 sm:p-8">
          <div className="bg-grid absolute inset-0 opacity-40" />
          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            <Avatar className="h-20 w-20 border-4 border-background shadow-md">
              <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold tracking-tight">{user.name}</h2>
              <p className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <CalendarDays className="h-4 w-4" />
                Member since {formatDate(user.createdAt ?? new Date())}
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate("quizzes")}>
              <ClipboardList className="mr-2 h-4 w-4" />
              Take a quiz
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-4 sm:p-8">
          <StatCard icon={ClipboardList} label="Attempts" value={attempts} accent="primary" />
          <StatCard icon={TrendingUp} label="Average" value={`${avg}%`} accent="gold" />
          <StatCard icon={Award} label="Best score" value={`${best}%`} accent="success" />
          <StatCard icon={Target} label="Passed" value={`${passed}/${attempts}`} accent="warning" />
        </div>
      </Card>

      {/* History */}
      <section className="mt-8">
        <h3 className="mb-3 font-semibold">Attempt history</h3>
        {isLoading ? (
          <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading history…
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No attempts yet"
            description="When you complete a quiz, your results and scores will appear here."
            action={
              <Button onClick={() => navigate("quizzes")} variant="outline">
                Browse quizzes
              </Button>
            }
          />
        ) : (
          <Card className="overflow-hidden p-0">
            {/* Table header (desktop) */}
            <div className="hidden grid-cols-[1fr_120px_140px_120px_140px] gap-3 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Quiz</span>
              <span>Score</span>
              <span>Percentage</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            <div className="divide-y divide-border">
              {results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => showResult(r.id)}
                  className="grid w-full grid-cols-1 gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/30 sm:grid-cols-[1fr_120px_140px_120px_140px] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{r.quizTitle}</p>
                    <p className="text-xs text-muted-foreground">{r.category}</p>
                  </div>
                  <span className="text-sm font-medium tabular-nums">
                    {r.score}/{r.totalMarks}
                  </span>
                  <div className="flex items-center gap-2">
                    <Progress value={r.percentage} className="h-2 w-20" />
                    <span className="text-sm font-semibold tabular-nums">
                      {r.percentage}%
                    </span>
                  </div>
                  <StatusBadge status={r.status} />
                  <span className="text-xs text-muted-foreground">
                    {formatDateTime(r.attemptedAt)}
                  </span>
                </button>
              ))}
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
