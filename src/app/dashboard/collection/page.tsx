import { getDb } from "@/lib/db/index";
import CollectionPageClient from "./client";
export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";

export const metadata = { title: "Моя карта знаний — ProektMap" };

export default async function Page() {
  const session = await auth();
  if (!session?.user) return <div style={{ padding: 40, textAlign: "center" }}>Войдите чтобы увидеть сохранённое</div>;

  const db = await getDb();
  const userId = (session.user as any).id;
  const saves = await db.userCollection.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });

  // Resolve
  const items: any[] = [];
  for (const s of saves) {
    let title = "", subtitle = "", href = "";
    try {
      if (s.entityType === "glossary") {
        const t = await db.glossaryTerm.findUnique({ where: { slug: s.entitySlug }, select: { term: true, level: true, category: true } });
        if (t) { title = t.term; subtitle = t.category || ""; href = "/glossary/" + s.entitySlug; }
      }
      if (s.entityType === "prompt") {
        const p = await db.promptBlueprint.findUnique({ where: { slug: s.entitySlug }, select: { title: true, category: true } });
        if (p) { title = p.title; subtitle = p.category; href = "/prompts"; }
      }
      if (s.entityType === "pattern") {
        const p = await db.buildPattern.findUnique({ where: { slug: s.entitySlug }, select: { title: true, difficulty: true } });
        if (p) { title = p.title; subtitle = p.difficulty; href = "/patterns/" + s.entitySlug; }
      }
      if (s.entityType === "mcp") {
        const m = await db.mCPServer.findUnique({ where: { slug: s.entitySlug }, select: { name: true, category: true } });
        if (m) { title = m.name; subtitle = m.category || ""; href = "/mcp/" + s.entitySlug; }
      }
    } catch {}
    if (title) items.push({ ...s, title, subtitle, href });
  }

  return <CollectionPageClient items={JSON.parse(JSON.stringify(items))} />;
}
