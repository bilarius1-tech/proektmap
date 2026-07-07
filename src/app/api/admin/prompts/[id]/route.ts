import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const slug = data.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
  const db = await getDb();
  const prompt = await db.prompt.update({ where: { id }, data: { ...data, slug } });
  return NextResponse.json(prompt);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const db = await getDb();
  await db.prompt.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  await db.prompt.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
