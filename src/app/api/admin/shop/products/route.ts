import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/kopilka/auth";
import { getDb } from "@/lib/db/index";
import { assertShopFileName, shopFileExists } from "@/lib/shop/storage";

const SLUG = /^[a-z0-9-]{2,80}$/;

function readProduct(body: Record<string, unknown>) {
  const kind = body.kind === "book" ? "book" : "file";
  const fileName = String(body.fileName || "").trim();
  const data = {
    title: String(body.title || "").trim(),
    slug: String(body.slug || "").trim().toLowerCase(),
    description: String(body.description || "").trim(),
    priceRub: Math.round(Number(body.priceRub)),
    kind,
    categoryId: String(body.categoryId || ""),
    litresUrl: String(body.litresUrl || "").trim(),
    fileName,
    originalName: String(body.originalName || fileName).trim(),
    coverUrl: String(body.coverUrl || "").trim(),
    cardTitle: String(body.cardTitle || "").trim().slice(0, 80),
    ageRating: String(body.ageRating || "").trim().slice(0, 8),
    pageCount: Math.max(0, Math.round(Number(body.pageCount) || 0)),
    isPublished: Boolean(body.isPublished),
    sortOrder: Math.round(Number(body.sortOrder || 0)),
  };
  if (!data.title) throw new Error("Укажите название");
  if (!SLUG.test(data.slug)) throw new Error("Slug: латиница, цифры и дефис, от 2 символов");
  if (!Number.isInteger(data.priceRub) || data.priceRub < 1 || data.priceRub > 1_000_000) {
    throw new Error("Цена — целое число рублей от 1 до 1 000 000");
  }
  if (!data.categoryId) throw new Error("Выберите категорию");
  if (data.fileName) assertShopFileName(data.fileName);
  if (data.isPublished && !data.fileName) throw new Error("Нельзя опубликовать товар без файла");
  if (data.fileName && !shopFileExists(data.fileName)) throw new Error("Файл не найден в хранилище");
  if (data.litresUrl && !data.litresUrl.startsWith("https://")) {
    throw new Error("Ссылка Литрес должна начинаться с https://");
  }
  if (data.coverUrl && !/^\/(shop\/covers|api\/media)\/[\w.\-]+$/.test(data.coverUrl)) {
    throw new Error("Обложка должна быть загружена с компьютера");
  }
  if (data.ageRating && !/^\d{1,2}\+$/.test(data.ageRating)) {
    throw new Error("Возраст пишите как 0+, 6+, 12+ или 18+");
  }
  if (data.pageCount > 5000) throw new Error("Слишком большое число страниц");
  return data;
}

export async function POST(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });
  try {
    const data = readProduct(await req.json());
    const db = await getDb();
    const product = await db.digitalProduct.create({ data });
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить товар";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });
  try {
    const body = await req.json();
    const id = String(body.id || "");
    if (!id) return NextResponse.json({ error: "Нет id" }, { status: 400 });
    const data = readProduct(body);
    const db = await getDb();
    const product = await db.digitalProduct.update({ where: { id }, data });
    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось сохранить товар";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });
  const id = req.nextUrl.searchParams.get("id") || "";
  if (!id) return NextResponse.json({ error: "Нет id" }, { status: 400 });
  const db = await getDb();
  await db.digitalProduct.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
