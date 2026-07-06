import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let _db: PrismaClient | null = null;

async function getDb(): Promise<PrismaClient> {
  if (_db) return _db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан");
  _db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  return _db;
}

// Прокси для ленивого подключения
// Каждое обращение к db.table.method() резолвит getDb()
function createLazyPrisma(): PrismaClient {
  const cache = new Map<string, any>();

  return new Proxy({} as PrismaClient, {
    get(_, prop: string) {
      if (prop === "then") return undefined;
      if (prop === "$connect" || prop === "$disconnect") {
        return (...args: any[]) => (getDb() as any).then((db: any) => db[prop](...args));
      }
      
      // Для db.blueprint.findUnique()
      if (!cache.has(prop)) {
        cache.set(prop, new Proxy({}, {
          get(_, method: string) {
            return (...args: any[]) => getDb().then((db: any) => {
              const delegate = db[prop];
              return delegate[method](...args);
            });
          },
        }));
      }
      return cache.get(prop);
    },
  });
}

export const db = createLazyPrisma();
