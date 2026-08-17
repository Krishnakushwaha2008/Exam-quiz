"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BookOpen,
  Clock,
  ListChecks,
  Loader2,
  PencilLine,
  PlusCircle,
  Trash2,
  Trophy,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import { toast } from "sonner";
import type { QuizListItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { PageHeader } from "@/components/app/shared/PageHeader";
import { DifficultyBadge } from "@/components/app/shared/DifficultyBadge";
import { EmptyState } from "@/components/app/shared/EmptyState";
import { formatRelativeDate } from "@/lib/format";

export function AdminQuizzesView() {
  const navigate = useAppStore((s) => s.navigate);
  const qc = useQueryClient();
  const [toDelete, setToDelete] = useState<QuizListItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () => api<{ quizzes: QuizListItem[] }>("/api/quizzes"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      api<{ ok: boolean }>(`/api/quizzes/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Quiz deleted successfully.");
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      setToDelete(null);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Delete failed."),
  });

  const quizzes = data?.quizzes ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Manage Quizzes"
        description="Review, edit, or remove quizzes from the examination catalog."
        icon={BookOpen}
        actions={
          <Button onClick={() => navigate("admin-add-quiz")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New quiz
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading quizzes…
        </div>
      ) : quizzes.length === 0 ? (
        <EmptyState
          className="mt-8"
          icon={BookOpen}
          title="No quizzes yet"
          description="Create your first quiz to get students started."
          action={
            <Button onClick={() => navigate("admin-add-quiz")}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create quiz
            </Button>
          }
        />
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <Card className="p-0">
            {/* Header */}
            <div className="hidden grid-cols-[1fr_140px_100px_100px_100px_100px] gap-3 border-b border-border bg-muted/40 px-5 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground sm:grid">
              <span>Quiz</span>
              <span>Category</span>
              <span>Questions</span>
              <span>Duration</span>
              <span>Marks</span>
              <span className="text-right">Actions</span>
            </div>
            <div className="divide-y divide-border">
              {quizzes.map((q) => (
                <div
                  key={q.id}
                  className="grid grid-cols-1 gap-3 px-5 py-4 sm:grid-cols-[1fr_140px_100px_100px_100px_100px] sm:items-center"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{q.title}</p>
                      <DifficultyBadge difficulty={q.difficulty} />
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                      {q.description}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground sm:hidden">
                      {q.category} • {q.questionCount} Q • {q.duration}m • {q.totalMarks} marks
                    </p>
                  </div>
                  <Badge variant="secondary" className="hidden w-fit sm:inline-flex">
                    {q.category}
                  </Badge>
                  <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
                    <ListChecks className="h-4 w-4" />
                    {q.questionCount}
                  </span>
                  <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
                    <Clock className="h-4 w-4" />
                    {q.duration}m
                  </span>
                  <span className="hidden items-center gap-1 text-sm text-muted-foreground sm:flex">
                    <Trophy className="h-4 w-4" />
                    {q.totalMarks}
                  </span>
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Created"
                      onClick={() => toast.info(`Created ${formatRelativeDate(q.createdAt)}`)}
                    >
                      <PencilLine className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-rose-600 hover:bg-rose-500/10 hover:text-rose-600"
                      title="Delete quiz"
                      onClick={() => setToDelete(q)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Delete confirm */}
      <AlertDialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete "{toDelete?.title}"?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the quiz along with all its questions and
              every student's results for it. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => toDelete && deleteMutation.mutate(toDelete.id)}
              disabled={deleteMutation.isPending}
              className="bg-rose-600 text-white hover:bg-rose-700"
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete quiz"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
