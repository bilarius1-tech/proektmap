import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

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
