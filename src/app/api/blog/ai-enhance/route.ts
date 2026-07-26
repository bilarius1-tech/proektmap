import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const { text, mode } = await req.json();
  if (!text || text.length < 30) return NextResponse.json({ error: "short" }, { status: 400 });
  const db: any = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const key = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!key) return NextResponse.json({ error: "no key" }, { status: 500 });

  const sys = mode === 'reformat'
    ? "Ты — редактор блога. Переформатируй текст в SEO-статью на русском. Добавь H2-H3, абзацы, вступление, заключение. Сохрани все факты и ссылки. Не выдумывай. Верни HTML: h2, h3, p, strong, ul/li."
    : "Ты — эксперт по AI. Расширь текст в глубокую статью на русском. Добавь контекст, примеры, сравнения, 'С чего начать'. Сохрани факты и ссылки. Не выдумывай. Верни HTML.";

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + key },
    body: JSON.stringify({ model: "deepseek-v4-flash", messages: [{ role: "system", content: sys }, { role: "user", content: text }], max_tokens: 4000, temperature: 0.7 }),
  });
  const data = await res.json();
  return NextResponse.json({ html: data.choices?.[0]?.message?.content || "" });
}
