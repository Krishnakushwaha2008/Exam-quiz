import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { apiHandler } from "@/lib/api";

/**
 * GET /api/results/[id] — full result detail, including the answer review.
 * Each answer is joined back to its question so the client can render the
 * chosen option, the correct option, and the per-question marks.
 */
export const GET = apiHandler(
  async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const session = await requireSession();
    const { id } = await ctx.params;

    const result = await db.result.findUnique({
      where: { id },
      include: {
        quiz: true,
        answers: {
          include: {
            question: {
              select: {
                id: true,
                questionText: true,
                optionA: true,
                optionB: true,
                optionC: true,
                optionD: true,
                correctAnswer: true,
                marks: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json({ error: "Result not found." }, { status: 404 });
    }
    // Admins can view any result; students only their own.
    if (result.userId !== session.id && session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "You do not have access to this result." },
        { status: 403 },
      );
    }

    return NextResponse.json({
      result: {
        id: result.id,
        quizId: result.quizId,
        quizTitle: result.quiz.title,
        category: result.quiz.category,
        duration: result.quiz.duration,
        score: result.score,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        status: result.status,
        timeSpent: result.timeSpent,
        attemptedAt: result.attemptedAt,
        passingMarks: result.quiz.passingMarks,
        answers: result.answers.map((a) => ({
          id: a.id,
          questionId: a.questionId,
          questionText: a.question.questionText,
          optionA: a.question.optionA,
          optionB: a.question.optionB,
          optionC: a.question.optionC,
          optionD: a.question.optionD,
          correctAnswer: a.question.correctAnswer,
          selectedAnswer: a.selectedAnswer,
          isCorrect: a.isCorrect,
          marks: a.question.marks,
        })),
      },
    });
  },
);
