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
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const data = await req.json();
    const db = await getDb();

    // Check post exists
    const existing = await db.blogPost.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Пост не найден" }, { status: 404 });

    // Check slug uniqueness if changed
    if (data.slug && data.slug !== existing.slug) {
      const slugExists = await db.blogPost.findUnique({ where: { slug: data.slug } });
      if (slugExists) return NextResponse.json({ error: "Slug уже занят другим постом" }, { status: 409 });
    }

    const post = await db.blogPost.update({
      where: { id },
      data: {
        ...data,
        publishedAt: data.status === "published" && !existing.publishedAt ? new Date() : data.publishedAt || existing.publishedAt,
      },
    });
    if (data.status === "published") pingSearchEngines(post.slug).catch(() => {});
    return NextResponse.json(post);
  } catch (e: any) {
    console.error("PUT /api/admin/blog/[id] error:", e);
    return NextResponse.json({ error: e?.message || "Ошибка сервера" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const { id } = await params;
    const db = await getDb();
    await db.blogComment.deleteMany({ where: { postId: id } });
    await db.blogPost.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("DELETE /api/admin/blog/[id] error:", e);
    return NextResponse.json({ error: e?.message || "Ошибка сервера" }, { status: 500 });
  }
}
