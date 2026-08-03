import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  const u = session.user as any;
  return u.role === "admin";
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

// PATCH — approve / reject comment
export async function PATCH(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: Forbidden }, { status: 403 });
  const { id, status } = await req.json();
  if (!id || !status) return NextResponse.json({ error: "id and status required" }, { status: 400 });
  const db = await getDb();
  await db.blogComment.update({ where: { id }, data: { status } });
  return NextResponse.json({ ok: true });
}

// DELETE — remove comment
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: Forbidden }, { status: 403 });
  const id = req.nextUrl.searchParams.get(id);
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.blogComment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
