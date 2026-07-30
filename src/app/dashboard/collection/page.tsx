import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import CollectionClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Мои закладки — Карта роста" };

export default async function CollectionPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth?callbackUrl=/dashboard/collection");
  const userId = (session.user as any).id;
  const db = await getDb();

  const items = await db.userCollection.findMany({
    where: { userId, entityType: "blog_post" },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  // Fetch blog post titles
  const postSlugs = items.map(i => i.entitySlug);
  const posts = postSlugs.length > 0 ? await db.blogPost.findMany({
    where: { id: { in: postSlugs } },
    select: { id: true, title: true, slug: true, excerpt: true, viewCount: true, publishedAt: true },
  }) : [];
  const postMap = new Map(posts.map(p => [p.id, p]));

  return <CollectionClient items={JSON.parse(JSON.stringify(items))} postMap={JSON.parse(JSON.stringify(Object.fromEntries(postMap)))} />;
}
