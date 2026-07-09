import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const tool = await db.aITool.create({ data });
  return NextResponse.json(tool);
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...update } = data;
  const db = await getDb();
  const tool = await db.aITool.update({ where: { id }, data: update });
  return NextResponse.json(tool);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.aITool.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
