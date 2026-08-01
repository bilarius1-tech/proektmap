import { getDb } from "@/lib/db/index";
import BlogPageClient from "./client";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string; q?: string }> }): Promise<Metadata> {
  const { page: pageStr, cat } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const baseUrl = "https://proektmap.ru";

  const canonical = cat
    ? `${baseUrl}/blog?cat=${cat}${page > 1 ? `&page=${page}` : ""}`
    : page > 1
      ? `${baseUrl}/blog?page=${page}`
      : `${baseUrl}/blog`;

  return {
    title: cat ? `Блог: ${cat} — Карта роста` : "Блог — Карта роста",
    description: "AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.",
    alternates: { canonical },
    openGraph: {
      title: "Блог — Карта роста",
      description: "AI-инжиниринг, разработка, дизайн, SEO.",
      images: [{ url: `${baseUrl}/api/og?title=Блог&category=ProektMap`, width: 1200, height: 630 }],
    },
  };
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; cat?: string; q?: string; edit?: string }> }) {
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
      include: { author: { select: { name: true, email: true } }, category: { select: { name: true, slug: true } }, _count: { select: { comments: true } } },
    }),
    db.blogPost.count({ where }),
    db.blogCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const totalPages = Math.ceil(total / perPage);
  const baseUrl = "https://proektmap.ru";

  return (
    <>
      {/* Pagination links for SEO */}
      {page > 1 && <link rel="prev" href={`${baseUrl}/blog${cat ? `?cat=${cat}&` : "?"}page=${page - 1}`} />}
      {page < totalPages && <link rel="next" href={`${baseUrl}/blog${cat ? `?cat=${cat}&` : "?"}page=${page + 1}`} />}
      <BlogPageClient posts={JSON.parse(JSON.stringify(posts))} categories={JSON.parse(JSON.stringify(categories))} total={total} page={page} perPage={perPage} currentCat={cat || ""} />
    </>
  );
}
