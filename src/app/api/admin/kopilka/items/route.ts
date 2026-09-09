import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { requireAdmin } from "@/lib/kopilka/auth";

export async function GET(req: NextRequest) {
  const db = await getDb();
  const categoryId = req.nextUrl.searchParams.get("categoryId");
  const items = await db.designBankItem.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: { category: { select: { id: true, title: true, slug: true, emoji: true } } },
  });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.url || !body.categoryId) {
    return NextResponse.json({ error: "url и categoryId обязательны" }, { status: 400 });
  }
  let url = String(body.url).trim();
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;

  const db = await getDb();
  const max = await db.designBankItem.aggregate({
    where: { categoryId: body.categoryId },
    _max: { sortOrder: true },
  });

  const item = await db.designBankItem.create({
    data: {
      categoryId: body.categoryId,
      url,
      title: body.title || "",
      descriptionRu: body.descriptionRu || "",
      faviconUrl: body.faviconUrl || "",
      sourceMeta: body.sourceMeta || "",
      sortOrder: body.sortOrder ?? (max._max.sortOrder ?? 0) + 1,
      isPublished: body.isPublished !== false,
    },
    include: { category: { select: { id: true, title: true, slug: true, emoji: true } } },
  });
  return NextResponse.json(item);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  const data: Record<string, unknown> = {};
  for (const key of ["categoryId", "url", "title", "descriptionRu", "faviconUrl", "sourceMeta", "sortOrder", "isPublished"]) {
    if (body[key] !== undefined) data[key] = body[key];
  }
  const item = await db.designBankItem.update({
    where: { id: body.id },
    data,
    include: { category: { select: { id: true, title: true, slug: true, emoji: true } } },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.designBankItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
