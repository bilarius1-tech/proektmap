import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

// Universal graph node API — returns all related entities for any node type
export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get("type") || "";
  const slug = req.nextUrl.searchParams.get("slug") || "";
  if (!slug || !type) return NextResponse.json({});

  const db = await getDb();
  const result: any = { terms: [], prompts: [], patterns: [], mcp: [], tools: [] };

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
  }

  // 3. Fallback: if no relations, do keyword matching (as before)
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

  return NextResponse.json(result);
}
