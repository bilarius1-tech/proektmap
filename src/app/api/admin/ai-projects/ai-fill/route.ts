import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { url } = await req.json();
  if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });

  // Fetch page content
  let rawText = "";
  try {
    // Try GitHub API first if it's a GitHub URL
    const ghMatch = url.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (ghMatch) {
      const apiUrl = `https://api.github.com/repos/${ghMatch[1]}/${ghMatch[2]}`;
      const ghRes = await fetch(apiUrl, {
        headers: { "User-Agent": "ProektMap/1.0", "Accept": "application/json" },
        signal: AbortSignal.timeout(10000),
      });
      if (ghRes.ok) {
        const repo = await ghRes.json();
        rawText = [
          `Name: ${repo.name}`,
          `Description: ${repo.description || ""}`,
          `Topics: ${(repo.topics || []).join(", ")}`,
          `Language: ${repo.language || ""}`,
          `Stars: ${repo.stargazers_count}`,
          `URL: ${repo.html_url}`,
        ].join("\n");

        // Also try to get README
        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/${ghMatch[1]}/${ghMatch[2]}/readme`,
            { headers: { "User-Agent": "ProektMap/1.0", "Accept": "application/json" }, signal: AbortSignal.timeout(5000) }
          );
          if (readmeRes.ok) {
            const readme = await readmeRes.json();
            const content = Buffer.from(readme.content, "base64").toString("utf-8").slice(0, 2000);
            rawText += "\nREADME:\n" + content;
          }
        } catch {}
      }
    } else {
      // Regular URL fetch
      const pageRes = await fetch(url, {
        headers: { "User-Agent": "ProektMap/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      const html = await pageRes.text();
      // Strip HTML tags
      rawText = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 3000);
    }
  } catch (e: any) {
    return NextResponse.json({ error: `Failed to fetch: ${e.message}` }, { status: 500 });
  }

  if (!rawText || rawText.length < 30) {
    return NextResponse.json({ error: "Не удалось извлечь содержимое страницы" }, { status: 400 });
  }

  // AI fill
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const key = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!key) return NextResponse.json({ error: "Нет API ключа" }, { status: 500 });

  const prompt = `Проанализируй информацию о проекте и заполни карточку на русском языке. Верни ТОЛЬКО JSON, без пояснений.

{
  "title": "название проекта (на русском, до 80 символов)",
  "description": "что делает проект, 2-3 предложения на русском",
  "techStack": "технологии через запятую, например: Next.js, PostgreSQL, Prisma",
  "aiTools": "AI-инструменты через запятую, например: Cursor, Claude, ChatGPT",
  "authorName": "имя автора или организации",
  "authorUrl": "ссылка на GitHub/сайт автора",
  "category": "одно из: Бот, Сайт, SaaS, Игра, Инструмент, Другое",
  "status": "Запущен или В разработке"
}

Информация о проекте:
${rawText}

URL: ${url}`;

  try {
    const aiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 800, temperature: 0.3 }),
      signal: AbortSignal.timeout(30000),
    });

    if (!aiRes.ok) {
      return NextResponse.json({ error: `AI API error ${aiRes.status}` }, { status: 502 });
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Extract JSON
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI не вернул JSON" }, { status: 500 });
    }

    const project = JSON.parse(jsonMatch[0]);
    project.url = url;

    return NextResponse.json(project);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "AI request failed" }, { status: 500 });
  }
}
