import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { ForbiddenError, UnauthorisedError } from "@/lib/auth";

/**
 * Wrap a route handler so thrown auth/zod errors become clean JSON
 * responses. Uses a variadic signature so it works for both static
 * routes (handler receives `request`) and dynamic routes
 * (handler receives `request, ctx` where ctx.params is a Promise).
 */
export function apiHandler<A extends unknown[]>(
  handler: (...args: A) => Promise<NextResponse>,
) {
  return async (...args: A): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof UnauthorisedError) {
        return NextResponse.json({ error: err.message }, { status: 401 });
      }
      if (err instanceof ForbiddenError) {
        return NextResponse.json({ error: err.message }, { status: 403 });
      }
      if (err instanceof ZodError) {
        return NextResponse.json(
          { error: "Validation failed", issues: err.issues },
          { status: 400 },
        );
      }
      const message = err instanceof Error ? err.message : "Server error";
      console.error("[api]", message, err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
