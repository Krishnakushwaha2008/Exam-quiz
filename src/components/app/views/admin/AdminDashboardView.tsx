"use client";

import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  Loader2,
  PlusCircle,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import type { AdminStats } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
} from "recharts";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { StatCard } from "@/components/app/shared/StatCard";
import { StatusBadge } from "@/components/app/shared/StatusBadge";
import { EmptyState } from "@/components/app/shared/EmptyState";
import { formatRelativeDate } from "@/lib/format";

export function AdminDashboardView() {
  const navigate = useAppStore((s) => s.navigate);
  const showResult = useAppStore((s) => s.showResult);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: () => api<AdminStats>("/api/admin/stats"),
  });

  const stats = data;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Admin Overview"
        description="Platform-wide metrics on students, quizzes, and examination performance."
        icon={ShieldCheck}
        actions={
          <Button onClick={() => navigate("admin-add-quiz")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create quiz
          </Button>
        }
      />

      {isLoading || !stats ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading metrics…
        </div>
      ) : (
        <>
          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              icon={Users}
              label="Students"
              value={stats.totalStudents}
              hint="Registered learners"
              accent="primary"
            />
            <StatCard
              icon={BookOpen}
              label="Quizzes"
              value={stats.totalQuizzes}
              hint="Published assessments"
              accent="gold"
            />
            <StatCard
              icon={ClipboardCheck}
              label="Total attempts"
              value={stats.totalAttempts}
              hint="All-time submissions"
              accent="success"
            />
            <StatCard
              icon={TrendingUp}
              label="Pass rate"
              value={`${stats.passRate}%`}
              hint={`Avg score ${stats.avgScore}%`}
              accent="warning"
            />
          </section>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Performance chart */}
            <Card className="p-5 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Quiz performance</h3>
                  <p className="text-sm text-muted-foreground">
                    Attempts & average score per quiz.
                  </p>
                </div>
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
              </div>
              {stats.quizPerformance.length === 0 ? (
                <EmptyState
                  icon={BarChart3}
                  title="No attempts recorded"
                  description="Once students attempt quizzes, performance analytics will appear here."
                />
              ) : (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={stats.quizPerformance}
                      margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                      <XAxis
                        dataKey="title"
                        tickLine={false}
                        axisLine={false}
                        fontSize={11}
                        interval={0}
                        tickFormatter={(v: string) => (v.length > 14 ? v.slice(0, 13) + "…" : v)}
                      />
                      <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={12} />
                      <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tickLine={false} axisLine={false} fontSize={12} />
                      <RTooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid var(--border)",
                          background: "var(--card)",
                          color: "var(--card-foreground)",
                          fontSize: 12,
                        }}
                      />
                      <Bar
                        yAxisId="left"
                        dataKey="attempts"
                        name="Attempts"
                        fill="oklch(0.52 0.12 162)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={42}
                      />
                      <Bar
                        yAxisId="right"
                        dataKey="avgScore"
                        name="Avg score %"
                        fill="oklch(0.74 0.15 75)"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={42}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Card>

            {/* Quick actions */}
            <Card className="p-5">
              <h3 className="font-semibold">Quick actions</h3>
              <p className="text-sm text-muted-foreground">
                Manage the examination catalog.
              </p>
              <div className="mt-4 space-y-2">
                <ActionRow
                  icon={PlusCircle}
                  label="Create a new quiz"
                  desc="Add questions, set duration & pass mark"
                  onClick={() => navigate("admin-add-quiz")}
                />
                <ActionRow
                  icon={BookOpen}
                  label="Manage quizzes"
                  desc="Review, edit, or remove existing quizzes"
                  onClick={() => navigate("admin-quizzes")}
                />
                <ActionRow
                  icon={Users}
                  label="View students"
                  desc="Track progress and performance"
                  onClick={() => navigate("admin-students")}
                />
              </div>
            </Card>
          </div>

          {/* Recent activity */}
          <section className="mt-8">
            <h3 className="mb-3 font-semibold">Recent attempts</h3>
            {stats.recentResults.length === 0 ? (
              <EmptyState
                icon={ClipboardCheck}
                title="No recent activity"
                description="Recent student attempts will be listed here."
              />
            ) : (
              <Card className="overflow-hidden p-0">
                <div className="hidden grid-cols-[1fr_1fr_100px_120px_120px] gap-3 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
                  <span>Student</span>
                  <span>Quiz</span>
                  <span>Score</span>
                  <span>Status</span>
                  <span>When</span>
                </div>
                <div className="divide-y divide-border">
                  {stats.recentResults.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => showResult(r.id)}
                      className="grid w-full grid-cols-1 gap-2 px-5 py-3.5 text-left transition-colors hover:bg-muted/30 sm:grid-cols-[1fr_1fr_100px_120px_120px] sm:items-center"
                    >
                      <span className="truncate text-sm font-medium">
                        {r.studentName}
                      </span>
                      <span className="truncate text-sm text-muted-foreground">
                        {r.quizTitle}
                      </span>
                      <span className="text-sm font-medium tabular-nums">
                        {r.score}/{r.totalMarks}
                      </span>
                      <StatusBadge status={r.status} />
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeDate(r.attemptedAt)}
                      </span>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label,
  desc,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/30"
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4.5 w-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">{label}</p>
        <p className="truncate text-xs text-muted-foreground">{desc}</p>
      </div>
      <Badge variant="outline" className="opacity-0 transition-opacity group-hover:opacity-100">
        Go
      </Badge>
    </button>
  );
}
