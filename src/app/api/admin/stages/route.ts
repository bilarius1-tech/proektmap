import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const stage = await db.stage.create({
    data: {
      title: data.title, slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-"),
      description: data.description || "", icon: data.icon || "Zap", sortOrder: data.sortOrder || 0,
    },
  });
  return NextResponse.json({ ok: true, stage });
}

export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.stage.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.stage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
