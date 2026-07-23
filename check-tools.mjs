import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const p = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap"
  })
});

const tools = await p.aITool.findMany({ orderBy: { sortOrder: "asc" } });
console.log("Total tools:", tools.length);
for (const t of tools) {
  console.log(t.name, "|", t.creator || "NO_CREATOR", "|", t.shortDescription || "NO_SHORTDESC");
}
await p.();
