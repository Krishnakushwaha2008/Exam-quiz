import { NextResponse } from "next/server";
import { clearSession } from "@/lib/auth";
import { apiHandler } from "@/lib/api";

export const POST = apiHandler(async () => {
  await clearSession();
  return NextResponse.json({ ok: true });
});
