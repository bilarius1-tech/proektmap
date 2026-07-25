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
  "productType": "Тип продукта (SaaS/Бот/Лендинг/CRM/Маркетплейс/API)",
  "expertRecommendation": "Краткая экспертная рекомендация: какой вариант выбрать и почему. 2-3 предложения.",
  "options": [
    {
      "name": "Название варианта (например: Быстрый MVP)",
      "description": "Краткое описание подхода, 1-2 предложения",
      "complexity": число 1-10,
      "mvpDays": "Оценка (5-7 дней)",
      "pros": ["Плюс 1", "Плюс 2", "Плюс 3"],
      "cons": ["Минус 1", "Минус 2"],
      "monetization": "Модель",
      "costDev": "20-30 часов",
      "costAi": "15/мес",
      "costServer": "5/мес",
      "entities": ["Сущность1 - описание", "Сущность2"],
      "plan": ["Этап 1: ...", "Этап 2: ...", "Этап 3: ..."],
      "mcpServers": ["slug1", "slug2"],
      "patternSlugs": ["slug1", "slug2"],
      "promptTypes": ["тип1", "тип2"],
      "mistakes": ["Ошибка 1", "Ошибка 2"],
      "summary": "Резюме варианта, 2-3 предложения"
    }
  ]
}

Создай РОВНО 3 варианта: от простого к сложному. Первый — быстрый MVP, второй — сбалансированный, третий — максимальный. Варианты должны реально отличаться архитектурой и стеком, а не формулировками.`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: idea }], max_tokens: 3000, temperature: 0.5 }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse failed", raw: text };

    // Enrich each option: resolve slugs to actual DB entities
    if (result.options) {
      for (const opt of result.options) {
        if (opt.patternSlugs?.length) opt.patterns = await db.buildPattern.findMany({ where: { slug: { in: opt.patternSlugs }, isPublished: true }, select: { title: true, slug: true, difficulty: true } });
        else opt.patterns = [];
        if (opt.mcpServers?.length) opt.mcp = await db.mCPServer.findMany({ where: { slug: { in: opt.mcpServers } }, select: { name: true, slug: true, category: true } });
        else opt.mcp = [];
        if (opt.promptTypes?.length) opt.prompts = await db.promptBlueprint.findMany({ where: { OR: opt.promptTypes.map((t: string) => ({ category: { contains: t, mode: "insensitive" as const } })) }, select: { title: true, slug: true, category: true }, take: 5 });
        else opt.prompts = [];
      }
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
