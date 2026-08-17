"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CheckCircle2,
  CircleDashed,
  ListPlus,
  Loader2,
  PlusCircle,
  Save,
  Trash2,
} from "lucide-react";
import { api } from "@/lib/fetch";
import { useAppStore } from "@/store/app";
import { toast } from "sonner";
import type { AnswerOption, Difficulty } from "@/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { cn } from "@/lib/utils";

type QuestionDraft = {
  id: string; // local id for React keys
  questionText: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: AnswerOption;
  marks: number;
};

const OPTIONS: AnswerOption[] = ["A", "B", "C", "D"];
const DIFFICULTIES: Difficulty[] = ["EASY", "MEDIUM", "HARD"];

let _uid = 0;
const uid = () => `q-${++_uid}`;

function blankQuestion(): QuestionDraft {
  return {
    id: uid(),
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: 1,
  };
}

export function AddQuizView() {
  const navigate = useAppStore((s) => s.navigate);
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [duration, setDuration] = useState(15);
  const [difficulty, setDifficulty] = useState<Difficulty>("MEDIUM");
  const [passPct, setPassPct] = useState(60);
  const [questions, setQuestions] = useState<QuestionDraft[]>([
    blankQuestion(),
  ]);

  const totalMarks = useMemo(
    () => questions.reduce((acc, q) => acc + (Number(q.marks) || 0), 0),
    [questions],
  );
  const passingMarks = Math.round((totalMarks * passPct) / 100);

  const createMutation = useMutation({
    mutationFn: () =>
      api<{ id: string }>("/api/quizzes", {
        method: "POST",
        json: {
          title,
          description,
          category,
          duration: Number(duration),
          passingMarks,
          difficulty,
          questions: questions.map(({ id: _id, marks, ...rest }) => ({
            ...rest,
            marks: Number(marks),
          })),
        },
      }),
    onSuccess: () => {
      toast.success("Quiz created successfully!");
      qc.invalidateQueries({ queryKey: ["quizzes"] });
      qc.invalidateQueries({ queryKey: ["admin", "stats"] });
      navigate("admin-quizzes");
    },
    onError: (e) => {
      const msg = e instanceof Error ? e.message : "Failed to create quiz.";
      toast.error(msg);
    },
  });

  const updateQ = (id: string, patch: Partial<QuestionDraft>) =>
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  const removeQ = (id: string) =>
    setQuestions((qs) => (qs.length === 1 ? qs : qs.filter((q) => q.id !== id)));
  const addQ = () => setQuestions((qs) => [...qs, blankQuestion()]);

  const canSubmit =
    title.trim().length >= 3 &&
    description.trim().length >= 10 &&
    category.trim().length >= 2 &&
    duration >= 1 &&
    questions.every(
      (q) =>
        q.questionText.trim().length >= 3 &&
        q.optionA.trim() &&
        q.optionB.trim() &&
        q.optionC.trim() &&
        q.optionD.trim() &&
        q.marks >= 1,
    );

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <button
        onClick={() => navigate("admin-quizzes")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to quizzes
      </button>

      <PageHeader
        title="Create New Quiz"
        description="Define the quiz metadata and add as many questions as you need."
        icon={PlusCircle}
        actions={
          <Button
            onClick={() => createMutation.mutate()}
            disabled={!canSubmit || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {createMutation.isPending ? "Saving…" : "Create quiz"}
          </Button>
        }
      />

      {/* Metadata */}
      <Card className="mt-6 p-6">
        <h2 className="mb-4 flex items-center gap-2 font-semibold">
          <CircleDashed className="h-5 w-5 text-primary" />
          Quiz details
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Introduction to Computer Science"
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="desc">Description</Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description of what this quiz covers…"
              rows={3}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cat">Category</Label>
            <Input
              id="cat"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Programming"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="diff">Difficulty</Label>
            <Select
              value={difficulty}
              onValueChange={(v) => setDifficulty(v as Difficulty)}
            >
              <SelectTrigger id="diff">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DIFFICULTIES.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d.charAt(0) + d.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dur">Duration (minutes)</Label>
            <Input
              id="dur"
              type="number"
              min={1}
              max={240}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Pass threshold — {passPct}%</Label>
            <div className="pt-2">
              <Slider
                value={[passPct]}
                onValueChange={(v) => setPassPct(v[0])}
                min={10}
                max={100}
                step={5}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Students need {passingMarks}/{totalMarks} marks to pass.
            </p>
          </div>
        </div>
      </Card>

      {/* Questions */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-semibold">
          <ListPlus className="h-5 w-5 text-primary" />
          Questions
          <Badge variant="secondary" className="ml-1">
            {questions.length}
          </Badge>
        </h2>
        <Button variant="outline" size="sm" onClick={addQ}>
          <PlusCircle className="mr-1.5 h-4 w-4" />
          Add question
        </Button>
      </div>

      <div className="mt-4 space-y-4">
        {questions.map((q, i) => (
          <QuestionEditor
            key={q.id}
            index={i}
            question={q}
            onChange={(patch) => updateQ(q.id, patch)}
            onRemove={() => removeQ(q.id)}
            canRemove={questions.length > 1}
          />
        ))}
      </div>

      {/* Summary */}
      <Card className="mt-6 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <SummaryPill label="Questions" value={questions.length} />
          <SummaryPill label="Total marks" value={totalMarks} />
          <SummaryPill label="Pass marks" value={passingMarks} />
          <SummaryPill label="Duration" value={`${duration} min`} />
        </div>
        <Button
          onClick={() => createMutation.mutate()}
          disabled={!canSubmit || createMutation.isPending}
        >
          {createMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          {createMutation.isPending ? "Creating…" : "Publish quiz"}
        </Button>
      </Card>

      {!canSubmit && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Fill in all question texts, all four options, and set a marks value of at least 1 to enable publishing.
        </p>
      )}
    </div>
  );
}

function QuestionEditor({
  index,
  question,
  onChange,
  onRemove,
  canRemove,
}: {
  index: number;
  question: QuestionDraft;
  onChange: (patch: Partial<QuestionDraft>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const setOpt = (opt: AnswerOption, value: string) =>
    onChange({
      [`option${opt}` as keyof QuestionDraft]: value,
    } as Partial<QuestionDraft>);

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {index + 1}
          </span>
          <span className="font-medium">Question {index + 1}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Marks</Label>
            <Input
              type="number"
              min={1}
              max={20}
              value={question.marks}
              onChange={(e) => onChange({ marks: Number(e.target.value) })}
              className="h-8 w-16"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-rose-600 hover:bg-rose-500/10"
            onClick={onRemove}
            disabled={!canRemove}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-1.5">
        <Label className="text-xs text-muted-foreground">Question text</Label>
        <Textarea
          value={question.questionText}
          onChange={(e) => onChange({ questionText: e.target.value })}
          placeholder="Enter the question…"
          rows={2}
        />
      </div>

      <div className="mt-4">
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Options — select the correct answer
        </p>
        <RadioGroup
          value={question.correctAnswer}
          onValueChange={(v) => onChange({ correctAnswer: v as AnswerOption })}
          className="grid gap-2"
        >
          {OPTIONS.map((opt) => {
            const isCorrect = question.correctAnswer === opt;
            return (
              <div
                key={opt}
                className={cn(
                  "flex items-center gap-2 rounded-lg border p-2 transition-colors",
                  isCorrect
                    ? "border-emerald-500/50 bg-emerald-500/5"
                    : "border-border",
                )}
              >
                <RadioGroupItem value={opt} id={`${question.id}-${opt}`} className="sr-only" />
                <Label
                  htmlFor={`${question.id}-${opt}`}
                  className="flex w-full cursor-pointer items-center gap-2"
                >
                  <span
                    className={cn(
                      "grid h-7 w-7 shrink-0 place-items-center rounded-md border text-xs font-bold",
                      isCorrect
                        ? "border-emerald-500 bg-emerald-500 text-white"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {opt}
                  </span>
                  <Input
                    value={question[`option${opt}` as keyof QuestionDraft] as string}
                    onChange={(e) => setOpt(opt, e.target.value)}
                    placeholder={`Option ${opt}`}
                    className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                  />
                  {isCorrect && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  )}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    </Card>
  );
}

function SummaryPill({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1">
      <span className="text-xs text-muted-foreground">{label}:</span>
      <span className="text-sm font-semibold tabular-nums">{value}</span>
    </div>
  );
}
