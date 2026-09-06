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
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const blogIds = items.filter((i) => i.entityType === "blog_post").map((i) => i.entitySlug);
  const solutionSlugs = items.filter((i) => i.entityType === "solution").map((i) => i.entitySlug);
  const skillSlugs = items.filter((i) => i.entityType === "skill").map((i) => i.entitySlug);
  const termSlugs = items.filter((i) => i.entityType === "glossary_term").map((i) => i.entitySlug);
  const decisionSlugs = items.filter((i) => i.entityType === "decision").map((i) => i.entitySlug);
  const aiToolSlugs = items.filter((i) => i.entityType === "ai-tool").map((i) => i.entitySlug);
  const mcpSlugs = items.filter((i) => i.entityType === "mcp").map((i) => i.entitySlug);

  const [blogPosts, solutions, skills, terms, decisions, aiTools, mcps] = await Promise.all([
    blogIds.length
      ? db.blogPost.findMany({
          where: { id: { in: blogIds } },
          select: { id: true, title: true, slug: true, excerpt: true, viewCount: true, publishedAt: true },
        })
      : [],
    solutionSlugs.length
      ? db.solution.findMany({ where: { slug: { in: solutionSlugs } }, select: { slug: true, title: true, summary: true } })
      : [],
    skillSlugs.length
      ? db.skill.findMany({ where: { slug: { in: skillSlugs } }, select: { slug: true, title: true } })
      : [],
    termSlugs.length
      ? db.glossaryTerm.findMany({
          where: { slug: { in: termSlugs } },
          select: { slug: true, term: true, simpleExplanation: true },
        })
      : [],
    decisionSlugs.length
      ? db.decision.findMany({ where: { slug: { in: decisionSlugs } }, select: { slug: true, title: true } })
      : [],
    aiToolSlugs.length
      ? db.aITool.findMany({
          where: { slug: { in: aiToolSlugs } },
          select: { slug: true, name: true, shortDescription: true },
        })
      : [],
    mcpSlugs.length
      ? db.mCPServer.findMany({
          where: { slug: { in: mcpSlugs } },
          select: { slug: true, name: true, description: true },
        })
      : [],
  ]);

  return (
    <CollectionClient
      items={JSON.parse(JSON.stringify(items))}
      blogMap={JSON.parse(JSON.stringify(Object.fromEntries(blogPosts.map((p) => [p.id, p]))))}
      solutionMap={JSON.parse(JSON.stringify(Object.fromEntries(solutions.map((s) => [s.slug, s]))))}
      skillMap={JSON.parse(JSON.stringify(Object.fromEntries(skills.map((s) => [s.slug, s]))))}
      termMap={JSON.parse(JSON.stringify(Object.fromEntries(terms.map((t) => [t.slug, t]))))}
      decisionMap={JSON.parse(JSON.stringify(Object.fromEntries(decisions.map((d) => [d.slug, d]))))}
      aiToolMap={JSON.parse(JSON.stringify(Object.fromEntries(aiTools.map((t) => [t.slug, t]))))}
      mcpMap={JSON.parse(JSON.stringify(Object.fromEntries(mcps.map((m) => [m.slug, m]))))}
    />
  );
}
