import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const { question, context } = await req.json();
  if (!question) return NextResponse.json({ error: "No question" }, { status: 400 });

  // Get key from DB settings first, fallback to env
  let key = process.env.DEEPSEEK_API_KEY;
  try {
    const db = await getDb();
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    if (settings?.deepseekApiKey) key = settings.deepseekApiKey;
  } catch {}

  if (!key) return NextResponse.json({ response: "🔑 AI-помощник пока не настроен. Админ, добавьте ключ DeepSeek в разделе Настройки → AI-модели." });

  try {
    const prompt = `Ты AI-помощник на ProektMap (Карта роста) — школе AI-инженеров. Контекст: ${context || "нет"}. Вопрос: ${question}. Ответь кратко (2-4 предложения), дружелюбно, на русском.`;

    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 300, temperature: 0.7 }),
    });

    const data = await res.json();
    const response = data.choices?.[0]?.message?.content || "Извини, не смог обработать.";
    return NextResponse.json({ response });
  } catch {
    return NextResponse.json({ response: "Упс! Перерыв на кофе. Попробуй через минуту." });
  }
}
