import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

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
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const data = await req.json();
  const db = await getDb();
  const session = await auth();
  const post = await db.blogPost.create({
    data: { ...data, authorId: (session!.user as any).id, publishedAt: data.status === "published" ? new Date() : null },
  });
  return NextResponse.json(post);
}
