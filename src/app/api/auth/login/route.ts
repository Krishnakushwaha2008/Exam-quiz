import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { setSession, verifyPassword } from "@/lib/auth";
import { LoginSchema } from "@/lib/validators";
import { apiHandler } from "@/lib/api";

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = LoginSchema.parse(body);

  const user = await db.user.findUnique({
    where: { email: parsed.email },
  });
  if (!user) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  const ok = await verifyPassword(parsed.password, user.password);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 },
    );
  }

  await setSession({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role as "STUDENT" | "ADMIN",
  });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });
});
