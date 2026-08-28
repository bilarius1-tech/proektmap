import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const db = await getDb();
  const items = await db.menuItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, label, href, parentId, sortOrder, icon, location, emoji } = await req.json();
  if (!label || !href) return NextResponse.json({ error: "label и href обязательны" }, { status: 400 });
  const db = await getDb();
  const item = await db.menuItem.create({
    data: {
      ...(id ? { id } : {}),
      label,
      href,
      parentId: parentId || null,
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      icon: icon || null,
      emoji: emoji ? emoji.trim() : null,
      location: location || "header",
    },
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, label, href, parentId, sortOrder, icon, location, isActive, emoji } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.menuItem.update({
    where: { id },
    data: {
      label,
      href,
      parentId: parentId || null,
      sortOrder: typeof sortOrder === "number" ? sortOrder : 0,
      icon: icon || null,
      emoji: emoji ? emoji.trim() : null,
      location: location || "header",
      isActive: isActive ?? true,
    },
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.menuItem.deleteMany({ where: { parentId: id } });
  await db.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
