import { getDb } from "@/lib/db/index";
import BlogAdminClient from "./client";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage() {
  const db = await getDb();
  const [posts, categories, pendingComments] = await Promise.all([
    db.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { category: { select: { name: true } }, author: { select: { name: true } } }, take: 50 }),
    db.blogCategory.findMany({ orderBy: { sortOrder: "asc" } }),
    db.blogComment.count({ where: { status: "pending" } }),
  ]);
  return <BlogAdminClient posts={JSON.parse(JSON.stringify(posts))} categories={JSON.parse(JSON.stringify(categories))} pendingComments={pendingComments} />;
}
