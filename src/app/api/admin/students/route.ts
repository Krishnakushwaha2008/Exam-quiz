import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { apiHandler } from "@/lib/api";

/** GET /api/admin/students — list students with their attempt summary. */
export const GET = apiHandler(async () => {
  await requireAdmin();

  const students = await db.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { createdAt: "desc" },
    include: {
      results: {
        orderBy: { attemptedAt: "desc" },
        select: {
          id: true,
          percentage: true,
          status: true,
          attemptedAt: true,
        },
      },
    },
  });

  return NextResponse.json({
    students: students.map((s) => {
      const attempts = s.results;
      const attemptCount = attempts.length;
      const avgScore =
        attemptCount > 0
          ? Number(
              (
                attempts.reduce((a, r) => a + r.percentage, 0) /
                  attemptCount
              ).toFixed(2),
            )
          : 0;
      const passed = attempts.filter((r) => r.status === "PASS").length;
      const lastAttempt = attempts[0]?.attemptedAt ?? null;
      return {
        id: s.id,
        name: s.name,
        email: s.email,
        createdAt: s.createdAt,
        attemptCount,
        avgScore,
        passed,
        lastAttempt,
      };
    }),
  });
});
