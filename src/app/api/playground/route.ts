import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });
  const { getDb } = await import("@/lib/db/index"); const db = await getDb(); const settings = await db.siteSettings.findUnique({ where: { id: "main" } }); const apiKey = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!apiKey) return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  const systemPrompt = "You are an AI that creates web pages. Return ONLY valid HTML inside triple backticks. Use inline styles and inline JS only. No external files. System-ui fonts, responsive, professional minimal design.";
  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + apiKey },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "system", content: systemPrompt }, { role: "user", content: prompt }], max_tokens: 4000, temperature: 0.7 }),
    });
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const m = content.match(/```html\s*([\s\S]*?)```/) || content.match(/```\s*([\s\S]*?)```/);
    return NextResponse.json({ html: m ? m[1].trim() : content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
