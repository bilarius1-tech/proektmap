import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, context, cardTitle } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });

  const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY || "";
  
  const systemPrompt = `Ты — AI-Архитектор, инженерный консультант. 
Объясняй простым языком, без жаргона. Термины — объясняй.
Контекст: пользователь проходит карточку «${cardTitle || "проект"}».
${context || ""}
Отвечай на русском. Будь доброжелательным. Кратко: 2-4 предложения + практический совет.`;

  if (DEEPSEEK_KEY) {
    try {
      const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + DEEPSEEK_KEY },
        body: JSON.stringify({
          model: "deepseek-chat",
          messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }],
          max_tokens: 600, temperature: 0.7,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const j = await res.json() as any;
        return NextResponse.json({ advice: j.choices?.[0]?.message?.content || "", model: "deepseek" });
      }
    } catch (e) {}
  }

  return NextResponse.json({ advice: "AI-консультант временно недоступен. Добавьте DEEPSEEK_API_KEY в .env.", model: "none" });
}
