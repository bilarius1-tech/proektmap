import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const items = await db.menuItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const { label, href, parentId, sortOrder, icon, location } = await req.json();
  if (!label || !href) return NextResponse.json({ error: "label и href обязательны" }, { status: 400 });
  const db = await getDb();
  const item = await db.menuItem.create({
    data: { label, href, parentId: parentId || null, sortOrder: sortOrder || 0, icon: icon || null, location: location || "header" },
  });
  return NextResponse.json({ ok: true, item });
}

export async function PUT(req: NextRequest) {
  const { id, label, href, parentId, sortOrder, icon, location, isActive } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.menuItem.update({ where: { id }, data: { label, href, parentId, sortOrder, icon, location, isActive } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.menuItem.deleteMany({ where: { parentId: id } });
  await db.menuItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
