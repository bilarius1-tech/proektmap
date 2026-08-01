import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { text, mode } = await req.json();
  if (!text || text.length < 30) return NextResponse.json({ error: "Текст слишком короткий (мин. 30 символов)" }, { status: 400 });

  const db: any = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const key = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!key) return NextResponse.json({ error: "Нет API ключа" }, { status: 500 });

  const formatRules = `ВАЖНЫЕ ПРАВИЛА ФОРМАТИРОВАНИЯ:
- Используй ТОЛЬКО чистый HTML без обрамления в \`\`\`html или \`\`\`
- НЕ используй Markdown (**жирный**, *курсив*, - списки)
- ВСЕ теги должны быть строчными: <h2>, <h3>, <p>, <strong>, <em>, <ul>, <ol>, <li>, <blockquote>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <a href="...">
- Ссылки: <a href="URL" target="_blank" rel="noopener">текст</a>
- Таблицы оформляй с <thead> и <tbody>
- Перед таблицами используй <p> с описанием
- Разделяй смысловые блоки заголовками <h2> и <h3>
- В начале статьи — вступление (1-2 абзаца)
- В конце — заключение или призыв к действию
- Используй emoji иконки в заголовках (🔧 🚀 ⚡ 📊 ✅ ❌ 💡)`;

  const sys = mode === 'reformat'
    ? `Ты — редактор блога. Переформатируй текст в SEO-статью на русском языке в формате HTML для TipTap редактора.

${formatRules}

Что нужно сделать:
1. Добавь вступление с контекстом
2. Разбей текст на логические блоки с заголовками <h2> и <h3>
3. Где уместно — добавь таблицу <table> для сравнений
4. Выдели ключевые мысли через <strong>
5. Добавь заключение
6. Сохрани все факты, цифры и ссылки из оригинала
7. НЕ выдумывай новые факты

Ответ должен начинаться сразу с HTML (первый символ — <).`
    : `Ты — эксперт по AI и разработке. Расширь заметку в глубокую статью на русском языке в формате HTML для TipTap редактора.

${formatRules}

Что нужно сделать:
1. Добавь развёрнутое вступление
2. Раскрой тему: добавь контекст, аналогии, примеры из практики
3. Добавь секцию «С чего начать» с конкретными шагами
4. Где уместно — добавь сравнительную таблицу <table>
5. Включи блок «Распространённые ошибки» или «Подводные камни»
6. Добавь заключение с выводами
7. Сохрани все факты и ссылки из оригинала
8. НЕ выдумывай новые факты

Ответ должен начинаться сразу с HTML (первый символ — <).`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: `Исходный текст:\n\n${text}` }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({ error: `DeepSeek API error ${res.status}: ${errText.slice(0, 100)}` }, { status: 502 });
    }

    const data = await res.json();
    let html = data.choices?.[0]?.message?.content || "";

    // Clean up: strip markdown code fences if present
    html = html.replace(/^```html?\s*\n?/i, "").replace(/\n?```\s*$/, "");
    html = html.trim();

    if (!html) return NextResponse.json({ error: "AI не вернул контент" }, { status: 500 });
    if (!html.startsWith("<")) return NextResponse.json({ error: "AI вернул текст вместо HTML. Попробуйте ещё раз." }, { status: 500 });

    return NextResponse.json({ html });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "AI request failed" }, { status: 500 });
  }
}
