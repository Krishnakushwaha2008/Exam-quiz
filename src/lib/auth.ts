import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

export const SESSION_COOKIE = "oqs_session";
const SECRET =
  process.env.NEXTAUTH_SECRET ||
  process.env.JWT_SECRET ||
  "oqs-dev-secret-change-me-in-production-9f3a7c1e";

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
  secure: process.env.NODE_ENV === "production",
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: "STUDENT" | "ADMIN";
};

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signSession(user: SessionUser): string {
  return jwt.sign(user, SECRET, { expiresIn: "7d" });
}

export function verifySession(token: string): SessionUser | null {
  try {
    const payload = jwt.verify(token, SECRET) as SessionUser;
    if (!payload?.id || !payload?.role) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Set the session cookie from within a Server Action / Route Handler. */
export async function setSession(user: SessionUser) {
  const token = signSession(user);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, COOKIE_OPTS);
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

/**
 * Read & verify the current session from the cookie.
 * Returns the SessionUser or null.
 */
export async function getSession(): Promise<SessionUser | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Get the current session, throwing a 401-shaped error if absent.
 * Use inside route handlers to require auth.
 */
export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    throw new UnauthorisedError();
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireSession();
  if (session.role !== "ADMIN") {
    throw new ForbiddenError();
  }
  return session;
}

export class UnauthorisedError extends Error {
  status = 401;
  constructor() {
    super("Unauthorized — please sign in.");
  }
}

export class ForbiddenError extends Error {
  status = 403;
  constructor() {
    super("Forbidden — admin access required.");
  }
}

/** Ensure the seed admin exists. Safe to call repeatedly. */
export async function ensureSeedAdmin() {
  const existing = await db.user.findUnique({
    where: { email: "admin@oqs.dev" },
  });
  if (!existing) {
    const password = await hashPassword("admin123");
    await db.user.create({
      data: {
        name: "System Administrator",
        email: "admin@oqs.dev",
        password,
        role: "ADMIN",
      },
    });
  }
}
