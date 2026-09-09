/**
 * Enrich URL for Design Bank: HTML meta + DeepSeek RU blurb + favicon.
 */
import { getDb } from "@/lib/db";

export type PageMeta = {
  title: string;
  description: string;
  faviconUrl: string;
};

function absolutize(base: string, href: string | null | undefined): string {
  if (!href) return "";
  try {
    return new URL(href, base).toString();
  } catch {
    return "";
  }
}

function pickMeta(html: string, prop: string): string {
  const re = new RegExp(
    `<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']+)["']|<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${prop}["']`,
    "i"
  );
  const m = html.match(re);
  return (m?.[1] || m?.[2] || "").trim();
}

function pickTitle(html: string): string {
  const og = pickMeta(html, "og:title");
  if (og) return og;
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  return (m?.[1] || "").replace(/\s+/g, " ").trim();
}

function pickFavicon(html: string, pageUrl: string): string {
  const iconRe =
    /<link[^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["'][^>]+href=["']([^"']+)["']|<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon|apple-touch-icon)["']/gi;
  let best = "";
  let m: RegExpExecArray | null;
  while ((m = iconRe.exec(html))) {
    const href = m[1] || m[2];
    if (href) {
      best = absolutize(pageUrl, href);
      if (!href.includes("apple-touch")) break;
    }
  }
  if (best) return best;
  try {
    const host = new URL(pageUrl).origin;
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`;
  } catch {
    return "";
  }
}

export async function fetchPageMeta(url: string): Promise<PageMeta> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "ProektMap-Kopilka/1.0 (+https://proektmap.ru)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(12000),
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = (await res.text()).slice(0, 200_000);
  const title = pickTitle(html) || new URL(url).hostname;
  const description = pickMeta(html, "og:description") || pickMeta(html, "description");
  const faviconUrl = pickFavicon(html, url);
  return { title, description, faviconUrl };
}

async function deepseekKey(): Promise<string> {
  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  return (settings as { deepseekApiKey?: string } | null)?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
}

export async function generateDesignBlurb(input: {
  url: string;
  title: string;
  description: string;
  categoryTitle?: string;
}): Promise<string> {
  const key = await deepseekKey();
  if (!key) return input.description.slice(0, 280) || `Ресурс: ${input.title}`;

  const sys = `Ты — куратор копилки дизайна для вайбкодеров (сайты, UI, CSS, анимации).
Напиши РОВНО 1–2 коротких предложения на русском: что это за ресурс и зачем он полезен при сборке сайта.
Без маркетинга, без хэштегов, без markdown, без кавычек вокруг ответа. Максимум 220 символов.`;

  const user = [
    `URL: ${input.url}`,
    `Название: ${input.title}`,
    input.categoryTitle ? `Категория: ${input.categoryTitle}` : "",
    input.description ? `Мета-описание: ${input.description.slice(0, 500)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: sys },
        { role: "user", content: user },
      ],
      max_tokens: 180,
      temperature: 0.4,
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => "");
    throw new Error(`DeepSeek ${res.status}: ${err.slice(0, 120)}`);
  }

  const data = await res.json();
  const text = (data.choices?.[0]?.message?.content || "").trim().replace(/^["«]|["»]$/g, "");
  return text.slice(0, 400) || input.description.slice(0, 280) || input.title;
}

export async function enrichDesignUrl(url: string, categoryTitle?: string) {
  const meta = await fetchPageMeta(url);
  let descriptionRu = "";
  try {
    descriptionRu = await generateDesignBlurb({
      url,
      title: meta.title,
      description: meta.description,
      categoryTitle,
    });
  } catch {
    descriptionRu = meta.description.slice(0, 280) || meta.title;
  }
  return {
    title: meta.title.slice(0, 120),
    descriptionRu,
    faviconUrl: meta.faviconUrl,
    sourceMeta: JSON.stringify({ title: meta.title, description: meta.description }).slice(0, 2000),
  };
}
