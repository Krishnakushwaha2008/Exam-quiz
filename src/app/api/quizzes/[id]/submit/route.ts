import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { QuizSubmissionSchema } from "@/lib/validators";
import { apiHandler } from "@/lib/api";

/**
 * POST /api/quizzes/[id]/submit
 * Validates the submission, scores every question, and transactionally
 * persists the Result + Answer records.
 */
export const POST = apiHandler(
  async (req: Request, ctx: { params: Promise<{ id: string }> }) => {
    const session = await requireSession();
    const { id } = await ctx.params;

    const body = await req.json();
    const parsed = QuizSubmissionSchema.parse({
      ...body,
      quizId: id,
    });

    const quiz = await db.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found." }, { status: 404 });
    }

    let score = 0;
    const answerRecords = quiz.questions.map((question) => {
      const selected = parsed.answers[question.id] || null;
      const isCorrect = selected === question.correctAnswer;
      if (isCorrect) score += question.marks;
      return {
        questionId: question.id,
        selectedAnswer: selected,
        isCorrect,
      };
    });

    const totalMarks = quiz.totalMarks;
    const percentage =
      totalMarks > 0 ? Number(((score / totalMarks) * 100).toFixed(2)) : 0;
    const status = score >= quiz.passingMarks ? "PASS" : "FAIL";

    const result = await db.result.create({
      data: {
        userId: session.id,
        quizId: quiz.id,
        score,
        totalMarks,
        percentage,
        status,
        timeSpent: parsed.timeSpent,
        answers: { create: answerRecords },
      },
      select: { id: true },
    });

    return NextResponse.json({ resultId: result.id });
  },
);
