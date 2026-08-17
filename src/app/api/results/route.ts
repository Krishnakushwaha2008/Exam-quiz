import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/auth";
import { apiHandler } from "@/lib/api";

/** GET /api/results — current user's attempt history, newest first. */
export const GET = apiHandler(async () => {
  const session = await requireSession();

  const results = await db.result.findMany({
    where: { userId: session.id },
    orderBy: { attemptedAt: "desc" },
    include: {
      quiz: {
        select: { id: true, title: true, category: true, totalMarks: true },
      },
    },
  });

  return NextResponse.json({
    results: results.map((r) => ({
      id: r.id,
      quizId: r.quizId,
      quizTitle: r.quiz.title,
      category: r.quiz.category,
      score: r.score,
      totalMarks: r.totalMarks,
      percentage: r.percentage,
      status: r.status,
      timeSpent: r.timeSpent,
      attemptedAt: r.attemptedAt,
    })),
  });
});
