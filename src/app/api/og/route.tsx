import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") || "Карта роста";
  const category = searchParams.get("category") || "";
  const author = searchParams.get("author") || "";

  return new ImageResponse(
    (
      <div style={{
        display: "flex", flexDirection: "column", width: 1200, height: 630,
        background: "linear-gradient(135deg, #0fb880 0%, #098a5e 100%)",
        fontFamily: "Inter", padding: 80, justifyContent: "space-between",
      }}>
        {/* Top: category badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {category && (
            <div style={{ padding: "8px 20px", borderRadius: 99, background: "rgba(255,255,255,0.15)", color: "white", fontSize: 20, fontWeight: 600 }}>
              {category}
            </div>
          )}
        </div>

        {/* Center: title */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 1000 }}>
          <div style={{ fontSize: 52, fontWeight: 800, color: "white", lineHeight: 1.15, letterSpacing: "-0.01em" }}>
            {title}
          </div>
        </div>

        {/* Bottom: logo + author */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 24, fontWeight: 800 }}>K</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>proektmap.ru</div>
          </div>
          {author && (
            <div style={{ fontSize: 22, color: "rgba(255,255,255,0.7)" }}>{author}</div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
