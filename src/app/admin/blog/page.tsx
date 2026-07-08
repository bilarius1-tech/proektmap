import { getDb } from "@/lib/db/index";
import BlogAdminClient from "./client";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage({ searchParams }: { searchParams: Promise<{ page?: string; author?: string }> }) {
  const { page: pageStr, author } = await searchParams;
  const page = Math.max(1, parseInt(pageStr || "1"));
  const perPage = 20;

  const db = await getDb();
  const where: any = {};
  if (author) where.authorId = author;

  const [posts, total, categories, pendingComments, authors] = await Promise.all([
    db.blogPost.findMany({
      where, orderBy: { createdAt: "desc" },
      skip: (page - 1) * perPage, take: perPage,
      include: { category: { select: { name: true } }, author: { select: { name: true, email: true } } },
    }),
    db.blogPost.count({ where }),
    db.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.blogComment.count({ where: { status: "pending" } }),
    db.user.findMany({ where: { posts: { some: {} } }, select: { id: true, name: true, email: true } }),
  ]);

  return (
    <BlogAdminClient
      posts={JSON.parse(JSON.stringify(posts))}
      categories={JSON.parse(JSON.stringify(categories))}
      authors={JSON.parse(JSON.stringify(authors))}
      pendingComments={pendingComments}
      total={total}
      page={page}
      perPage={perPage}
      currentAuthor={author || ""}
    />
  );
}
