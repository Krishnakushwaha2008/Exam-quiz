"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  Mail,
  Trophy,
  Users,
} from "lucide-react";
import { api } from "@/lib/fetch";
import type { StudentRow } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { EmptyState } from "@/components/app/shared/EmptyState";
import { formatDate, formatRelativeDate } from "@/lib/format";

export function AdminStudentsView() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "students"],
    queryFn: () => api<{ students: StudentRow[] }>("/api/admin/students"),
  });

  const students = data?.students ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Students"
        description="Track each student's engagement and performance across all quizzes."
        icon={Users}
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading students…
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={Users}
          title="No students yet"
          description="Registered students will be listed here once they sign up."
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {students.map((s) => {
            const initials = s.name
              .split(" ")
              .map((p) => p[0])
              .filter(Boolean)
              .slice(0, 2)
              .join("")
              .toUpperCase();
            return (
              <Card key={s.id} className="flex flex-col p-5">
                <div className="flex items-start gap-3">
                  <Avatar className="h-11 w-11">
                    <AvatarFallback className="bg-primary/15 text-primary">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{s.name}</p>
                    <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {s.email}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Joined {formatDate(s.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <Cell label="Attempts" value={s.attemptCount} />
                  <Cell label="Passed" value={s.passed} />
                  <Cell
                    label="Avg"
                    value={s.attemptCount > 0 ? `${s.avgScore}%` : "—"}
                  />
                </div>

                {s.attemptCount > 0 ? (
                  <div className="mt-4">
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3.5 w-3.5" /> Avg score
                      </span>
                      <span className="font-semibold tabular-nums">
                        {s.avgScore}%
                      </span>
                    </div>
                    <Progress value={s.avgScore} className="h-2" />
                    <p className="mt-2 text-xs text-muted-foreground">
                      Last attempt {formatRelativeDate(s.lastAttempt!)}
                    </p>
                  </div>
                ) : (
                  <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                    No attempts yet
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Cell({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-lg bg-muted/40 py-2">
      <p className="text-lg font-bold tabular-nums">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
