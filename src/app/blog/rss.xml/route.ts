import { getDb } from "@/lib/db/index";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const posts = await db.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 20,
    include: { author: { select: { name: true } }, category: { select: { name: true } } },
  });

  const baseUrl = "https://proektmap.ru";
  const now = new Date().toUTCString();

  const items = posts.map(p => {
    const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : now;
    return `<item>
      <title>${esc(p.title)}</title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(p.excerpt || "")}</description>
      <author>${esc(p.author?.name || "ProektMap")}</author>
      <category>${esc(p.category?.name || "Без категории")}</category>
    </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Карта роста — Блог</title>
    <link>${baseUrl}/blog</link>
    <description>AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.</description>
    <language>ru</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${baseUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

function esc(s: string): string {
  return (s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
