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

export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = await getDb();
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  try {
    if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const data = await req.json();
    const db = await getDb();
    const session = await auth();

    // Check slug uniqueness
    if (data.slug) {
      const slugExists = await db.blogPost.findUnique({ where: { slug: data.slug } });
      if (slugExists) return NextResponse.json({ error: "Slug уже занят. Придумайте другой заголовок." }, { status: 409 });
    }

    const post = await db.blogPost.create({
      data: { ...data, authorId: (session!.user as any).id, publishedAt: data.status === "published" ? new Date() : null },
    });
    if (post.status === "published") pingSearchEngines(post.slug).catch(() => {});
    return NextResponse.json(post);
  } catch (e: any) {
    console.error("POST /api/admin/blog error:", e);
    return NextResponse.json({ error: e?.message || "Ошибка сервера" }, { status: 500 });
  }
}
