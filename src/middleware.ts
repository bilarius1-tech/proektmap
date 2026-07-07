import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRO_ROUTES = ["/api/ai/ask"];

const AUTH_ROUTES = ["/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check auth routes
  const needsAuth = AUTH_ROUTES.some(r => pathname.startsWith(r));
  if (needsAuth && !token) {
    const url = new URL("/auth", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Check pro routes
  const needsPro = PRO_ROUTES.some(r => pathname.startsWith(r));
  if (needsPro) {
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const isPro = token.subscription === "pro" || token.role === "admin";
    if (!isPro) return NextResponse.json({ error: "Pro subscription required", code: "PRO_REQUIRED" }, { status: 402 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/ai/:path*"],
};
