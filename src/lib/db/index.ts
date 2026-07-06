import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL не задан");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
