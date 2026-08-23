import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

async function checkAdmin() {
  const session = await auth();
  if (!session?.user) return false;
  return (session.user as any).role === "admin";
}

// GET — список проектов
export async function GET() {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = await getDb();
  const projects = await db.aiProject.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
}

// POST — создать проект
export async function POST(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = await getDb();
  const data = await req.json();
  const project = await db.aiProject.create({ data });
  return NextResponse.json(project);
}

// PUT — обновить
export async function PUT(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const db = await getDb();
  const data = await req.json();
  const { id, ...rest } = data;
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const project = await db.aiProject.update({ where: { id }, data: rest });
  return NextResponse.json(project);
}

// DELETE
export async function DELETE(req: NextRequest) {
  if (!(await checkAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const db = await getDb();
  await db.aiProject.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
