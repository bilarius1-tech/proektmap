import { NextResponse } from "next/server";

/**
 * Единственная публичная реф-ссылка ProektMap → Плати по миру.
 * В UI всегда: https://proektmap.ru/go/platipomiru (без ?code=).
 * Код только в .env → Location после редиректа.
 */
export function GET() {
  const target = process.env.PLATIPOMIRU_SITE_URL?.trim();
  if (!target) {
    return NextResponse.redirect("https://platipomiru.com/", 302);
  }
  const res = NextResponse.redirect(target, 302);
  res.headers.set("Cache-Control", "no-store");
  res.headers.set("Referrer-Policy", "no-referrer");
  return res;
}
