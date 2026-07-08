import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const slug = data.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
  const db = await getDb();
  const skill = await db.skill.update({ where: { id }, data: { ...data, slug } });
  return NextResponse.json(skill);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  await db.skill.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
