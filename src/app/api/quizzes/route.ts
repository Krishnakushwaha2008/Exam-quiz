import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireSession } from "@/lib/auth";
import { QuizInputSchema } from "@/lib/validators";
import { apiHandler } from "@/lib/api";

/** GET /api/quizzes — list quizzes. Returns question count + best attempt for the current user. */
export const GET = apiHandler(async (req: Request) => {
  const session = await requireSession();
  const url = new URL(req.url);
  const category = url.searchParams.get("category") || undefined;
  const search = url.searchParams.get("q") || undefined;

  const quizzes = await db.quiz.findMany({
    where: {
      ...(category && category !== "All" ? { category } : {}),
      ...(search
        ? { title: { contains: search } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { questions: true } },
      results: {
        where: { userId: session.id },
        orderBy: { percentage: "desc" },
        take: 1,
        select: { percentage: true, status: true, attemptedAt: true },
      },
    },
  });

  return NextResponse.json({
    quizzes: quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      description: q.description,
      category: q.category,
      duration: q.duration,
      totalMarks: q.totalMarks,
      passingMarks: q.passingMarks,
      difficulty: q.difficulty,
      questionCount: q._count.questions,
      createdAt: q.createdAt,
      bestAttempt: q.results[0]
        ? {
            percentage: q.results[0].percentage,
            status: q.results[0].status,
            attemptedAt: q.results[0].attemptedAt,
          }
        : null,
    })),
  });
});

/** POST /api/quizzes — admin creates a quiz with embedded questions. */
export const POST = apiHandler(async (req: Request) => {
  await requireAdmin();
  const body = await req.json();
  const parsed = QuizInputSchema.parse(body);

  const totalMarks = parsed.questions.reduce((acc, q) => acc + q.marks, 0);
  const passingMarks = parsed.passingMarks;

  const quiz = await db.quiz.create({
    data: {
      title: parsed.title,
      description: parsed.description,
      category: parsed.category,
      duration: parsed.duration,
      passingMarks,
      difficulty: parsed.difficulty,
      totalMarks,
      questions: {
        create: parsed.questions.map((q) => ({
          questionText: q.questionText,
          optionA: q.optionA,
          optionB: q.optionB,
          optionC: q.optionC,
          optionD: q.optionD,
          correctAnswer: q.correctAnswer,
          marks: q.marks,
        })),
      },
    },
    include: { _count: { select: { questions: true } } },
  });

  return NextResponse.json({ id: quiz.id, questionCount: quiz._count.questions });
});
