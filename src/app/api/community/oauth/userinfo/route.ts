import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCommunityOAuthConfig, suggestUsername, verifyAccessToken } from "@/lib/community/oauth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const config = getCommunityOAuthConfig();
  if (!config) return NextResponse.json({ error: "sso_not_configured" }, { status: 503 });

  const header = req.headers.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  const userId = token ? verifyAccessToken(token, config.clientSecret) : null;
  if (!userId) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401, headers: { "WWW-Authenticate": "Bearer" } });
  }

  const db = await getDb();
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      emailVerified: true,
      identities: { where: { provider: "yandex" }, select: { email: true } },
    },
  });
  if (!user) return NextResponse.json({ error: "invalid_token" }, { status: 401 });

  // Подтверждённым считаем адрес, который проверил Яндекс или подтвердил сам пользователь.
  const emailVerified =
    Boolean(user.emailVerified) || user.identities.some((i) => (i.email || "").toLowerCase() === user.email);

  const picture = user.avatar.startsWith("https://") ? user.avatar : null;

  return NextResponse.json(
    {
      sub: user.id,
      name: user.name || user.email.split("@")[0],
      preferred_username: suggestUsername(user.name, user.email),
      email: user.email,
      email_verified: emailVerified,
      picture,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
