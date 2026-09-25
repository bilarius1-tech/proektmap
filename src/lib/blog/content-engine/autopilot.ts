/**
 * Автопилот контент-цеха V2:
 * матрица → выбор темы (core) → DeepSeek guide → гейт → publish → Telegram.
 */

import { ensureBlogCategory } from "@/lib/blog/categories";
import { mskDayStartUtc } from "@/lib/blog/daily-quota";
import { clusterById } from "@/lib/blog/content-engine/clusters";
import {
  extractDemandIdsFromInventory,
  pickNextAutopilotTopic,
  runPhase0Analysis,
} from "@/lib/blog/content-engine/matrix";
import type { DemandMatrixRow } from "@/lib/blog/content-engine/types";

export type AutopilotResult =
  | { status: "disabled" }
  | { status: "off-hours"; hour: number; expected: number }
  | { status: "already-ran-today" }
  | { status: "daily-limit"; publishedToday: number; limit: number }
  | { status: "no-topic" }
  | { status: "no-api-key" }
  | { status: "rejected"; reason: string; topic: string }
  | { status: "published"; slug: string; title: string; url: string; topic: string; query: string }
  | { status: "error"; message: string };

function translit(text: string): string {
  const map: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh", з: "z",
    и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
    с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
    ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
  };
  return text
    .toLowerCase()
    .split("")
    .map((c) => map[c] || c)
    .join("");
}

function cleanSlug(title: string): string {
  const clean = title.replace(/[^a-zа-я0-9\s-]/gi, "").trim();
  return translit(clean).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(html: string): number {
  const t = stripHtml(html);
  return t ? t.split(/\s+/).length : 0;
}

function mskHour(now = new Date()): number {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  return Number(parts.find((p) => p.type === "hour")?.value || "0") % 24;
}

function sameMskDay(a: Date, b: Date): boolean {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(a) === fmt.format(b);
}

export async function sendTelegram(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN || "";
  const chatId = process.env.TELEGRAM_REPORT_CHAT_ID || process.env.TELEGRAM_ADMIN_CHAT_ID || "";
  if (!token || !chatId || !text) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(10000),
    });
  } catch (e) {
    console.error("[content-autopilot] tg:", e);
  }
}

type GeneratedAsset = {
  title: string;
  metaTitle: string;
  metaDesc: string;
  html: string;
  primaryKeyword: string;
};

function buildAutopilotPrompt(topic: DemandMatrixRow): string {
  const cluster = clusterById(topic.cluster);
  return `Ты редактор ProektMap — платформы AI-вайбкодинга и обучения AI-инженерии в России.
Напиши ОДИН evergreen guide/entity HTML для блога (не новость).

ЗАПРОС: ${topic.query}
ИНТЕНТ: ${topic.intent}
ТИП СТРАНИЦЫ: ${topic.pageType}
КЛАСТЕР: ${cluster.title}
CTA (обязательная ссылка): ${topic.productCta}
УНИКАЛЬНАЯ ЦЕННОСТЬ: ${topic.uniqueValueHint}
ЗАМЕТКИ: ${topic.notes || "—"}

ПРАВИЛА:
1. Язык: русский, тон инженера, без хайпа и воды.
2. Первые 2 предложения — прямой ответ на запрос.
3. Обязательно блок «Плохо → хорошо» с конкретным bad и good (можно копировать в агент).
4. Минимум 2 заголовка <h2>. Без <h1>, script, markdown.
5. В html минимум одна ссылка <a href="${topic.productCta}">…</a> (URL символ в символ).
6. Можно ссылаться на /agent-engineering, /vaibik, /resheniya, /ai-without-vpn, /prompts, /ai-skills, /models — только если уместно.
7. Не выдумывай цифры, кейсы и тарифы. Не пиши про Авито/Ozon как ядро.
8. Объём html: 320–700 слов.
9. primaryKeyword — 2–4 слова, входит в title и metaTitle.

Верни ТОЛЬКО JSON:
{"title":"...","metaTitle":"...","metaDesc":"...","primaryKeyword":"...","html":"<p>...</p>"}`;
}

function parseGenerated(raw: string): GeneratedAsset {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start < 0 || end <= start) throw new Error("AI не вернул JSON");
  const parsed = JSON.parse(cleaned.slice(start, end + 1));
  const asset: GeneratedAsset = {
    title: String(parsed.title || "").trim(),
    metaTitle: String(parsed.metaTitle || "").trim(),
    metaDesc: String(parsed.metaDesc || "").trim(),
    html: String(parsed.html || "").trim(),
    primaryKeyword: String(parsed.primaryKeyword || "").trim(),
  };
  if (!asset.title || !asset.html.startsWith("<") || !asset.primaryKeyword) {
    throw new Error("AI вернул неполный JSON");
  }
  return asset;
}

