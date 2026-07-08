import { getDb } from "@/lib/db/index";
import PostPageClient from "./client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const post = await db.blogPost.findUnique({ where: { slug } });
  if (!post) return {};
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" as const },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, email: true } },
      category: { select: { name: true, slug: true } },
      comments: {
        where: { status: "approved", parentId: null },
        orderBy: { createdAt: "desc" },
        include: { replies: { where: { status: "approved" }, orderBy: { createdAt: "asc" } } },
      },
    },
  });

  if (!post || post.status !== "published") notFound();

  // Increment view count
  await db.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

  return <PostPageClient post={JSON.parse(JSON.stringify(post))} />;
}
