/** Только относительный путь этого сайта: защищает /auth?callbackUrl от open redirect. */
export function safeCallbackPath(raw: string | null | undefined, fallback = "/dashboard"): string {
  if (!raw) return fallback;
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\") || /[\x00-\x1F\x7F]/.test(raw)) return fallback;
  const q = raw.indexOf("?");
  const path = q === -1 ? raw : raw.slice(0, q);
  if (path.includes("://")) return fallback;
  return raw;
}
