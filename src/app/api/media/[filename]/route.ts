import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!filename || filename.includes("..")) return new NextResponse("Not found", { status: 404 });
  const filePath = join(process.cwd(), "public", "uploads", filename);
  if (!existsSync(filePath)) return new NextResponse("Not found", { status: 404 });
  const buffer = await readFile(filePath);
  const ext = filename.split(".").pop()?.toLowerCase();
  const mime: Record<string, string> = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" };
  return new NextResponse(buffer, { headers: { "Content-Type": mime[ext || ""] || "application/octet-stream", "Cache-Control": "public, max-age=31536000" } });
}
