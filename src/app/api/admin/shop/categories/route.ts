import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/kopilka/auth";
import { getDb } from "@/lib/db/index";

const SLUG = /^[a-z0-9-]{2,80}$/;

function readCategory(body: Record<string, unknown>) {
  const data = {
    title: String(body.title || "").trim(),
    slug: String(body.slug || "").trim().toLowerCase(),
    kind: body.kind === "book" ? "book" : "file",
    sortOrder: Math.round(Number(body.sortOrder || 0)),
  };
  if (!data.title) throw new Error("Укажите название категории");
  if (!SLUG.test(data.slug)) throw new Error("Slug: латиница, цифры и дефис");
  return data;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });
  try {
    const data = readCategory(await req.json());
    const db = await getDb();
    const category = await db.productCategory.create({ data });
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить категорию";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Нет id" }, { status: 400 });
    const data = readCategory(body);
    const db = await getDb();
    const category = await db.productCategory.update({ where: { id }, data });
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить категорию";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "Нет id" }, { status: 400 });
  const db = await getDb();
  const used = await db.digitalProduct.count({ where: { categoryId: id } });
  if (used > 0) {
    return NextResponse.json({ error: "В категории есть товары. Сначала перенесите их." }, { status: 400 });
  }
  await db.productCategory.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
