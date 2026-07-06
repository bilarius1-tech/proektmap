import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

<<<<<<< HEAD
let _db: PrismaClient | null = null;

function getDb(): PrismaClient {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан");
  _db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  return _db;
}

export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (prop === "then") return undefined;
    return (getDb() as any)[prop];
  },
});
=======
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrisma() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL не задан");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
}

export const db = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
>>>>>>> cdf468cc (feat: динамический роутинг + главная-дашборд)
