import { PrismaClient } from "@prisma/client";

// Глобальный синглтон — создаётся при первом использовании в runtime
const globalForPrisma = globalThis as unknown as { db: PrismaClient | null };

async function createPrisma(): Promise<PrismaClient> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан в .env. Добавьте DATABASE_URL.");
  const { PrismaPg } = await import("@prisma/adapter-pg");
  return new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
}

let _dbPromise: Promise<PrismaClient> | null = null;

async function getDb(): Promise<PrismaClient> {
  if (globalForPrisma.db) return globalForPrisma.db;
  if (!_dbPromise) _dbPromise = createPrisma();
  const db = await _dbPromise;
  globalForPrisma.db = db;
  return db;
}

// Экспортируем асинхронные функции вместо синхронного db
// Каждая страница делает: const db = await getDb(); db.blueprint.findUnique(...)
export { getDb };
