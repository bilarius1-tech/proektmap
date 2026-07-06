import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let _db: PrismaClient | null = null;
let _initError: string | null = null;

async function getDb(): Promise<PrismaClient> {
  if (_db) return _db;
  if (_initError) throw new Error(_initError);
  try {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL не задан");
    const { PrismaPg: Pg } = await import("@prisma/adapter-pg");
    _db = new PrismaClient({ adapter: new Pg({ connectionString: url }) });
    return _db;
  } catch (e: any) {
    _initError = e.message;
    throw e;
  }
}

// Simple proxy that calls getDb() on each access
function createProxy(): PrismaClient {
  return new Proxy({} as PrismaClient, {
    get(_, prop) {
      if (prop === "then") return undefined;
      return (...args: any[]) => {
        return getDb().then(db => (db as any)[prop](...args));
      };
    },
  });
}

export const db = createProxy();
