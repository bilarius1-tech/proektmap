import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export async function GET() {
  const db = await getDb();
  const posts = await db.blogPost.findMany({ orderBy: { createdAt: "desc" }, include: { category: true } });
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await req.json();
  const db = await getDb();
  const post = await db.blogPost.create({
    data: { ...data, authorId: (session.user as any).id, publishedAt: data.status === "published" ? new Date() : null },
  });
  return NextResponse.json(post);
}
