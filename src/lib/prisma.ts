import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const provider = process.env.DATABASE_PROVIDER;

  if (provider === "sqlite" || !provider) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
    const dbUrl = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
    const adapter = new PrismaBetterSqlite3({ url: dbUrl });
    return new PrismaClient({ adapter });
  }

  // PostgreSQL
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { PrismaPg } = require("@prisma/adapter-pg");
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
