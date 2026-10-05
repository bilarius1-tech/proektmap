import { randomBytes } from "crypto";
import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/kopilka/auth";

export const runtime = "nodejs";

const ALLOWED = new Set(["jpg", "jpeg", "png", "webp"]);
const MAX_BYTES = 8 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Нужны права администратора" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Выберите изображение" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Обложка больше 8 МБ" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  if (!ALLOWED.has(ext)) {
    return NextResponse.json({ error: "Обложка: jpg, png или webp" }, { status: 400 });
  }

  const stored = `${Date.now()}-${randomBytes(4).toString("hex")}.${ext === "jpeg" ? "jpg" : ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, stored), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({ coverUrl: `/api/media/${stored}` });
}
