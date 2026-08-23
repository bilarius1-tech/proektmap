import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

// POST /api/admin/auto-link — auto-creates Relations for a Blueprint or Tool
export async function POST(req: NextRequest) {
  const { sourceType, sourceSlug } = await req.json();
  if (!sourceType || !sourceSlug) {
    return NextResponse.json({ error: "sourceType and sourceSlug required" }, { status: 400 });
  }

  const db = await getDb();
  const created: string[] = [];

  if (sourceType === "blueprint") {
    const bp = await db.blueprint.findUnique({ where: { slug: sourceSlug } });
    if (!bp) return NextResponse.json({ error: "Blueprint not found" }, { status: 404 });

    const keywords = extractTechKeywords(bp);
    
    // Match against AiTools
    if (keywords.length > 0) {
      const tools = await db.aITool.findMany({
        where: { isActive: true, OR: keywords.map(k => ({
          OR: [
            { name: { contains: k, mode: "insensitive" as const } },
            { description: { contains: k, mode: "insensitive" as const } },
            { bestFor: { contains: k, mode: "insensitive" as const } },
          ]
        })) },
        select: { slug: true, name: true },
      });

      for (const tool of tools) {
        try {
          await db.relation.create({
            data: {
              sourceType: "blueprint",
              sourceSlug,
              targetType: "aitool",
              targetSlug: tool.slug,
              relType: "uses",
              weight: 5,
            },
          });
          created.push(`aitool:${tool.slug}`);
        } catch (e: any) {
          // ignore duplicates
        }
      }
    }

    // Match against MCPServers
    if (keywords.length > 0) {
      const mcps = await db.mCPServer.findMany({
        where: { OR: keywords.map(k => ({
          OR: [
            { name: { contains: k, mode: "insensitive" as const } },
            { description: { contains: k, mode: "insensitive" as const } },
            { tags: { contains: k, mode: "insensitive" as const } },
          ]
        })) },
        select: { slug: true, name: true },
      });

      for (const mcp of mcps) {
        try {
          await db.relation.create({
            data: {
              sourceType: "blueprint",
              sourceSlug,
              targetType: "mcp",
              targetSlug: mcp.slug,
              relType: "uses",
              weight: 3,
            },
          });
          created.push(`mcp:${mcp.slug}`);
        } catch (e: any) {}
      }
    }
  }

  if (sourceType === "aitool") {
    const tool = await db.aITool.findUnique({ where: { slug: sourceSlug } });
    if (!tool) return NextResponse.json({ error: "Tool not found" }, { status: 404 });

    // Match against Blueprints
    const toolKeywords = [
      tool.name, tool.description || "", tool.bestFor || "",
      tool.type || "", tool.provider || "",
    ].join(" ").toLowerCase();

    const blueprints = await db.blueprint.findMany({
      where: { isPublished: true },
      select: { slug: true, title: true, description: true, entities: true, goal: true, checklist: true },
    });

    for (const bp of blueprints) {
      const bpText = [bp.description || "", bp.goal || "", bp.entities || "[]", bp.checklist || "[]"].join(" ").toLowerCase();
      const keywords = extractTechKeywords(bp);
      
      // Check if tool name or keywords match
      const toolNameLower = tool.name.toLowerCase();
      const matches = keywords.some(k => bpText.includes(k)) || 
                      bpText.includes(toolNameLower) ||
                      (tool.bestFor && bpText.includes(tool.bestFor.toLowerCase()));

      if (matches) {
        try {
          await db.relation.create({
            data: {
              sourceType: "blueprint",
              sourceSlug: bp.slug,
              targetType: "aitool",
              targetSlug: sourceSlug,
              relType: "uses",
              weight: 5,
            },
          });
          created.push(`blueprint:${bp.slug}`);
        } catch (e: any) {}
      }
    }
  }

  return NextResponse.json({ ok: true, created, count: created.length });
}

// Reuse the same keyword extraction
function extractTechKeywords(bp: any): string[] {
  const keywords: string[] = [];
  const text = [
    bp.description || "",
    bp.goal || "",
    typeof bp.entities === "string" ? bp.entities : JSON.stringify(bp.entities || []),
    typeof bp.checklist === "string" ? bp.checklist : JSON.stringify(bp.checklist || []),
  ].join(" ").toLowerCase();

  const techMap: Record<string, string[]> = {
    // Frontend
    "next.js": ["next.js", "nextjs", "next js", "next 14", "next 15"],
    "react": ["react", "reactjs", "jsx"],
    "typescript": ["typescript", "type script", "ts"],
    "tailwind": ["tailwind", "tailwindcss", "tailwind css"],
    // Backend / DB
    "prisma": ["prisma", "prisma orm"],
    "postgresql": ["postgresql", "postgres", "pg", "pgvector"],
    "node.js": ["node.js", "nodejs", "node js", "node"],
    // AI / ML
    "openai": ["openai", "gpt-4", "gpt-4o", "gpt 4", "chatgpt"],
    "claude": ["claude", "anthropic", "claude sonnet"],
    "openrouter": ["openrouter", "open router"],
    "deepseek": ["deepseek", "deep seek"],
    "rag": ["rag", "retrieval", "embedding", "embeddings", "vector db", "vector database"],
    // Messaging / Bots
    "telegram": ["telegram", "бот", "bot", "tg bot", "телеграм"],
    "python": ["python", "aiogram", "python-telegram"],
    // Payments
    "yookassa": ["yookassa", "юkassa", "юкасса", "yookassa", "платеж", "платежи", "оплата", "payments", "checkout"],
    "stripe": ["stripe"],
    // Infra
    "docker": ["docker", "docker compose"],
    "vercel": ["vercel", "deploy"],
    "redis": ["redis"],
    "nextauth": ["nextauth", "next auth", "авторизация", "auth", "oauth"],
    // E-commerce / Business
    "crm": ["crm", "клиенты", "сделки", "воронка", "kanban", "канбан"],
    "e-commerce": ["магазин", "ecommerce", "e-commerce", "каталог", "корзина", "cart"],
    "marketplace": ["marketplace", "маркетплейс", "продавцы", "комиссия"],
    "saas": ["saas", "подписки", "subscription", "личный кабинет"],
    // Games
    "gamedev": ["игра", "game", "unity", "godot", "phaser", "gamedev"],
  };

  for (const [key, patterns] of Object.entries(techMap)) {
    if (patterns.some(p => text.includes(p))) {
      keywords.push(key);
    }
  }

  return keywords;
}
