import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const pattern = await db.buildPattern.create({ data });
  return NextResponse.json(pattern);
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...update } = data;
  const db = await getDb();
  const pattern = await db.buildPattern.update({ where: { id }, data: update });
  return NextResponse.json(pattern);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.buildPattern.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
