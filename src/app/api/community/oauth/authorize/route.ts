import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { CODE_TTL_SECONDS, getCommunityOAuthConfig, randomToken, safeEqual, sha256Hex } from "@/lib/community/oauth";

export const dynamic = "force-dynamic";

function redirectWithParams(base: string, params: Record<string, string>) {
  const url = new URL(base);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  return NextResponse.redirect(url.toString(), { status: 302 });
}

export async function GET(req: NextRequest) {
  const config = getCommunityOAuthConfig();
  if (!config) return NextResponse.json({ error: "sso_not_configured" }, { status: 503 });

  const q = req.nextUrl.searchParams;
  const clientId = q.get("client_id") || "";
  const redirectUri = q.get("redirect_uri") || "";
  const state = q.get("state") || "";
  const responseType = q.get("response_type") || "";
  const codeChallenge = q.get("code_challenge") || "";
  const challengeMethod = q.get("code_challenge_method") || "";

  // До проверки client_id и redirect_uri никуда не редиректим: иначе открытый редирект.
  if (!safeEqual(clientId, config.clientId) || redirectUri !== config.redirectUri) {
    return NextResponse.json({ error: "invalid_client" }, { status: 400 });
  }
  if (responseType !== "code" || !state || state.length > 512) {
    return redirectWithParams(redirectUri, { error: "invalid_request", state });
  }
  if (codeChallenge && (challengeMethod !== "S256" || !/^[A-Za-z0-9\-_]{43}$/.test(codeChallenge))) {
    return redirectWithParams(redirectUri, { error: "invalid_request", state });
  }

  const session = await auth();
  const sessionUserId = (session?.user as { id?: string } | undefined)?.id;
  if (!sessionUserId) {
    const back = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    const login = new URL("/auth", process.env.NEXTAUTH_URL || "https://proektmap.ru");
    login.searchParams.set("callbackUrl", back);
    login.searchParams.set("from", "community");
    return NextResponse.redirect(login.toString(), { status: 302 });
  }

  const db = await getDb();
  const user = await db.user.findUnique({ where: { id: sessionUserId }, select: { id: true, email: true } });
  if (!user?.email) {
    return redirectWithParams(redirectUri, { error: "access_denied", state });
  }

  const code = randomToken(32);
  await db.communityOAuthCode.create({
    data: {
      codeHash: sha256Hex(code),
      userId: user.id,
      redirectUri,
      codeChallenge: codeChallenge || null,
      expiresAt: new Date(Date.now() + CODE_TTL_SECONDS * 1000),
    },
  });
  // Уборка просроченных кодов старше суток, не блокирует ответ.
  db.communityOAuthCode
    .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 3600 * 1000) } } })
    .catch(() => {});

  return redirectWithParams(redirectUri, { code, state });
}
