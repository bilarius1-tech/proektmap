import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

// GET — list user's saved items
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const userId = (session.user as any).id;
  const saves = await db.userCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  // Resolve titles for saved items
  const result: any[] = [];
  for (const s of saves) {
    const item: any = { id: s.id, entityType: s.entityType, entitySlug: s.entitySlug, createdAt: s.createdAt };
    try {
      if (s.entityType === "glossary") {
        const t = await db.glossaryTerm.findUnique({ where: { slug: s.entitySlug }, select: { term: true, level: true, category: true } });
        if (t) { item.title = t.term; item.subtitle = t.category; item.level = t.level; item.href = "/glossary/" + s.entitySlug; }
      }
      if (s.entityType === "prompt") {
        const p = await db.promptBlueprint.findUnique({ where: { slug: s.entitySlug }, select: { title: true, category: true } });
        if (p) { item.title = p.title; item.subtitle = p.category; item.href = "/prompts"; }
      }
      if (s.entityType === "pattern") {
        const p = await db.buildPattern.findUnique({ where: { slug: s.entitySlug }, select: { title: true, difficulty: true } });
        if (p) { item.title = p.title; item.subtitle = p.difficulty; item.href = "/patterns/" + s.entitySlug; }
      }
      if (s.entityType === "mcp") {
        const m = await db.mCPServer.findUnique({ where: { slug: s.entitySlug }, select: { name: true, category: true } });
        if (m) { item.title = m.name; item.subtitle = m.category; item.href = "/mcp/" + s.entitySlug; }
      }
    } catch {}
    if (item.title) result.push(item);
  }

  return NextResponse.json(result);
}

// POST — save an item
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entityType, entitySlug } = await req.json();
  if (!entityType || !entitySlug) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const db = await getDb();
  const userId = (session.user as any).id;

  const existing = await db.userCollection.findUnique({
    where: { userId_entityType_entitySlug: { userId, entityType, entitySlug } }
  });
  if (existing) return NextResponse.json(existing);

  const save = await db.userCollection.create({ data: { userId, entityType, entitySlug } });
  return NextResponse.json(save);
}

// DELETE — unsave
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { entityType, entitySlug } = await req.json();
  const db = await getDb();
  const userId = (session.user as any).id;

  await db.userCollection.deleteMany({ where: { userId, entityType, entitySlug } });
  return NextResponse.json({ ok: true });
}
