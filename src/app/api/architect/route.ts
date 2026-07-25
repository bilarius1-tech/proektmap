import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

const SYSTEM_PROMPT = `Ты — Senior Product Manager и Staff Engineer. Создай детальный архитектурный план. Он должен быть настолько конкретным, чтобы новичок понял суть, а AI-агент смог по нему писать код без галлюцинаций.

ЖЁСТКИЕ ПРАВИЛА:
1. Сущности БД — бизнес-специфичные имена с типами полей. НЕ использовать User/Project/Settings. Пример: CrawlTarget (id, url, lastCrawled, status), AuditReport (id, siteId, score, errors[], createdAt).
2. Не противоречить в стеке. Выбрал Next.js — весь документ про Next.js.
3. Ошибки — нишевые. Не "пишите тесты", а "Блокировка IP парсера через Cloudflare".
4. План — 5-8 КОНКРЕТНЫХ шагов с файлами/таблицами/пакетами. Не "Основной функционал", а "Создать коллекцию Article в Strapi: поля title, content, category. Связь one-to-many с Category. Права: editor read/write".
5. Каждый шаг: (а) что создаётся, (б) ключевые пакеты, (в) что работает после шага.

Верни ТОЛЬКО JSON:
{
  "productType": "Тип",
  "expertRecommendation": "Какой вариант выбрать и почему. 2-3 предложения.",
  "recommendedStack": "Стек (Next.js + Prisma + PostgreSQL + Tailwind)",
  "options": [{
    "name": "Название",
    "description": "Описание подхода",
    "complexity": 5,
    "mvpDays": "7-10 дней",
    "pros": ["Плюс 1", "Плюс 2"],
    "cons": ["Минус 1"],
    "monetization": "Модель",
    "costDev": "30-40 часов",
    "costAi": "15/мес",
    "costServer": "5/мес",
    "entities": ["EntityName (id, field1, field2) - описание", "..."],
    "plan": [
      "Шаг 1: Конкретно что создаётся, какие пакеты, что заработает",
      "Шаг 2: ..."
    ],
    "mcpServers": ["slug1"],
    "patternSlugs": ["slug1"],
    "promptTypes": ["тип1"],
    "mistakes": ["Нишевая ошибка 1", "Нишевая ошибка 2"],
    "summary": "Резюме, 2-3 предложения",
    "toolRecommendation": "Каким инструментом делать и почему",
    "aiModelRecommendation": "Какую модель использовать и почему"
  }]
}
3 варианта. От простого к сложному. План — 5-8 шагов.`;

export async function POST(req: NextRequest) {
  const { idea, isPro } = await req.json();
  // Free users get limited analysis — only 3 option names/pros/cons, no details
  const isLimited = !isPro;
  if (!idea || idea.length < 10) return NextResponse.json({ error: "Too short" }, { status: 400 });

  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const key = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!key) return NextResponse.json({ error: "No key" }, { status: 500 });

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: idea }], max_tokens: 6000, temperature: 0.4 }),
    });
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const result = jsonMatch ? JSON.parse(jsonMatch[0]) : { error: "Parse failed", raw: text };

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
