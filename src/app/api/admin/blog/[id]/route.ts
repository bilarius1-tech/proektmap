import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await req.json();
  const db = await getDb();
  const post = await db.blogPost.update({
    where: { id },
    data: { ...data, publishedAt: data.status === "published" && !data.publishedAt ? new Date() : data.publishedAt || undefined },
  });
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  await db.blogComment.deleteMany({ where: { postId: id } });
  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
