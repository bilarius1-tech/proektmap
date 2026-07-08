import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import PostPageClient from "./client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "admin";
  const post = await db.blogPost.findUnique({ where: { slug }, include: { category: true, author: true } });
  if (!post || post.status !== "published") return {};
  const ogImage = `https://proektmap.ru/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.name || "")}&author=${encodeURIComponent(post.author?.name || "")}`;
  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [ogImage] },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const session = await auth();
  const isAdmin = (session?.user as any)?.role === "admin";
  const post = await db.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { name: true, email: true } },
      category: { select: { name: true, slug: true } },
      comments: { where: { status: "approved", parentId: null }, orderBy: { createdAt: "desc" }, include: { replies: { where: { status: "approved" }, orderBy: { createdAt: "asc" } } } },
    },
  });
  if (!post || post.status !== "published") notFound();
  await db.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } });

  // Related posts — score by shared tags
  const postTags = (post.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);
  const candidates = await db.blogPost.findMany({
    where: { status: "published", id: { not: post.id } },
    select: { id: true, title: true, slug: true, tags: true, excerpt: true, coverImage: true, category: { select: { name: true } } },
    orderBy: { publishedAt: "desc" }, take: 20,
  });
  const scored: any[] = candidates
    .map((p: any) => ({ ...p, score: (p.tags || "").split(",").filter((t: string) => postTags.includes(t.trim())).length }))
    .filter((p: any) => p.score > 0)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 3);
  const relatedPosts = scored.length >= 2 ? scored : candidates.slice(0, 3);
  const readMore = candidates.find((p: any) => !relatedPosts.find((r: any) => r.id === p.id)) || candidates[0];

  return <PostPageClient post={JSON.parse(JSON.stringify(post))} relatedPosts={JSON.parse(JSON.stringify(relatedPosts))} readMore={JSON.parse(JSON.stringify(readMore || null))} isAdmin={isAdmin} />;
}
