import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const { idea } = await req.json();
  if (!idea || idea.length < 10) return NextResponse.json({ error: "Слишком короткое описание" }, { status: 400 });

  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const key = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!key) return NextResponse.json({ error: "API key not configured" }, { status: 500 });

  const systemPrompt = `Ты — AI-Архитектор. Проанализируй бизнес-идею и верни ТОЛЬКО JSON (без markdown):

{
  "productType": "Тип продукта (SaaS/Бот/Лендинг/CRM/Маркетплейс/API/Другое)",
  "complexity": число 1-10,
  "mvpDays": "Оценка MVP (например: 5-7 дней)",
  "monetization": "Модель монетизации",
  "entities": ["Сущность1 - описание", "Сущность2 - описание", ...],
  "integrations": ["Интеграция1", "Интеграция2", ...],
  "mcpServers": ["mcp-сервер1", "mcp-сервер2", ...],
  "promptTypes": ["тип промпта1", "тип промпта2", ...],
  "patternSlugs": ["slug-паттерна1", ...],
  "mistakes": ["Типичная ошибка 1", "Типичная ошибка 2", ...],
  "costDev": "Часы разработки (например: 20-30 часов)",
  "costAi": "AI-расходы (например: 15/мес)",
  "costServer": "Сервер (например: 5/мес)",
  "plan": ["Этап 1: ...", "Этап 2: ...", "Этап 3: ..."],
  "summary": "Краткое резюме проекта, 2-3 предложения"
}`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: idea }], max_tokens: 2000, temperature: 0.5 }),
    });
    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: "DeepSeek API error: " + (data.error?.message || res.status), raw: "", patterns: [], mcp: [], prompts: [] });
    const text = data.choices?.[0]?.message?.content || "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse failed", raw: text };

    // Enrich: resolve pattern slugs to actual patterns
    if (result.patternSlugs?.length > 0) {
      result.patterns = await db.buildPattern.findMany({
        where: { slug: { in: result.patternSlugs }, isPublished: true },
        select: { title: true, slug: true, difficulty: true, stack: true },
      });
    } else { result.patterns = []; }

    // Enrich: resolve MCP servers
    if (result.mcpServers?.length > 0) {
      result.mcp = await db.mCPServer.findMany({
        where: { slug: { in: result.mcpServers } },
        select: { name: true, slug: true, category: true },
      });
    } else { result.mcp = []; }

    // Enrich: resolve prompts
    if (result.promptTypes?.length > 0) {
      result.prompts = await db.promptBlueprint.findMany({
        where: { OR: result.promptTypes.map((t: string) => ({ category: { contains: t, mode: "insensitive" as const } })) },
        select: { title: true, slug: true, category: true }, take: 5,
      });
    } else { result.prompts = []; }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
