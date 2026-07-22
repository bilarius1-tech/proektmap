import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const prompts = await db.promptBlueprint.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ prompts });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const prompt = await db.promptBlueprint.create({ data });
  return NextResponse.json(prompt);
}

export async function PATCH(req: NextRequest) {
  const data = await req.json();
  const { id, ...update } = data;
  const db = await getDb();
  const prompt = await db.promptBlueprint.update({ where: { id }, data: update });
  return NextResponse.json(prompt);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.promptBlueprint.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
