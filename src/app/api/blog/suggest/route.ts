import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, tags, coverImage, categoryId } = await req.json();
  if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

  const db = await getDb();
  const slug = title.toLowerCase()
    .replace(/[^a-zа-я0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60) + "-" + Date.now().toString(36);

  const post = await db.blogPost.create({
    data: {
      title, slug, content,
      excerpt: content.replace(/<[^>]*>/g, "").slice(0, 200),
      tags: tags || "", coverImage: coverImage || "",
      categoryId: categoryId || null,
      status: "draft",
      authorId: (session.user as any).id,
      metaDesc: "Предложено пользователем",
    },
  });

  return NextResponse.json({ ok: true, slug: post.slug });
}
