import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSession } from "@/lib/auth";
import { RegisterSchema } from "@/lib/validators";
import { apiHandler } from "@/lib/api";

export const POST = apiHandler(async (req: Request) => {
  const body = await req.json();
  const parsed = RegisterSchema.parse(body);

  const exists = await db.user.findUnique({
    where: { email: parsed.email },
  });
  if (exists) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 },
    );
  }

  const password = await hashPassword(parsed.password);
  const user = await db.user.create({
    data: {
      name: parsed.name,
      email: parsed.email,
      password,
      role: "STUDENT",
    },
  });

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
