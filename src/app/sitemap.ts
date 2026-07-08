import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";

export default async function Sitemap() {
  const base = "https://proektmap.ru";
  const now = new Date();

  const items: { url: string; lastModified: Date; priority: number }[] = [
    { url: base, lastModified: now, priority: 1 },
    { url: `${base}/corporate-website`, lastModified: now, priority: 0.9 },
    { url: `${base}/blog`, lastModified: now, priority: 0.9 },
    { url: `${base}/blog/tags`, lastModified: now, priority: 0.7 },
    { url: `${base}/prompts`, lastModified: now, priority: 0.8 },
    { url: `${base}/contacts`, lastModified: now, priority: 0.5 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${base}/terms`, lastModified: now, priority: 0.3 },
    { url: `${base}/offer`, lastModified: now, priority: 0.3 },
    { url: `${base}/refund`, lastModified: now, priority: 0.3 },
  ];

  try {
    const db = await getDb();
    const posts = await db.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, updatedAt: true },
      orderBy: { publishedAt: "desc" }, take: 100,
    });
    for (const p of posts) {
      items.push({ url: `${base}/blog/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 });
    }
  } catch {}

  return items.map(p => ({ url: p.url, lastModified: p.lastModified, changeFrequency: "weekly" as const, priority: p.priority }));
}
