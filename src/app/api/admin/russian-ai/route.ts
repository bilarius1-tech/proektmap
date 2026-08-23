import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const project = await db.russianAIProject.create({ data: { ...data, slug: data.slug || data.name.toLowerCase().replace(/\s+/g, "-") } });
  return NextResponse.json({ ok: true, project });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.russianAIProject.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.russianAIProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
