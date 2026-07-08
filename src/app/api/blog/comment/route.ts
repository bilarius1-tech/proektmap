import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const { postId, authorName, authorEmail, content } = await req.json();
  if (!postId || !authorName || !content) {
    return NextResponse.json({ error: "Все поля обязательны" }, { status: 400 });
  }
  const db = await getDb();
  await db.blogComment.create({ data: { postId, authorName, authorEmail: authorEmail || "", content } });
  return NextResponse.json({ ok: true });
}
