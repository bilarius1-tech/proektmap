import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  const u = session.user as any;
  return u.role === "admin" || u.email === "bilariuss@yandex.ru";
}

// GET — list pending comments
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = await getDb();
  const comments = await db.blogComment.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    include: { post: { select: { title: true, slug: true } } },
    take: 50,
  });
  return NextResponse.json(comments);
}
