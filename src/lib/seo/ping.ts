const INDEXNOW_KEY = "6f8a2c1d4e5b7a9f3c2d1e0f8a7b6c5d";
const BASE_URL = "https://proektmap.ru";

export async function pingSearchEngines(slug: string) {
  const url = BASE_URL + "/blog/" + slug;
  try { await fetch("https://api.indexnow.org/indexnow", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ host: "proektmap.ru", key: INDEXNOW_KEY, keyLocation: BASE_URL + "/" + INDEXNOW_KEY + ".txt", urlList: [url] }), signal: AbortSignal.timeout(5000) }); } catch {}
  try { await fetch("https://webmaster.yandex.ru/ping?sitemap=" + encodeURIComponent(BASE_URL + "/sitemap.xml"), { signal: AbortSignal.timeout(5000) }); } catch {}
  try { await fetch("https://www.google.com/ping?sitemap=" + encodeURIComponent(BASE_URL + "/sitemap.xml"), { signal: AbortSignal.timeout(5000) }); } catch {}
}
