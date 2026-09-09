import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/kopilka/auth";

export async function GET() {
  const db = await getDb();
  const categories = await db.designBankCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { items: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  const db = await getDb();
  const max = await db.designBankCategory.aggregate({ _max: { sortOrder: true } });
  const slug =
    body.slug ||
    String(body.title || "")
      .toLowerCase()
      .replace(/[^a-zа-я0-9]+/gi, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 60);
  const cat = await db.designBankCategory.create({
    data: {
      title: body.title || "Без названия",
      slug: slug || `cat-${Date.now()}`,
      emoji: body.emoji || "",
      description: body.description || "",
      sortOrder: body.sortOrder ?? (max._max.sortOrder ?? 0) + 1,
      isPublished: body.isPublished !== false,
    },
  });
  return NextResponse.json(cat);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  const cat = await db.designBankCategory.update({
    where: { id: body.id },
    data: {
      title: body.title,
      slug: body.slug,
      emoji: body.emoji,
      description: body.description,
      sortOrder: body.sortOrder,
      isPublished: body.isPublished,
    },
  });
  return NextResponse.json(cat);
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.designBankCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
