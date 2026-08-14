import { getDb } from "@/lib/db/index";
import { cardCoverUrl } from "@/lib/og/card-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const posts = await db.blogPost.findMany({
    where: { status: "published" },
    orderBy: { publishedAt: "desc" },
    take: 30,
    include: { author: { select: { name: true } }, category: { select: { name: true } } },
  });

  const baseUrl = "https://proektmap.ru";
  const now = new Date().toUTCString();
  const lastBuild = posts[0]?.publishedAt ? new Date(posts[0].publishedAt).toUTCString() : now;

  const items = posts.map(p => {
    const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : now;
    const safeContent = (p.content || "").replace(/<script/gi, "<scr\"+\"ipt").replace(/<\/script>/gi, "</scr\"+\"ipt>");
    const cardImage = cardCoverUrl({
      title: p.title,
      summary: p.excerpt,
      category: p.category?.name || "ProektMap",
      seed: p.slug,
      baseUrl,
    });
    return `<item>
      <title>${esc(p.title)}</title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <guid isPermaLink="true">${baseUrl}/blog/${p.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${esc(p.excerpt || "")}</description>
      <enclosure url="${esc(cardImage)}" type="image/png" length="0"/>
      <content:encoded><![CDATA[${safeContent}]]></content:encoded>
      <dc:creator>${esc(p.author?.name || "ProektMap")}</dc:creator>
      <category>${esc(p.category?.name || "Без категории")}</category>
    </item>`;
  }).join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Карта роста — Блог</title>
    <link>${baseUrl}/blog</link>
    <description>AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.</description>
    <language>ru</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
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
