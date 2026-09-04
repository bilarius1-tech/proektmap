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

    // Resolve author from DB (email first). Session may still carry OAuth subject id until JWT refresh.
    const email = session?.user?.email?.toLowerCase();
    let author =
      (email ? await db.user.findUnique({ where: { email }, select: { id: true } }) : null) ||
      ((session?.user as any)?.id
        ? await db.user.findUnique({ where: { id: (session!.user as any).id }, select: { id: true } })
        : null);
    if (!author) {
      return NextResponse.json(
        { error: "Автор не найден в базе. Выйдите и войдите снова в админку." },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    if (data.slug) {
      const slugExists = await db.blogPost.findUnique({ where: { slug: data.slug } });
      if (slugExists) return NextResponse.json({ error: "Slug уже занят. Придумайте другой заголовок." }, { status: 409 });
    }

    const categoryId =
      data.categoryId && String(data.categoryId).trim() ? String(data.categoryId) : null;

    const post = await db.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content || "",
        excerpt: data.excerpt || "",
        coverImage: data.coverImage || "",
        status: data.status || "draft",
        tags: data.tags || "",
        metaTitle: data.metaTitle || "",
        metaDesc: data.metaDesc || "",
        categoryId,
        authorId: author.id,
        publishedAt: data.status === "published" ? new Date() : null,
      },
    });
    if (post.status === "published") pingSearchEngines(post.slug).catch(() => {});
    return NextResponse.json(post);
  } catch (e: any) {
    console.error("POST /api/admin/blog error:", e);
    return NextResponse.json({ error: e?.message || "Ошибка сервера" }, { status: 500 });
  }
}
