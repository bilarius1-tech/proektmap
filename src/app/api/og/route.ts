import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import { buildSvg, buildThumbSvg } from "@/lib/og/svg";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Карта роста";
  const category = searchParams.get("category") || "";
  const tags = (searchParams.get("tags") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);
  const author = searchParams.get("author") || "";
  const seed = searchParams.get("seed") || "";
  const mode = searchParams.get("mode") || "full";

  const svg =
    mode === "thumb"
      ? buildThumbSvg(category, seed || title)
      : buildSvg({ title, category, tags, author, seed });

  try {
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  } catch (e) {
    console.error("OG rasterize error:", (e as Error).message);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }
}