export function gateAutopilotAsset(
  asset: GeneratedAsset,
  topic: DemandMatrixRow,
): { ok: true } | { ok: false; reason: string } {
  const words = wordCount(asset.html);
  const h2 = (asset.html.match(/<h2\b/gi) || []).length;
  const hasCta =
    asset.html.includes(`href="${topic.productCta}"`) ||
    asset.html.includes(`href='${topic.productCta}'`);
  const titleHasKey = asset.title.toLocaleLowerCase("ru").includes(
    asset.primaryKeyword.toLocaleLowerCase("ru").slice(0, 8),
  );
  const hasBadGood = /плохо|хорошо|bad|good/i.test(asset.html);
  const role = clusterById(topic.cluster).role;

  if (role === "satellite" || role === "noise") return { ok: false, reason: "satellite-cluster" };
  if (words < 280) return { ok: false, reason: `too-short:${words}` };
  if (h2 < 2) return { ok: false, reason: `few-h2:${h2}` };
  if (!hasCta) return { ok: false, reason: "missing-product-cta" };
  if (!titleHasKey && asset.primaryKeyword.length >= 4) return { ok: false, reason: "keyword-not-in-title" };
  if (!hasBadGood) return { ok: false, reason: "missing-bad-good" };
  if (asset.metaDesc.length < 80 || asset.metaDesc.length > 200) {
    return { ok: false, reason: `metaDesc-len:${asset.metaDesc.length}` };
  }
  return { ok: true };
}

async function generateAsset(
  key: string,
  model: string,
  topic: DemandMatrixRow,
): Promise<GeneratedAsset> {
  const useModel = model === "deepseek-reasoner" ? "deepseek-v4-flash" : model;
  const payload: Record<string, unknown> = {
    model: useModel,
    messages: [
      {
        role: "system",
        content: "Ты создаёшь поисковые активы ProektMap. Отвечай только валидным JSON без Markdown.",
      },
      { role: "user", content: buildAutopilotPrompt(topic) },
    ],
    max_tokens: 4000,
    temperature: 0.35,
    thinking: { type: "disabled" },
  };

  async function call(body: Record<string, unknown>) {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(90000),
    });
    if (!res.ok) throw new Error(`DeepSeek ${res.status}`);
    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    if (!content.trim()) throw new Error("empty AI content");
    return parseGenerated(content);
  }

  try {
    return await call({ ...payload, response_format: { type: "json_object" } });
  } catch {
    const { thinking: _t, ...rest } = payload;
    return await call({ ...rest, response_format: { type: "json_object" } });
  }
}

async function countAutopilotPublishedToday(db: any): Promise<number> {
  const since = mskDayStartUtc();
  return db.blogPost.count({
    where: {
      status: "published",
      publishedAt: { gte: since },
      OR: [
        { content: { contains: "content-asset:" } },
        { tags: { contains: "content-asset" } },
      ],
    },
  });
}

export type RunAutopilotOptions = {
  force?: boolean;
  /** Не слать Telegram (для тестов) */
  silent?: boolean;
};

/**
 * Полный прогон автопилота. При успехе/skip обновляет contentAutopilotLastRunAt.
 * При включённом автопилоте гасит news-фабрику (autoPublishEnabled=false).
 */
