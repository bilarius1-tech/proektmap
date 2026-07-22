import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ results: [], query: q });

  const db = await getDb();
  const query = q.toLowerCase();

  const [
    glossary, patterns, mcp, tools, blog, decisions, prompts
  ] = await Promise.all([
    db.glossaryTerm.findMany({
      where: { isPublished: true, OR: [
        { term: { contains: query, mode: "insensitive" } },
        { definition: { contains: query, mode: "insensitive" } },
        { simpleExplanation: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, term: true, slug: true, simpleExplanation: true, definition: true, level: true, category: true },
      take: 10,
    }),
    db.buildPattern.findMany({
      where: { isPublished: true, OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, title: true, slug: true, description: true, category: true, difficulty: true },
      take: 8,
    }),
    db.mCPServer.findMany({
      where: { isActive: true, OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { tags: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, name: true, slug: true, description: true, category: true },
      take: 8,
    }),
    db.aITool.findMany({
      where: { isActive: true, OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, name: true, type: true, description: true },
      take: 6,
    }),
    db.blogPost.findMany({
      where: { status: "published", OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, title: true, slug: true, excerpt: true },
      take: 6,
    }),
    db.decision.findMany({
      where: { OR: [
        { title: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, title: true, slug: true, content: true },
      take: 5,
    }),
    db.promptBlueprint.findMany({
      where: { isPublished: true, OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ]},
      select: { id: true, title: true, slug: true, description: true },
      take: 5,
    }),
  ]);

  const results = [
    ...glossary.map(t => ({ ...t, type: "glossary", typeLabel: "📖 Глоссарий", href: "/glossary/" + t.slug, snippet: highlightText(t.simpleExplanation || t.definition, query) })),
    ...patterns.map(p => ({ ...p, type: "pattern", typeLabel: "📦 Паттерн", href: "/patterns/" + p.slug, snippet: highlightText(p.description, query) })),
    ...mcp.map(m => ({ ...m, type: "mcp", typeLabel: "🔌 MCP", href: "/mcp/" + m.slug, snippet: highlightText(m.description, query) })),
    ...tools.map(t => ({ ...t, type: "tool", typeLabel: "🛠️ Инструмент", href: "/ai-tools", snippet: highlightText(t.description, query) })),
    ...blog.map(b => ({ ...b, type: "blog", typeLabel: "📝 Блог", href: "/blog/" + b.slug, snippet: highlightText(b.excerpt || "", query) })),
    ...decisions.map(d => ({ ...d, type: "decision", typeLabel: "⚡ Решение", href: "/corporate-website?stage=" + d.slug, snippet: highlightText(d.content || "", query) })),
    ...prompts.map(p => ({ ...p, type: "prompt", typeLabel: "💬 Промпт", href: "/prompts", snippet: highlightText(p.description, query) })),
  ];

  return NextResponse.json({ results, query: q, total: results.length });
}

function highlightText(text: string, query: string): string {
  if (!text) return "";
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx < 0) return text.substring(0, 150);
  const start = Math.max(0, idx - 60);
  const end = Math.min(text.length, idx + query.length + 60);
  let snippet = text.substring(start, end);
  if (start > 0) snippet = "..." + snippet;
  if (end < text.length) snippet = snippet + "...";
  return snippet;
}
