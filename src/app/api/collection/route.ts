import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

// GET — list all user bookmarks
export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const db = await getDb();
  const items = await db.userCollection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json(items);
}

// POST — add bookmark
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { entityType, entitySlug } = await req.json();
  if (!entityType || !entitySlug) return NextResponse.json({ error: "entityType and entitySlug required" }, { status: 400 });
  const db = await getDb();
  const existing = await db.userCollection.findUnique({ where: { userId_entityType_entitySlug: { userId, entityType, entitySlug } } });
  if (existing) return NextResponse.json({ ok: true });
  await db.userCollection.create({ data: { userId, entityType, entitySlug } });
  return NextResponse.json({ ok: true });
}

// DELETE — remove bookmark
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { entityType, entitySlug } = await req.json();
  const db = await getDb();
  await db.userCollection.deleteMany({ where: { userId, entityType, entitySlug } });
  return NextResponse.json({ ok: true });
}
