import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

function translit(text: string): string {
  const map: any = { а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya" };
  return text.toLowerCase().split("").map((c: string) => map[c] || c).join("");
}

// Parse RSS/XML properly using simple regex that handles CDATA
function parseXmlItems(xml: string): { title: string; link: string; description: string }[] {
  const items: any[] = [];
  // Try <item> tags (RSS) first, then <entry> (Atom)
  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) || xml.match(/<entry>[\s\S]*?<\/entry>/g) || [];
  for (const block of blocks.slice(0, 5)) {
    const title = (block.match(/<title[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/i)?.[1] || "").replace(/\s+/g, " ").trim();
    const link = block.match(/<link[^>]*>(.*?)<\/link>/i)?.[1] || block.match(/<link[^>]*href="([^"]*)"/i)?.[1] || "";
    const desc = (block.match(/<description[^>]*>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/i)?.[1] || block.match(/<summary[^>]*>(.*?)<\/summary>/i)?.[1] || "").replace(/\s+/g, " ").trim();
    if (title) items.push({ title, link, description: desc.slice(0, 500) });
  }
  return items;
}

// Clean slug: keep only latin, digits, hyphens
function cleanSlug(title: string): string {
  const clean = title.replace(/[^a-zа-я0-9\s-]/gi, "").trim();
  return translit(clean).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

export async function POST() {
  // Auth check
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = await getDb();
  const feeds = await db.blogFeed.findMany({ where: { isActive: true } });
  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) return NextResponse.json({ error: "Админ не найден" }, { status: 500 });

  let key = process.env.DEEPSEEK_API_KEY;
  try { const s = await db.siteSettings.findUnique({ where: { id: "main" } }); if (s?.deepseekApiKey) key = s.deepseekApiKey; } catch {}
  if (!key) return NextResponse.json({ error: "Нет DEEPSEEK_API_KEY" }, { status: 500 });

  const results: any[] = [];
  let totalCreated = 0;

  for (const feed of feeds) {
    try {
      const res = await fetch(feed.url, {
        headers: { "Accept": feed.type === "xml" ? "application/xml,text/xml" : "application/json", "User-Agent": "ProektMap/1.0" },
        signal: AbortSignal.timeout(15000),
      });
      if (!res.ok) {
        results.push({ feed: feed.name, status: "error", reason: `HTTP ${res.status}` });
        continue;
      }

      const raw = await res.text();
      if (!raw || raw.length < 50) {
        results.push({ feed: feed.name, status: "empty" });
        continue;
      }

      let items: { title: string; link: string; description: string; image?: string }[] = [];

      if (feed.type === "json") {
        try {
          const json = JSON.parse(raw);
          if (json.hits) {
            items = json.hits.map((h: any) => ({ title: h.title || h.story_title || "", link: h.url || `https://news.ycombinator.com/item?id=${h.objectID}`, description: (h.story_text || h.comment_text || "").slice(0, 500) }));
          } else if (json.data?.children) {
            items = json.data.children.map((c: any) => { const d = c.data; return { title: d.title, link: `https://reddit.com${d.permalink}`, description: (d.selftext || "").slice(0, 500), image: d.thumbnail?.startsWith("http") ? d.thumbnail : d.preview?.images?.[0]?.source?.url?.replace(/&amp;/g, "&") }; });
          } else if (json.items) {
            items = json.items.slice(0, 5).map((i: any) => ({ title: i.full_name || i.name, link: i.html_url || i.url, description: (i.description || "").slice(0, 500), image: i.owner?.avatar_url || null }));
          } else if (Array.isArray(json)) {
            items = json.slice(0, 5).map((i: any) => ({ title: i.title || i.name || "", link: i.url || i.link || "", description: (i.description || i.summary || "").slice(0, 500) }));
          }
        } catch (e: any) {
          results.push({ feed: feed.name, status: "error", reason: "JSON parse: " + (e.message?.slice(0, 50) || "unknown") });
          continue;
        }
      } else {
        items = parseXmlItems(raw);
      }

      // Filter out items with titles that are too short or just URLs
      items = items.filter(i => i.title && i.title.length >= 10 && !/^https?:\/\//.test(i.title));

      if (items.length === 0) {
        results.push({ feed: feed.name, status: "empty" });
        continue;
      }

      let feedCreated = 0;
      for (const item of items.slice(0, 2)) {
        try {
          // Better duplicate detection: check slug first, then link in metaDesc
          const candidateSlug = cleanSlug(item.title);
          const slugExists = await db.blogPost.findUnique({ where: { slug: candidateSlug } });
          if (slugExists) continue;

          const linkExists = await db.blogPost.findFirst({
            where: { metaDesc: { contains: item.link ? item.link.slice(0, 80) : "" } }
          });
          if (linkExists) continue;

          // Download cover image
          let coverImage = `https://proektmap.ru/api/og?title=${encodeURIComponent(item.title.slice(0, 80))}&category=${encodeURIComponent(feed.category)}`;
          if (item.image) {
            try {
              const imgRes = await fetch(item.image, { signal: AbortSignal.timeout(5000) });
              if (imgRes.ok && imgRes.headers.get("content-type")?.startsWith("image")) {
                const buffer = Buffer.from(await imgRes.arrayBuffer());
                if (buffer.length > 0 && buffer.length < 5 * 1024 * 1024) { // < 5MB
                  const ext = (item.image.split(".").pop()?.split("?")[0] || "jpg").replace(/[^a-z]/gi, "");
                  const filename = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
                  const { writeFile, mkdir } = await import("fs/promises");
                  const { join } = await import("path");
                  await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });
                  await writeFile(join(process.cwd(), "public", "uploads", filename), buffer);
                  coverImage = `/uploads/${filename}`;
                }
              }
            } catch {}
          }

          // AI translation via DeepSeek
          const prompt = `Ты редактор блога об AI. Переведи и адаптируй новость на РУССКИЙ язык (200-300 слов).

Оригинал: ${item.title}
Источник: ${item.link}

ФОРМАТ ОТВЕТА:
ЗАГОЛОВОК: <заголовок на русском, осмысленный, без английских слов>
<текст заметки 2-3 абзаца>
📎 [Источник](${item.link})

Правила:
- Заголовок — ТОЛЬКО русский язык
- Не используй markdown кроме ссылок [текст](url)
- Пиши живым языком, как для Telegram-канала`;

          const aiRes = await fetch("https://api.deepseek.com/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${key}` },
            body: JSON.stringify({ model: "deepseek-chat", messages: [{ role: "user", content: prompt }], max_tokens: 800, temperature: 0.6 }),
            signal: AbortSignal.timeout(30000),
          });

          if (!aiRes.ok) {
            console.error(`DeepSeek API error ${aiRes.status}: ${await aiRes.text().catch(() => "")}`);
            continue;
          }

          const aiData = await aiRes.json();
          const fullText = aiData.choices?.[0]?.message?.content;
          if (!fullText) continue;

          // Extract title
          let title = item.title;
          const tm = fullText.match(/ЗАГОЛОВОК:\s*(.+)/);
          if (tm) title = tm[1].trim();

          // Remove title line from content
          let content = fullText.replace(/ЗАГОЛОВОК:\s*.+(\n|$)/, "").trim();
          content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--color-accent)">$1</a>');
          const excerpt = content.replace(/<[^>]+>/g, "").replace(/[#*\[\]()]/g, "").slice(0, 200).replace(/\n/g, " ");

          const slug = cleanSlug(title);
          if (!slug) continue;

          // Ensure category exists
          let cat = await db.blogCategory.findFirst({ where: { name: feed.category } });
          if (!cat) cat = await db.blogCategory.create({ data: { name: feed.category, slug: feed.category.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").slice(0, 50) } });

          await db.blogPost.create({
            data: {
              title, slug, content, excerpt, coverImage,
              status: "published", authorId: admin.id, categoryId: cat.id,
              tags: "AI,новости", aiGenerated: true, aiModel: "deepseek-chat",
              metaTitle: title + " — Карта роста", metaDesc: excerpt,
              publishedAt: new Date(),
            },
          });

          feedCreated++;
          totalCreated++;
          results.push({ feed: feed.name, title: title.slice(0, 60), slug, status: "published" });
        } catch (itemErr: any) {
          results.push({ feed: feed.name, title: item.title?.slice(0, 40), status: "error", reason: itemErr.message?.slice(0, 60) });
        }
      }

      await db.blogFeed.update({ where: { id: feed.id }, data: { lastFetched: new Date() } });
      if (feedCreated === 0 && results.filter(r => r.feed === feed.name && r.status === "error").length === 0) {
        results.push({ feed: feed.name, status: "dup", reason: "all duplicates" });
      }
    } catch (feedErr: any) {
      results.push({ feed: feed.name, status: "error", reason: (feedErr.message || "unknown").slice(0, 80) });
    }
  }

  return NextResponse.json({ results, totalCreated });
}
