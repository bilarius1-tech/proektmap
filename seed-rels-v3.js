const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const p = new PrismaClient({ adapter: new PrismaPg({ connectionString: "postgresql://leads_user:leads_pwd_2025_secure@localhost:5433/proektmap?schema=public" }) });

async function seed() {
  const rels = [
    { sourceType:"mcp", sourceSlug:"firecrawl-mcp", targetType:"glossary", targetSlug:"skraping", relType:"related" },
    { sourceType:"mcp", sourceSlug:"postgres-mcp", targetType:"pattern", targetSlug:"business-dashboard", relType:"uses" },
    { sourceType:"mcp", sourceSlug:"postgres-mcp", targetType:"glossary", targetSlug:"baza-dannykh", relType:"related" },
    { sourceType:"mcp", sourceSlug:"github-mcp", targetType:"glossary", targetSlug:"git", relType:"related" },
    { sourceType:"mcp", sourceSlug:"telegram-mcp", targetType:"pattern", targetSlug:"telegram-orders", relType:"uses" },
    { sourceType:"mcp", sourceSlug:"telegram-mcp", targetType:"pattern", targetSlug:"ai-consultant", relType:"uses" },
    { sourceType:"pattern", sourceSlug:"ai-seo-auditor", targetType:"glossary", targetSlug:"seo", relType:"related" },
    { sourceType:"pattern", sourceSlug:"ai-consultant", targetType:"mcp", targetSlug:"telegram-mcp", relType:"uses" },
    { sourceType:"pattern", sourceSlug:"business-dashboard", targetType:"mcp", targetSlug:"postgres-mcp", relType:"uses" },
  ];

  let count = 0;
  for (const r of rels) {
    try {
      await p.relation.create({ data: r });
      count++;
    } catch (e) {
      // Already exists, skip
    }
  }
  console.log("Seeded", count, "new relations. Total:", await p.relation.count());
  await p.$disconnect();
}
seed();
