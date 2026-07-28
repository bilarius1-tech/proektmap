import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

const SYSTEM_PROMPT = `Ты — Senior Product Manager и Staff Engineer. Создай детальный архитектурный план для бизнес-идеи. План должен быть настолько конкретным, чтобы AI-агент (Cursor/Claude) смог по нему писать код без галлюцинаций.

ЖЁСТКИЕ ПРАВИЛА:
1. Сущности БД — с ПОЛНЫМИ полями: имя, тип, описание. Пример: CrawlTarget (id UUID PK, url string, depth number, status enum, createdAt timestamp).
2. Стек технологий — каждая технология с ОБОСНОВАНИЕМ. Пример: "BullMQ + Redis — фоновый парсинг тысяч URL без блокировки запросов".
3. План — по НЕДЕЛЯМ с конкретными файлами.
4. Ошибки — специфичные для ниши.
5. Атомарные промпты — 3 конкретных промпта для Cursor/Claude Code, каждый для одного файла/функции.
6. Итоговый промпт — один большой промпт для старта проекта.

Верни ТОЛЬКО JSON:

ТАКЖЕ ПРОВЕДИ АНАЛИЗ РЫНКА И ДОБАВЬ ПОЛЯ:
  "marketAnalysis": {
    "marketSize": "Оценка рынка (1-2 предложения)",
    "targetAudience": "Целевая аудитория",
    "competitors": ["Конкурент 1: описание", "Конкурент 2: описание", "Конкурент 3: описание"],
    "differentiation": "Чем можно выделиться (2-3 предложения)",
    "risks": ["Риск 1", "Риск 2", "Риск 3"],
    "opportunities": ["Возможность 1", "Возможность 2"],
    "monetizationStrategy": "Стратегия монетизации (1-2 предложения)",
    "goToMarket": "Как выйти на рынок (1-2 предложения)"
  },
{
  "productType": "Тип",
  "expertRecommendation": "Рекомендация",
  "recommendedStack": "Стек одной строкой",
  "options": [{
    "name": "Название",
    "description": "Описание",
    "complexity": 5,
    "mvpDays": "7-10 дней",
    "pros": ["+"],
    "cons": ["-"],
    "monetization": "Модель",
    "costDev": "30-40ч",
    "costAi": "15/мес",
    "costServer": "5/мес",
    "entities": ["Entity (id UUID PK, field1 type, field2 type) - описание"],
    "stack": [{"tech": "Технология", "reason": "Обоснование"}],
    "plan": ["Неделя 1: ...", "Неделя 2: ..."],
    "mcpServers": ["slug"],
    "patternSlugs": ["slug"],
    "promptTypes": ["тип"],
    "mistakes": ["Ошибка 1"],
    "atomicPrompts": ["Промпт 1: В файле lib/X.ts создай функцию...", "Промпт 2: ...", "Промпт 3: ..."],
    "masterPrompt": "Ты — senior разработчик. Реализуй проект... (полный промпт)",
    "summary": "Резюме",
    "toolRecommendation": "Инструмент",
    "aiModelRecommendation": "Модель"
  }]
}
3 варианта. Минимум 3 недели в плане. 3 атомарных промпта.`

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
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", { signal: AbortSignal.timeout(35000),
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: SYSTEM_PROMPT }, { role: "user", content: idea }], max_tokens: 8000, temperature: 0.4 }),
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
