import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/kopilka/auth";
import { assertShopFileName, ensureShopStorage } from "@/lib/shop/storage";

export const runtime = "nodejs";

const MAX_BYTES = 80 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Выберите файл" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Файл больше 80 МБ" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const stored = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext}`;
  try {
    assertShopFileName(stored);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Недопустимый файл";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const dir = ensureShopStorage();
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, stored), buffer);

  return NextResponse.json({
    fileName: stored,
    originalName: path.basename(file.name).replace(/[^\w.\-а-яА-ЯёЁ ]/g, "").slice(0, 120) || stored,
  });
}
