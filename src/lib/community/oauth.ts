import { createHash, createHmac, randomBytes, timingSafeEqual } from "crypto";

export const CODE_TTL_SECONDS = 60;
export const ACCESS_TOKEN_TTL_SECONDS = 300;

export type CommunityOAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

/** null — SSO форума не настроен (нет переменных окружения), эндпоинты отвечают 503. */
export function getCommunityOAuthConfig(env: NodeJS.ProcessEnv = process.env): CommunityOAuthConfig | null {
  const clientId = env.COMMUNITY_OAUTH_CLIENT_ID || "";
  const clientSecret = env.COMMUNITY_OAUTH_CLIENT_SECRET || "";
  const redirectUri = env.COMMUNITY_OAUTH_REDIRECT_URI || "";
  if (!clientId || clientSecret.length < 32 || !redirectUri.startsWith("https://")) return null;
  return { clientId, clientSecret, redirectUri };
}

export function sha256Hex(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export function base64url(buf: Buffer): string {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function randomToken(bytes = 32): string {
  return base64url(randomBytes(bytes));
}

export function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

/** PKCE S256: base64url(sha256(verifier)) === challenge. */
export function verifyPkce(verifier: string, challenge: string): boolean {
  if (!/^[A-Za-z0-9\-._~]{43,128}$/.test(verifier)) return false;
  const computed = base64url(createHash("sha256").update(verifier).digest());
  return safeEqual(computed, challenge);
}

function accessTokenKey(clientSecret: string): Buffer {
  return createHmac("sha256", clientSecret).update("proektmap-community-access-token").digest();
}

/** Короткоживущий подписанный токен только для /userinfo. Формат: base64url(payload).base64url(hmac). */
export function signAccessToken(userId: string, clientSecret: string, nowMs = Date.now()): string {
  const payload = base64url(
    Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(nowMs / 1000) + ACCESS_TOKEN_TTL_SECONDS })),
  );
  const sig = base64url(createHmac("sha256", accessTokenKey(clientSecret)).update(payload).digest());
  return `${payload}.${sig}`;
}

export function verifyAccessToken(token: string, clientSecret: string, nowMs = Date.now()): string | null {
  const [payload, sig, extra] = token.split(".");
  if (!payload || !sig || extra !== undefined) return null;
  const expected = base64url(createHmac("sha256", accessTokenKey(clientSecret)).update(payload).digest());
  if (!safeEqual(sig, expected)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: unknown; exp?: unknown };
    if (typeof data.sub !== "string" || typeof data.exp !== "number") return null;
    if (data.exp * 1000 < nowMs) return null;
    return data.sub;
  } catch {
    return null;
  }
}

export { safeCallbackPath } from "./oauth-client";

const TRANSLIT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l", м: "m",
  н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** Латинский username для Flarum (3–30 символов, a-z0-9_-). Уникальность добивает форум. */
export function suggestUsername(name: string | null | undefined, email: string): string {
  const fromName = (name || "")
    .toLowerCase()
    .split("")
    .map((ch) => TRANSLIT[ch] ?? ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const fromEmail = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  let base = fromName.length >= 3 ? fromName : fromEmail;
  if (base.length < 3) base = `user_${base}`.replace(/_+$/, "") || "user";
  if (base.length < 3) base = "user";
  return base.slice(0, 24);
}
