import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { apiHandler } from "@/lib/api";

/** GET /api/admin/stats — aggregate metrics for the admin dashboard. */
export const GET = apiHandler(async () => {
  await requireAdmin();

  const [students, quizzes, results] = await Promise.all([
    db.user.count({ where: { role: "STUDENT" } }),
    db.quiz.count(),
    db.result.findMany({
      orderBy: { attemptedAt: "desc" },
      take: 200,
      include: {
        user: { select: { name: true, email: true } },
        quiz: { select: { title: true, category: true } },
      },
    }),
  ]);

  const totalAttempts = results.length;
  const passed = results.filter((r) => r.status === "PASS").length;
  const avgScore =
    totalAttempts > 0
      ? Number(
          (
            results.reduce((acc, r) => acc + r.percentage, 0) /
            totalAttempts
          ).toFixed(2),
        )
      : 0;
  const passRate =
    totalAttempts > 0
      ? Number(((passed / totalAttempts) * 100).toFixed(2))
      : 0;

  // per-quiz performance
  const quizMap = new Map<
    string,
    { title: string; category: string; attempts: number; sumPct: number }
  >();
  for (const r of results) {
    const key = r.quizId;
    const entry = quizMap.get(key) ?? {
      title: r.quiz.title,
      category: r.quiz.category,
      attempts: 0,
      sumPct: 0,
    };
    entry.attempts += 1;
    entry.sumPct += r.percentage;
    quizMap.set(key, entry);
  }
  const quizPerformance = Array.from(quizMap.entries())
    .map(([id, v]) => ({
      id,
      title: v.title,
      category: v.category,
      attempts: v.attempts,
      avgScore: Number((v.sumPct / v.attempts).toFixed(2)),
    }))
    .sort((a, b) => b.attempts - a.attempts)
    .slice(0, 6);

  const recentResults = results.slice(0, 6).map((r) => ({
    id: r.id,
    studentName: r.user.name,
    quizTitle: r.quiz.title,
    category: r.quiz.category,
    score: r.score,
    totalMarks: r.totalMarks,
    percentage: r.percentage,
    status: r.status,
    attemptedAt: r.attemptedAt,
  }));

  return NextResponse.json({
    totalStudents: students,
    totalQuizzes: quizzes,
    totalAttempts,
    avgScore,
    passRate,
    quizPerformance,
    recentResults,
  });
});
