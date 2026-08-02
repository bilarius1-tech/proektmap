import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

// Universal graph node API — returns all related entities for any node type
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "";
  const slug = req.nextUrl.searchParams.get("slug") || "";
  if (!slug || !type) return NextResponse.json({});

  const db = await getDb();
  const result: any = { terms: [], prompts: [], patterns: [], mcp: [], tools: [], blueprints: [] };

  // 1. Get relations from the Relation model (both directions)
  const outgoing = await db.relation.findMany({
    where: { sourceType: type, sourceSlug: slug },
  });
  const incoming = await db.relation.findMany({
    where: { targetType: type, targetSlug: slug },
  });

  // 2. Resolve target entities
  for (const rel of [...outgoing, ...incoming]) {
    const isOut = outgoing.includes(rel);
    const targetType = isOut ? rel.targetType : rel.sourceType;
    const targetSlug = isOut ? rel.targetSlug : rel.sourceSlug;

    if (targetType === "glossary") {
      const t = await db.glossaryTerm.findUnique({ where: { slug: targetSlug }, select: { term: true, slug: true, level: true } });
      if (t && !result.terms.find((x: any) => x.slug === t.slug)) result.terms.push({ ...t, relType: rel.relType });
    }
    if (targetType === "prompt") {
      const p = await db.promptBlueprint.findUnique({ where: { slug: targetSlug }, select: { title: true, slug: true, category: true } });
      if (p && !result.prompts.find((x: any) => x.slug === p.slug)) result.prompts.push({ ...p, relType: rel.relType });
    }
    if (targetType === "pattern") {
      const p = await db.buildPattern.findUnique({ where: { slug: targetSlug }, select: { title: true, slug: true, difficulty: true } });
      if (p && !result.patterns.find((x: any) => x.slug === p.slug)) result.patterns.push({ ...p, relType: rel.relType });
    }
    if (targetType === "mcp") {
      const m = await db.mCPServer.findUnique({ where: { slug: targetSlug }, select: { name: true, slug: true, category: true } });
      if (m && !result.mcp.find((x: any) => x.slug === m.slug)) result.mcp.push({ ...m, relType: rel.relType });
    }
    // NEW: blueprint target
    if (targetType === "blueprint") {
      const bp = await db.blueprint.findUnique({ where: { slug: targetSlug }, select: { title: true, slug: true, difficulty: true, icon: true } });
      if (bp && !result.blueprints.find((x: any) => x.slug === bp.slug)) result.blueprints.push({ ...bp, relType: rel.relType });
    }
    // NEW: aitool target
    if (targetType === "aitool") {
      const t = await db.aITool.findUnique({ where: { slug: targetSlug }, select: { name: true, slug: true, type: true, rating: true, pricingAmount: true } });
      if (t && !result.tools.find((x: any) => x.slug === t.slug)) result.tools.push({ ...t, relType: rel.relType });
    }
  }

  // 3. Fallback: keyword matching for MCP and Blueprint
  const hasRelations = Object.values(result).some((arr: any) => arr.length > 0);
  
  if (!hasRelations && type === "mcp") {
    const server = await db.mCPServer.findUnique({ where: { slug } });
    if (server) {
      const tags = (server.tags || "").toLowerCase().split(",").map((t: string) => t.trim()).filter(Boolean);
      result.terms = await db.glossaryTerm.findMany({
        where: { isPublished: true, OR: tags.flatMap((t: string) => [
          { term: { contains: t, mode: "insensitive" as const } },
        ]) },
        select: { term: true, slug: true, level: true }, take: 4,
      });
      result.patterns = await db.buildPattern.findMany({
        where: { isPublished: true, stack: { contains: slug, mode: "insensitive" as const } },
        select: { title: true, slug: true, difficulty: true }, take: 3,
      });
    }
  }

  // NEW: Fallback for blueprint — keyword match against tools
  if (!hasRelations && type === "blueprint") {
    const bp = await db.blueprint.findUnique({ where: { slug } });
    if (bp) {
      const keywords = extractTechKeywords(bp);
      if (keywords.length > 0) {
        result.tools = await db.aITool.findMany({
          where: { isActive: true, OR: keywords.map(k => ({
            OR: [
              { name: { contains: k, mode: "insensitive" as const } },
              { description: { contains: k, mode: "insensitive" as const } },
              { bestFor: { contains: k, mode: "insensitive" as const } },
            ]
          })) },
          select: { name: true, slug: true, type: true, rating: true, pricingAmount: true },
          take: 6,
        });
      }
    }
  }

  return NextResponse.json(result);
}

// Extract technology keywords from Blueprint entities, checklist, and description
function extractTechKeywords(bp: any): string[] {
  const keywords: string[] = [];
  const text = [
    bp.description || "",
    bp.goal || "",
    bp.entities || "[]",
    bp.checklist || "[]",
  ].join(" ").toLowerCase();

  const techMap: Record<string, string[]> = {
    "next.js": ["next.js", "nextjs", "next js"],
    "react": ["react"],
    "typescript": ["typescript", "type script"],
    "tailwind": ["tailwind"],
    "prisma": ["prisma"],
    "postgresql": ["postgresql", "postgres", "pgvector"],
    "openai": ["openai", "gpt-4", "gpt"],
    "claude": ["claude", "anthropic"],
    "telegram": ["telegram", "bot"],
    "yookassa": ["yookassa", "юkassa", "юкасса", "платеж"],
    "docker": ["docker"],
    "vercel": ["vercel"],
    "stripe": ["stripe"],
    "redis": ["redis"],
    "nextauth": ["nextauth", "next auth"],
    "python": ["python", "aiogram"],
    "rag": ["rag", "retrieval", "embedding", "pgvector"],
    "vercel ai": ["vercel ai", "ai sdk"],
    "openrouter": ["openrouter"],
  };

  for (const [key, patterns] of Object.entries(techMap)) {
    if (patterns.some(p => text.includes(p))) {
      keywords.push(key);
    }
  }

  return keywords;
}
