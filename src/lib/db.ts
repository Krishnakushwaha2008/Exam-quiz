import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

type ClientOptions = ConstructorParameters<typeof PrismaClient>[0];

/**
 * Build a Prisma client for the configured database.
 *
 * - `postgres://` (Neon): uses the serverless Neon driver adapter, which
 *   talks to Postgres over HTTPS. Ideal for serverless runtimes and
 *   environments that block outbound TCP/5432.
 * - `file:` (local SQLite): standard PrismaClient, used as a development
 *   fallback before a Neon connection string is configured.
 */
function createPrisma(): PrismaClient {
  const url = process.env.DATABASE_URL ?? "";
  if (url.startsWith("postgres")) {
    const pool = new Pool({ connectionString: url });
    const adapter = new PrismaNeon(pool);
    return new PrismaClient({ adapter } as unknown as ClientOptions);
  }
  return new PrismaClient();
}

export const db = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
