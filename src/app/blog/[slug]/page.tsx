import { getDb } from "@/lib/db/index";
import PostPageClient from "./client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const post = await db.blogPost.findUnique({ where: { slug }, include: { category: true, author: true } });
  if (!post || post.status !== "published") return {};

  const ogImage = `https://proektmap.ru/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.name || "")}&author=${encodeURIComponent(post.author?.name || "")}`;

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
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

  await db.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

  // Related posts — same tags, exclude current
  const relatedPosts = await db.blogPost.findMany({
    where: { status: "published", id: { not: post.id }, tags: { contains: post.tags.split(",")[0]?.trim() || "" } },
    take: 3, orderBy: { publishedAt: "desc" },
    include: { category: { select: { name: true } } },
  });

  return <PostPageClient post={JSON.parse(JSON.stringify(post))} relatedPosts={JSON.parse(JSON.stringify(relatedPosts))} />;
}
