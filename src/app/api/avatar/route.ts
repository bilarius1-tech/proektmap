import { NextRequest, NextResponse } from "next/server";

// Generate colorful SVG avatar from initials
// GET /api/avatar?name=Alexey&size=128
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") || "?";
  const size = parseInt(req.nextUrl.searchParams.get("size") || "128");

  // Deterministic color from name hash
  const hash = name.split("").reduce((a: number, c: string) => a + c.charCodeAt(0), 0);
  const colors = ["#0FB880", "#3B82F6", "#8B5CF6", "#EF4444", "#F59E0B", "#10B981", "#6366F1", "#EC4899", "#14B8A6", "#F97316"];
  const bg = colors[hash % colors.length];

  // Get 1-2 initials
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const initials = parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (name.trim()[0] || "?").toUpperCase();

  const fontSize = initials.length === 1 ? size * 0.5 : size * 0.38;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${bg}" rx="${Math.round(size * 0.15)}"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" fill="white" font-family="Inter, -apple-system, sans-serif" font-size="${fontSize}" font-weight="700">${initials}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400, immutable",
    },
  });
}
