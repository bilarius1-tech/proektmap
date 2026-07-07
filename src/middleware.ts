import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const auth = req.headers.get("authorization");
    if (!auth) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin"' },
      });
    }
    const [user, pass] = atob(auth.split(" ")[1]).split(":");
    if (user !== "admin" || pass !== "bilariuss111111") {
      return new NextResponse("Unauthorized", { status: 401, headers: { "WWW-Authenticate": 'Basic realm="Admin"' } });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: "/admin/:path*" };
