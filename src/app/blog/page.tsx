import { getDb } from "@/lib/db/index";
import BlogPageClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Блог — Карта роста", description: "AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста." };

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string; q?: string }> }) {
  const { page: pageStr, cat, q: searchQ } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = 12;

  const db = await getDb();
  const where: any = { status: "published" };
  if (searchQ) where.OR = [{ title: { contains: searchQ, mode: "insensitive" } }, { content: { contains: searchQ, mode: "insensitive" } }];
  if (cat) where.category = { slug: cat };

  const [posts, total, categories] = await Promise.all([
    db.blogPost.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * perPage,
      take: perPage,
      include: { author: { select: { name: true, email: true } }, category: { select: { name: true, slug: true } } },
    }),
    db.blogPost.count({ where }),
    db.blogCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  return <BlogPageClient posts={JSON.parse(JSON.stringify(posts))} categories={JSON.parse(JSON.stringify(categories))} total={total} page={page} perPage={perPage} currentCat={cat || ""} />;
}
