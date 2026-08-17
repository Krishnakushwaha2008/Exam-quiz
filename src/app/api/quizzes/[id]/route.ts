import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin, requireSession } from "@/lib/auth";
import { apiHandler } from "@/lib/api";

/** GET /api/quizzes/[id] — quiz detail WITHOUT correct answers (safe to send to student). */
export const GET = apiHandler(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const session = await requireSession();
    const { id } = await ctx.params;

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { id: "asc" },
          select: {
            id: true,
            questionText: true,
            optionA: true,
            optionB: true,
            optionC: true,
            optionD: true,
            marks: true,
          },
        },
      },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    const best = await db.result.findFirst({
      where: { quizId: id, userId: session.id },
      orderBy: { percentage: "desc" },
      select: {
        id: true,
        percentage: true,
        status: true,
        attemptedAt: true,
      },
    });

    return NextResponse.json({
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        duration: quiz.duration,
        totalMarks: quiz.totalMarks,
        passingMarks: quiz.passingMarks,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      },
      bestAttempt: best,
    });
  },
);

/** DELETE /api/quizzes/[id] — admin removes a quiz (cascade deletes questions/results). */
export const DELETE = apiHandler(
  async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
    await requireAdmin();
    const { id } = await ctx.params;
    await db.quiz.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  },
);
