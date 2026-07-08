import { getDb } from "@/lib/db/index";
import TagsClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Теги — Блог — Карта роста", description: "Все теги блога. AI-инжиниринг, разработка, дизайн, SEO." };

export default async function TagsPage() {
  const db = await getDb();
  const posts = await db.blogPost.findMany({ where: { status: "published" }, select: { tags: true } });

  // Build tag frequency map
  const tagMap: Record<string, number> = {};
  for (const p of posts) {
    for (const t of (p.tags || "").split(",").map(s => s.trim()).filter(Boolean)) {
      tagMap[t] = (tagMap[t] || 0) + 1;
    }
  }

  const tags = Object.entries(tagMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  return <TagsClient tags={tags} />;
}
