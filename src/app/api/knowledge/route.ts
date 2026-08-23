import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const db = await getDb();
  const clips = await db.knowledgeClip.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ clips });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const db = await getDb();
  const body = await req.json();
  const { text, pageTitle, pageUrl, blueprintId, skillId, glossaryId, note, color } = body;
  if (!text || !text.trim()) return NextResponse.json({ error: "Text is required" }, { status: 400 });
  const clip = await db.knowledgeClip.create({ data: {
    userId, text: text.trim(), pageTitle: pageTitle || "", pageUrl: pageUrl || "",
    blueprintId: blueprintId || null, skillId: skillId || null, glossaryId: glossaryId || null,
    note: note || "", color: color || "default",
  }});
  return NextResponse.json({ clip });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const db = await getDb();
  const clip = await db.knowledgeClip.findUnique({ where: { id } });
  if (!clip || clip.userId !== userId) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.knowledgeClip.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
