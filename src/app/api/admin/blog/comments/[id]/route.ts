import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  const u = session.user as any;
  return u.role === "admin";
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const { status } = await req.json();
  if (!status || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }
  const db = await getDb();
  const comment = await db.blogComment.update({ where: { id }, data: { status } });
  return NextResponse.json(comment);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const db = await getDb();
  await db.blogComment.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
