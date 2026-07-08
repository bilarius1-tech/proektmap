import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

function translit(text: string): string {
  const map: any = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
  return text.toLowerCase().split("").map((c: string) => map[c] || c).join("");
}

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
      const res = await fetch(feed.url, {
        headers: feed.type === "json" ? { "Accept": "application/json" } : { "User-Agent": "ProektMap/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      const raw = await res.text();

      let items: { title: string; link: string; description: string; image?: string }[] = [];
      if (feed.type === "json") {
        try {
          const json = JSON.parse(raw);
          if (json.hits) items = json.hits.map((h: any) => ({ title: h.title || h.story_title || "", link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, description: h.story_text || h.comment_text || "" }));
          else if (json.data?.children) items = json.data.children.map((c: any) => { const d = c.data; let img = d.thumbnail?.startsWith("http") ? d.thumbnail : d.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&"); return { title: d.title, link: `https://reddit.com${d.permalink}`, description: d.selftext || "", image: img }; });
          else if (json.items) items = json.items.slice(0, 5).map((i: any) => ({ title: i.full_name || i.name, link: i.html_url || i.url, description: i.description || "", image: i.owner?.avatar_url || null }));
        } catch {}
      } else if (feed.type === "xml") {
        const entries = raw.match(/<entry>[\s\S]*?<\/entry>/g) || [];
        items = entries.slice(0, 3).map((e: any) => ({ title: (e.match(/<title>(.*?)<\/title>/)?.[1] || "").replace(/\s+/g, " ").trim(), link: e.match(/<id>(.*?)<\/id>/)?.[1] || "", description: (e.match(/<summary>(.*?)<\/summary>/)?.[1] || "").replace(/\s+/g, " ").trim() }));
      }

      if (items.length === 0) { results.push({ feed: feed.name, status: "empty" }); continue; }

      for (const item of items.slice(0, 2)) {
        if (!item.title || item.title.length < 15) continue;
        const exists = await db.blogPost.findFirst({ where: { metaDesc: { contains: item.link.slice(0, 50) } } });
        if (exists) continue;

        // Download image
        let coverImage = `https://proektmap.ru/api/og?title=${encodeURIComponent(item.title)}&category=${encodeURIComponent(feed.category)}`;
        if (item.image) {
          try {
            const imgRes = await fetch(item.image, { signal: AbortSignal.timeout(5000) });
            if (imgRes.ok && imgRes.headers.get("content-type")?.startsWith("image")) {
              const buffer = Buffer.from(await imgRes.arrayBuffer());
              const ext = item.image.split(".").pop()?.split("?")[0] || "jpg";
              const filename = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
              const { writeFile, mkdir } = await import("fs/promises");
              const { join } = await import("path");
              await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });
              await writeFile(join(process.cwd(), "public", "uploads", filename), buffer);
              coverImage = `/uploads/${filename}`;
            }
          } catch {}
        }

        // AI translates
        const prompt = `Ты редактор блога об AI. Напиши заметку на РУССКОМ языке (250-350 слов).

Заголовок оригинала: ${item.title}
Источник: ${item.link}

ВАЖНО:
1. Начни с заголовка строго в формате: "ЗАГОЛОВОК: русский перевод"
2. Заголовок должен быть ПОЛНОСТЬЮ на русском, без английских слов
3. Затем сам текст заметки
4. В конце добавь: "📎 [Источник](${item.link})"
5. Все ссылки на GitHub делай в формате [название](url)`;

        const aiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
          method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
          body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 1000 }),
        });

        const aiData = await aiRes.json();
        const fullText = aiData.choices?.[0]?.message?.content;
        if (!fullText) continue;

        // Extract title
        let title = item.title;
        const tm = fullText.match(/ЗАГОЛОВОК:\s*(.+)/);
        if (tm) title = tm[1].trim();

        // Remove title line from content
        const content = fullText.replace(/ЗАГОЛОВОК:\s*.+(\n|$)/, "").trim();
        const excerpt = content.replace(/[#*\[\]()]/g, "").slice(0, 200).replace(/\n/g, " ");

        // Generate clean transliterated slug
        const clean = title.replace(/[^a-zа-я0-9\s-]/gi, "").trim();
        const slug = translit(clean).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);

        let cat = await db.blogCategory.findFirst({ where: { name: feed.category } });
        if (!cat) cat = await db.blogCategory.create({ data: { name: feed.category, slug: feed.category.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-") } });

        await db.blogPost.create({
          data: { title, slug, content, excerpt, coverImage, status: "published", authorId: admin.id, categoryId: cat.id, tags: "AI,новости", aiGenerated: true, aiModel: "deepseek-chat", metaTitle: title + " — Карта роста", metaDesc: excerpt, publishedAt: new Date() },
        });

        results.push({ feed: feed.name, title: title.slice(0, 60), slug, status: "published" });
      }

      await db.blogFeed.update({ where: { id: feed.id }, data: { lastFetched: new Date() } });
    } catch (e: any) {
      results.push({ feed: feed.name, status: "error", reason: e.message.slice(0, 80) });
    }
  }

  return NextResponse.json({ results });
}
