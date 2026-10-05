import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

const ALLOWED = new Set(["jpg", "jpeg", "png", "webp", "gif"]);

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const ext = (file.name.split(".").pop() || "").toLowerCase();
  if (!ALLOWED.has(ext)) {
    return NextResponse.json({ error: "Нужно изображение jpg, png, webp или gif" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext === "jpeg" ? "jpg" : ext}`;
  const uploadDir = join(process.cwd(), "public", "uploads");
  
  await mkdir(uploadDir, { recursive: true });
  await writeFile(join(uploadDir, filename), buffer);

  const url = "/api/media/" + filename;
  return NextResponse.json({ url });
}
