import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import { pingSearchEngines } from "@/lib/seo/ping";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  const u = session.user as any;
  return u.role === "admin";
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const data = await req.json();
  const db = await getDb();
  const post = await db.blogPost.update({
    where: { id },
    data: { ...data, publishedAt: data.status === "published" && !data.publishedAt ? new Date() : data.publishedAt || undefined },
  });
  if (data.status === "published") pingSearchEngines(post.slug).catch(() => {});
  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const db = await getDb();
  await db.blogComment.deleteMany({ where: { postId: id } });
  await db.blogPost.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
