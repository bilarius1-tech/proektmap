import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST() {
  const db = await getDb();
  const feeds = await db.blogFeed.findMany({ where: { isActive: true } });
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) return NextResponse.json({ error: "Админ не найден" }, { status: 500 });

  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) return NextResponse.json({ error: "Нет DEEPSEEK_API_KEY" }, { status: 500 });

  const results: any[] = [];

  for (const feed of feeds) {
    try {
      // Fetch feed
      const res = await fetch(feed.url, {
        headers: feed.type === "json" ? { "Accept": "application/json" } : {},
        signal: AbortSignal.timeout(15000),
      });
      const raw = await res.text();

      // Extract items based on type
      let items: { title: string; link: string; description: string }[] = [];
      if (feed.type === "json") {
        try {
          const json = JSON.parse(raw);
          if (json.hits) items = json.hits.map((h: any) => ({ title: h.title || h.story_title || "", link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, description: h.story_text || h.comment_text || "" }));
          else if (json.data?.children) items = json.data.children.map((c: any) => ({ title: c.data.title, link: `https://reddit.com${c.data.permalink}`, description: c.data.selftext }));
          else if (json.items) items = json.items.slice(0, 5).map((i: any) => ({ title: i.name || i.full_name, link: i.html_url || i.url, description: i.description || "" }));
        } catch {}
      }

      if (items.length === 0) { results.push({ feed: feed.name, status: "empty" }); continue; }

      // Pick top 2 items
      for (const item of items.slice(0, 2)) {
        if (!item.title || item.title.length < 20) continue;

        // Check if already exists
        const exists = await db.blogPost.findFirst({ where: { metaDesc: { contains: item.link.slice(0, 50) } } });
        if (exists) continue;

        // AI generates Russian summary
        const prompt = `Ты — редактор блога об AI. Напиши краткую заметку на русском (200-300 слов) на основе этой новости:

Заголовок: ${item.title}
Источник: ${item.link}
Описание: ${(item.description || "").slice(0, 500)}

Формат: краткий пересказ сути новости + 1-2 предложения почему это важно для AI-инженеров + ссылка на источник.

Пиши живым языком, как для коллеги. Не используй шаблонные фразы.`;

        const aiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
          body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 800 }),
        });

        const aiData = await aiRes.json();
        const content = aiData.choices?.[0]?.message?.content;
        if (!content) continue;

        const title = item.title.slice(0, 120);
        const slug = title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
        const excerpt = content.slice(0, 200);

        // Find category
        let cat = await db.blogCategory.findFirst({ where: { name: feed.category } });
        if (!cat) cat = await db.blogCategory.create({ data: { name: feed.category, slug: feed.category.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-") } });

        await db.blogPost.create({
          data: {
            title, slug, content, excerpt, status: "draft", authorId: admin.id,
            categoryId: cat.id, tags: `AI,${feed.category}`, aiGenerated: true, aiModel: "deepseek-chat",
            metaTitle: title + " — Карта роста", metaDesc: excerpt,
          },
        });

        results.push({ feed: feed.name, title: title.slice(0, 60), status: "draft" });
      }

      await db.blogFeed.update({ where: { id: feed.id }, data: { lastFetched: new Date() } });
    } catch (e: any) {
      results.push({ feed: feed.name, status: "error", reason: e.message.slice(0, 80) });
    }
  }

  return NextResponse.json({ results });
}
