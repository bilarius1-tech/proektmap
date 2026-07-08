import { NextResponse } from "next/server";
import { readdir } from "fs/promises";
import { join } from "path";

export async function GET() {
  try {
    const dir = join(process.cwd(), "public", "uploads");
    const files = await readdir(dir);
    const images = files.filter(f => /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f)).sort((a, b) => b.localeCompare(a)).map(f => `/uploads/${f}`);
    return NextResponse.json({ images });
  } catch { return NextResponse.json({ images: [] }); }
}
