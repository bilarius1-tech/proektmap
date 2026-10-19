// @vitest-environment node
import { createHash } from "crypto";
import { describe, expect, it } from "vitest";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  base64url,
  getCommunityOAuthConfig,
  safeCallbackPath,
  signAccessToken,
  suggestUsername,
  verifyAccessToken,
  verifyPkce,
} from "@/lib/community/oauth";

const SECRET = "x".repeat(48);

describe("getCommunityOAuthConfig", () => {
  it("возвращает null без переменных или со слабым секретом", () => {
    expect(getCommunityOAuthConfig({} as NodeJS.ProcessEnv)).toBeNull();
    expect(
      getCommunityOAuthConfig({
        COMMUNITY_OAUTH_CLIENT_ID: "forum",
        COMMUNITY_OAUTH_CLIENT_SECRET: "short",
        COMMUNITY_OAUTH_REDIRECT_URI: "https://proektmap.ru/community/auth/proektmap",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
  });

  it("не принимает http redirect_uri", () => {
    expect(
      getCommunityOAuthConfig({
        COMMUNITY_OAUTH_CLIENT_ID: "forum",
        COMMUNITY_OAUTH_CLIENT_SECRET: SECRET,
        COMMUNITY_OAUTH_REDIRECT_URI: "http://proektmap.ru/community/auth/proektmap",
      } as unknown as NodeJS.ProcessEnv),
    ).toBeNull();
  });
});

describe("PKCE S256", () => {
  const verifier = "a".repeat(64);
  const challenge = base64url(createHash("sha256").update(verifier).digest());

  it("принимает верный verifier", () => {
    expect(verifyPkce(verifier, challenge)).toBe(true);
  });

  it("отклоняет чужой или пустой verifier", () => {
    expect(verifyPkce("b".repeat(64), challenge)).toBe(false);
    expect(verifyPkce("", challenge)).toBe(false);
  });
});

describe("access token", () => {
  it("возвращает sub для свежего токена", () => {
    const token = signAccessToken("user-1", SECRET);
    expect(verifyAccessToken(token, SECRET)).toBe("user-1");
  });

  it("отклоняет просроченный токен", () => {
    const issued = Date.now() - (ACCESS_TOKEN_TTL_SECONDS + 5) * 1000;
    const token = signAccessToken("user-1", SECRET, issued);
    expect(verifyAccessToken(token, SECRET)).toBeNull();
  });

  it("отклоняет подделку и чужой секрет", () => {
    const token = signAccessToken("user-1", SECRET);
    const [, sig] = token.split(".");
    const forged = `${base64url(Buffer.from(JSON.stringify({ sub: "admin", exp: 9999999999 })))}.${sig}`;
    expect(verifyAccessToken(forged, SECRET)).toBeNull();
    expect(verifyAccessToken(token, "y".repeat(48))).toBeNull();
    expect(verifyAccessToken("garbage", SECRET)).toBeNull();
  });
});

describe("safeCallbackPath", () => {
  it("пропускает пути сайта и authorize-ссылку с закодированным redirect_uri", () => {
    expect(safeCallbackPath("/blog/test")).toBe("/blog/test");
    const authorize = "/api/community/oauth/authorize?client_id=forum&redirect_uri=https%3A%2F%2Fproektmap.ru%2Fcommunity";
    expect(safeCallbackPath(authorize)).toBe(authorize);
  });

  it("режет внешние адреса", () => {
    expect(safeCallbackPath("https://evil.example")).toBe("/dashboard");
    expect(safeCallbackPath("//evil.example")).toBe("/dashboard");
    expect(safeCallbackPath("/\\evil.example")).toBe("/dashboard");
    expect(safeCallbackPath("/\t/evil.example")).toBe("/dashboard");
    expect(safeCallbackPath(null)).toBe("/dashboard");
  });
});

describe("suggestUsername", () => {
  it("транслитерирует кириллицу", () => {
    expect(suggestUsername("Алексей Иванов", "a@ya.ru")).toBe("aleksey_ivanov");
  });

  it("берёт часть email, если имя короткое или пустое", () => {
    expect(suggestUsername("", "vibe.coder@yandex.ru")).toBe("vibe_coder");
    expect(suggestUsername("Я", "ab@ya.ru")).toBe("user_ab");
  });

  it("укладывается в лимит длины", () => {
    expect(suggestUsername("очень длинное имя пользователя для форума", "x@y.z").length).toBeLessThanOrEqual(24);
  });
});
