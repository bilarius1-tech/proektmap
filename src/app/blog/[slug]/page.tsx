import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import { highlightCodeBlocks } from "@/lib/blog/highlight";
import PostPageClient from "./client";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const post = await db.blogPost.findUnique({ where: { slug }, include: { category: true, author: true } });
  if (!post || post.status !== "published") return {};

  const ogImage = post.coverImage?.startsWith("/")
    ? `https://proektmap.ru${post.coverImage}`
    : post.coverImage || `https://proektmap.ru/api/og?title=${encodeURIComponent(post.title)}&category=${encodeURIComponent(post.category?.name || "")}&author=${encodeURIComponent(post.author?.name || "")}`;

  const tags = (post.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);

  return {
    title: post.metaTitle || post.title,
    description: post.metaDesc || post.excerpt,
    alternates: { canonical: `https://proektmap.ru/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: [post.author?.name || "ProektMap"],
      tags: tags,
      images: [{ url: ogImage, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [ogImage] },
    other: {
      "article:published_time": post.publishedAt?.toISOString() || "",
      "article:modified_time": post.updatedAt?.toISOString() || "",
      "article:author": post.author?.name || "ProektMap",
      "article:tag": tags.join(", "),
    },
  };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const session = await auth();
  const userEmail = (session?.user as any)?.email || "";
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

  // Related posts
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

  const highlightedContent = await highlightCodeBlocks(post.content);
  const plainText = highlightedContent.replace(/<[^>]*>/g, '');
  const readingTime = Math.max(1, Math.round(plainText.length / 1200));

  // TOC
  const tocHeadings: { level: number; text: string; id: string }[] = [];
  const usedIds = new Set<string>();
  const headingRegex = /<h([23])(?:\s[^>]*)?>(.+?)<\/h[23]>/gi;
  let m: RegExpExecArray | null;
  while ((m = headingRegex.exec(highlightedContent)) !== null) {
    const rawText = m[2].replace(/<[^>]*>/g, '').trim();
    if (!rawText) continue;
    let id = rawText.toLowerCase().replace(/[^a-zа-я0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
    let dedup = id; let n = 2;
    while (usedIds.has(dedup)) { dedup = id + '-' + n; n++; }
    usedIds.add(dedup);
    tocHeadings.push({ level: parseInt(m[1]), text: rawText, id: dedup });
  }

  // Cross-link tags
  const tagList = (post.tags || "").split(",").map((t: string) => t.trim().toLowerCase()).filter(Boolean);
  let linkedSkills: any[] = [];
  let linkedSolutions: any[] = [];
  if (tagList.length > 0) {
    const [skills, solutions] = await Promise.all([
      db.skill.findMany({ where: { slug: { in: tagList }, isPublished: true }, select: { title: true, slug: true, difficulty: true }, take: 8 }),
      db.solution.findMany({ where: { slug: { in: tagList }, isPublished: true }, select: { title: true, slug: true, complexity: true }, take: 8 }),
    ]);
    linkedSkills = skills;
    linkedSolutions = solutions;
  }

  // Schema.org JSON-LD
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || post.metaDesc || "",
    image: post.coverImage?.startsWith("/") ? `https://proektmap.ru${post.coverImage}` : post.coverImage || undefined,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      "@type": "Person",
      name: post.author?.name || "ProektMap",
      url: `https://proektmap.ru/blog/author/${encodeURIComponent(post.author?.email || "")}`,
    },
    publisher: {
      "@type": "Organization",
      name: "ProektMap",
      url: "https://proektmap.ru",
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://proektmap.ru/blog/${post.slug}`,
    },
    about: postTags.map(t => ({ "@type": "Thing", name: t })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: "https://proektmap.ru" },
      { "@type": "ListItem", position: 2, name: "Блог", item: "https://proektmap.ru/blog" },
      ...(post.category ? [{ "@type": "ListItem", position: 3, name: post.category.name, item: `https://proektmap.ru/blog?cat=${post.category.slug}` }] : []),
      { "@type": "ListItem", position: post.category ? 4 : 3, name: post.title },
    ],
  };

  const postData = JSON.parse(JSON.stringify(post));
  postData.content = highlightedContent;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
      <PostPageClient
        post={postData}
        relatedPosts={JSON.parse(JSON.stringify(relatedPosts))}
        readMore={null}
        isAdmin={isAdmin}
        readingTime={readingTime}
        tocHeadings={tocHeadings}
        linkedSkills={JSON.parse(JSON.stringify(linkedSkills))}
        linkedSolutions={JSON.parse(JSON.stringify(linkedSolutions))}
      />
    </>
  );
}