export async function runContentAutopilot(db: any, opts: RunAutopilotOptions = {}): Promise<AutopilotResult> {
  let settings: any = null;
  try {
    settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  } catch {
    return { status: "error", message: "settings-read-failed" };
  }

  if (!settings?.contentAutopilotEnabled && !opts.force) {
    return { status: "disabled" };
  }

  // При включённом автопилоте — не крутим RSS-фабрику новостей
  if (settings?.contentAutopilotEnabled && settings.autoPublishEnabled) {
    try {
      await db.siteSettings.update({
        where: { id: "main" },
        data: { autoPublishEnabled: false },
      });
    } catch (e) {
      console.warn("[content-autopilot] failed to disable news factory", e);
    }
  }

  const hour = mskHour();
  const expectedHour = settings?.contentAutopilotHour ?? 10;
  if (!opts.force && hour !== expectedHour) {
    return { status: "off-hours", hour, expected: expectedHour };
  }

  if (!opts.force && settings?.contentAutopilotLastRunAt) {
    if (sameMskDay(new Date(settings.contentAutopilotLastRunAt), new Date())) {
      return { status: "already-ran-today" };
    }
  }

  const limit = settings?.contentAutopilotDailyLimit ?? 1;
  const publishedToday = await countAutopilotPublishedToday(db);
  if (publishedToday >= limit && !opts.force) {
    return { status: "daily-limit", publishedToday, limit };
  }

  let key = process.env.DEEPSEEK_API_KEY || "";
  if (settings?.deepseekApiKey) key = settings.deepseekApiKey;
  if (!key) return { status: "no-api-key" };

  const model = settings?.deepseekModel || "deepseek-v4-flash";

  const { inventory, demandMatrix } = await runPhase0Analysis(db);
  const contents = await db.blogPost.findMany({
    where: { status: "published", content: { contains: "content-asset:" } },
    select: { id: true, content: true },
    take: 500,
  });
  const existingDemandIds = extractDemandIdsFromInventory(inventory, contents);
  const topic = pickNextAutopilotTopic(demandMatrix, inventory, existingDemandIds);

  if (!topic) {
    await db.siteSettings.update({
      where: { id: "main" },
      data: { contentAutopilotLastRunAt: new Date() },
    });
    if (!opts.silent) {
      await sendTelegram("Автопилот контента: тем не осталось (все P0/P1 core покрыты или в очереди нет дыр).");
    }
    return { status: "no-topic" };
  }

  let asset: GeneratedAsset;
  try {
    asset = await generateAsset(key, model, topic);
  } catch (e: any) {
    const message = String(e?.message || e).slice(0, 120);
    if (!opts.silent) await sendTelegram(`Автопилот: AI не смог написать «${topic.query}»: ${message}`);
    return { status: "error", message };
  }

  const gate = gateAutopilotAsset(asset, topic);
  if (!gate.ok) {
    if (!opts.silent) {
      await sendTelegram(`Автопилот: отклонил «${topic.query}» — ${gate.reason}`);
    }
    await db.siteSettings.update({
      where: { id: "main" },
      data: { contentAutopilotLastRunAt: new Date() },
    });
    return { status: "rejected", reason: gate.reason, topic: topic.query };
  }

  const admin = await db.user.findFirst({ where: { role: "admin" } });
  if (!admin) return { status: "error", message: "no-admin" };

  const cat = await ensureBlogCategory(db, "AI-инжиниринг");
  if (!cat) return { status: "error", message: "no-category" };

  let slug = cleanSlug(asset.title);
  if (!slug) slug = cleanSlug(topic.query) || `asset-${Date.now()}`;
  if (await db.blogPost.findUnique({ where: { slug } })) {
    slug = `${slug}-${Date.now().toString(36).slice(-4)}`;
  }

  const marker = `<!-- content-asset:${topic.id}; cluster:${topic.cluster}; primary:${encodeURIComponent(asset.primaryKeyword)}; autopilot:1 -->`;
  const content = `${marker}\n${asset.html}`;
  const tags = [
    "content-asset",
    "AI-инжиниринг",
    topic.pageType,
    topic.cluster,
    asset.primaryKeyword,
    "autopilot",
  ]
    .filter(Boolean)
    .join(",");

  await db.blogPost.create({
    data: {
      title: asset.title,
      slug,
      content,
      excerpt: asset.metaDesc.slice(0, 170),
      coverImage: `/api/og?title=${encodeURIComponent(asset.title.slice(0, 80))}&category=${encodeURIComponent("AI-инжиниринг")}`,
      status: "published",
      authorId: admin.id,
      categoryId: cat.id,
      tags,
      aiGenerated: true,
      aiModel: model === "deepseek-reasoner" ? "deepseek-v4-flash" : model,
      metaTitle: asset.metaTitle.slice(0, 80),
      metaDesc: asset.metaDesc.slice(0, 170),
      publishedAt: new Date(),
    },
  });

  await db.siteSettings.update({
    where: { id: "main" },
    data: { contentAutopilotLastRunAt: new Date() },
  });

  const url = `https://proektmap.ru/blog/${slug}`;
  if (!opts.silent) {
    await sendTelegram(
      `Автопилот контента опубликовал актив:\n«${asset.title}»\nТема: ${topic.query}\n${url}`,
    );
  }

  return {
    status: "published",
    slug,
    title: asset.title,
    url,
    topic: topic.id,
    query: topic.query,
  };
}
