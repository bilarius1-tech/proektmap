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

  // Clean URL
  const cleanUrl = url.replace(/[?#].*$/, "").replace(/\/+$/, "").replace(/\.git$/, "");

  let rawText = "";

  // Try GitHub API
  const ghMatch = cleanUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (ghMatch) {
    const repoOwner = ghMatch[1];
    const repoName = ghMatch[2].replace(/[?#].*$/, "").replace(/\.git$/, "");
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}`;

    try {
      const ghRes = await fetch(apiUrl, {
        headers: { "User-Agent": "ProektMap/1.0", "Accept": "application/json" },
        signal: AbortSignal.timeout(10000),
      });

      if (ghRes.status === 404) {
        return NextResponse.json({ error: "Репозиторий не найден на GitHub. Проверьте ссылку." }, { status: 404 });
      }
      if (ghRes.status === 403) {
        return NextResponse.json({ error: "Лимит запросов GitHub API. Попробуйте через минуту." }, { status: 429 });
      }

      if (ghRes.ok) {
        const repo = await ghRes.json();
        rawText = [
          `Name: ${repo.name || repoOwner + "/" + repoName}`,
          `Description: ${repo.description || "(нет описания)"}`,
          `Topics: ${(repo.topics || []).join(", ")}`,
          `Language: ${repo.language || "не указан"}`,
          `Stars: ${repo.stargazers_count || 0}`,
          `URL: ${repo.html_url || url}`,
        ].join("\n");

        // Try README
        try {
          const readmeRes = await fetch(
            `https://api.github.com/repos/${repoOwner}/${repoName}/readme`,
            { headers: { "User-Agent": "ProektMap/1.0", "Accept": "application/json" }, signal: AbortSignal.timeout(5000) }
          );
          if (readmeRes.ok) {
            const readme = await readmeRes.json();
            const content = Buffer.from(readme.content, "base64").toString("utf-8").slice(0, 2500);
            rawText += "\nREADME:\n" + content;
          }
        } catch {}
      }
    } catch (e: any) {
      // GitHub API failed, try fetching the page directly as fallback
      console.error("GitHub API error:", e.message);
    }
  }

  // Fallback: fetch the page directly if GitHub API didn't work
  if (!rawText || rawText.length < 50) {
    try {
      const pageRes = await fetch(url, {
        headers: { "User-Agent": "ProektMap/1.0" },
        signal: AbortSignal.timeout(10000),
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        rawText = html
          .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
          .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 4000);
      }
    } catch (e: any) {
      return NextResponse.json({ error: `Не удалось загрузить страницу: ${e.message}` }, { status: 500 });
    }
  }

  if (!rawText || rawText.length < 50) {
    return NextResponse.json({ error: "На странице недостаточно текста для анализа. Убедитесь что ссылка рабочая." }, { status: 400 });
  }

  // AI fill
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  const key = settings?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
  if (!key) return NextResponse.json({ error: "Нет API ключа" }, { status: 500 });

  const prompt = `Проанализируй информацию о проекте и заполни карточку на русском языке. Верни ТОЛЬКО чистый JSON, без markdown-блоков и пояснений.

{
  "title": "название проекта (на русском, до 80 символов)",
  "description": "что делает проект, 2-3 предложения на русском",
  "techStack": "технологии через запятую, например: Next.js, PostgreSQL, Prisma",
  "aiTools": "AI-инструменты через запятую, например: Cursor, Claude, ChatGPT",
  "authorName": "имя автора или организации",
  "authorUrl": "ссылка на GitHub/сайт автора",
  "category": "Бот, Сайт, SaaS, Игра, Инструмент или Другое",
  "status": "Запущен или В разработке"
}

Информация о проекте:
${rawText.slice(0, 3000)}

URL проекта: ${url}`;

  try {
    const aiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
      body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 800, temperature: 0.3 }),
      signal: AbortSignal.timeout(30000),
    });

    if (!aiRes.ok) {
      const errText = await aiRes.text().catch(() => "");
      return NextResponse.json({ error: `AI API error ${aiRes.status}` }, { status: 502 });
    }

    const aiData = await aiRes.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Extract JSON from response (handle ```json blocks or raw JSON)
    let jsonStr = content;
    const mdMatch = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (mdMatch) jsonStr = mdMatch[1];
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "AI не вернул JSON. Попробуйте ещё раз." }, { status: 500 });
    }

    const project = JSON.parse(jsonMatch[0]);
    project.url = url;

    return NextResponse.json(project);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "AI request failed" }, { status: 500 });
  }
}
