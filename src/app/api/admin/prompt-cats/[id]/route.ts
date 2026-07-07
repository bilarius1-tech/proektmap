import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const slug = data.name.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
  const db = await getDb();
  const v = await db.promptCategory.update({ where: { id }, data: { ...data, slug } });
  return NextResponse.json(v);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const db = await getDb();
  await db.promptCategory.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  await db.promptCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
