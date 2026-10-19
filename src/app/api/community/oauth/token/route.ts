import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  getCommunityOAuthConfig,
  safeEqual,
  sha256Hex,
  signAccessToken,
  verifyPkce,
} from "@/lib/community/oauth";

export const dynamic = "force-dynamic";

function oauthError(error: string, status = 400) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

async function readParams(req: NextRequest): Promise<URLSearchParams> {
  const type = req.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    return new URLSearchParams(Object.entries(body).map(([k, v]) => [k, String(v ?? "")]));
  }
  return new URLSearchParams(await req.text());
}

function clientCredentials(req: NextRequest, params: URLSearchParams) {
  const header = req.headers.get("authorization") || "";
  if (header.startsWith("Basic ")) {
    const decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
    const i = decoded.indexOf(":");
    if (i > 0) {
      return { id: decodeURIComponent(decoded.slice(0, i)), secret: decodeURIComponent(decoded.slice(i + 1)) };
    }
  }
  return { id: params.get("client_id") || "", secret: params.get("client_secret") || "" };
}

export async function POST(req: NextRequest) {
  const config = getCommunityOAuthConfig();
  if (!config) return oauthError("sso_not_configured", 503);

  const params = await readParams(req);
  const client = clientCredentials(req, params);
  if (!safeEqual(client.id, config.clientId) || !safeEqual(client.secret, config.clientSecret)) {
    console.warn("[community-sso] token: invalid client credentials");
    return oauthError("invalid_client", 401);
  }
  if (params.get("grant_type") !== "authorization_code") return oauthError("unsupported_grant_type");

  const code = params.get("code") || "";
  const redirectUri = params.get("redirect_uri") || "";
  if (!code || redirectUri !== config.redirectUri) return oauthError("invalid_grant");

  const db = await getDb();
  const record = await db.communityOAuthCode.findUnique({ where: { codeHash: sha256Hex(code) } });
  if (!record || record.redirectUri !== redirectUri || record.expiresAt.getTime() < Date.now()) {
    return oauthError("invalid_grant");
  }
  if (record.codeChallenge && !verifyPkce(params.get("code_verifier") || "", record.codeChallenge)) {
    return oauthError("invalid_grant");
  }

  // Атомарно гасим код: повторный callback с тем же code получит invalid_grant.
  const consumed = await db.communityOAuthCode.updateMany({
    where: { id: record.id, usedAt: null },
    data: { usedAt: new Date() },
  });
  if (consumed.count !== 1) {
    console.warn("[community-sso] token: authorization code replay rejected");
    return oauthError("invalid_grant");
  }

  return NextResponse.json(
    {
      access_token: signAccessToken(record.userId, config.clientSecret),
      token_type: "Bearer",
      expires_in: ACCESS_TOKEN_TTL_SECONDS,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
