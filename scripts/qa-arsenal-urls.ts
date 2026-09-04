/**
 * QA внешних ссылок Нейро каталога (/arsenal).
 * Запуск: npx tsx scripts/qa-arsenal-urls.ts
 */
import { ARSENAL_TOOLS } from "../src/lib/arsenal/tools";

type Check = { ok: boolean; status: number | string };

async function check(url: string, timeoutMs = 10000): Promise<Check> {
  if (!url || !/^https?:\/\//i.test(url)) return { ok: false, status: "invalid" };
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: ctrl.signal,
      headers: { "user-agent": "ProektMapArsenalQA/1.0 (+https://proektmap.ru)" },
    });
    if (res.status === 405 || res.status === 403 || res.status === 401) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: ctrl.signal,
        headers: {
          "user-agent": "ProektMapArsenalQA/1.0 (+https://proektmap.ru)",
          range: "bytes=0-0",
        },
      });
    }
    clearTimeout(t);
    // 401/403/429 часто = живой хост с антиботом — не считаем битой ссылкой
    const softOk = res.status === 401 || res.status === 403 || res.status === 429;
    return { ok: res.status < 400 || softOk, status: res.status };
  } catch (e: unknown) {
    clearTimeout(t);
    const err = e as { name?: string; cause?: { code?: string }; message?: string };
    return {
      ok: false,
      status: err?.name === "AbortError" ? "timeout" : err?.cause?.code || err?.message || "error",
    };
  }
}

async function main() {
  const tools = ARSENAL_TOOLS;
  const bad: { slug: string; name: string; url: string; status: number | string }[] = [];
  const emptyBoth: string[] = [];
  const emptyWebsite: string[] = [];
  let i = 0;
  const CONCURRENCY = 10;

  async function worker() {
    while (i < tools.length) {
      const idx = i++;
      const t = tools[idx];
      if (!t.website && !t.download) emptyBoth.push(t.slug);
      if (!t.website && t.download) emptyWebsite.push(t.slug);
      const url = t.website || t.download;
      const r = await check(url);
      if (!r.ok) bad.push({ slug: t.slug, name: t.name, url, status: r.status });
      if ((idx + 1) % 50 === 0) {
        console.error(`progress ${idx + 1}/${tools.length}, bad ${bad.length}`);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));

  console.log(JSON.stringify({
    total: tools.length,
    emptyBoth,
    emptyWebsiteCount: emptyWebsite.length,
    emptyWebsiteSample: emptyWebsite.slice(0, 20),
    badCount: bad.length,
    bad,
  }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
