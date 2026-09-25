import { CLUSTERS, clusterById, clusterPriorityCap } from "./clusters";
import type {
  ContentClusterId,
  PageType,
  PostInventoryRow,
  PostVerdict,
  Priority,
} from "./types";

const PRODUCT_PREFIXES = [
  "/resheniya",
  "/services",
  "/avito",
  "/vaibik",
  "/skills",
  "/prompts",
  "/ai-tools",
  "/ui-patterns",
  "/mcp",
  "/models",
  "/agent-engineering",
  "/ai-skills",
  "/ai-without-vpn",
  "/russian-ai",
  "/arsenal",
  "/pricing",
];

const NOISE_RE =
  /simulated\s*cell|биологическ|cyberpunk|pop\s*mart|arxiv(?!\s*ai)|вентиляц|playstation|\bxbox\b|\bsteam\b|iphone|samsung\s*galaxy|криптовалют|\bnft\b|атаковать человека|перестала подчиняться/i;

const EVERGREEN_TOPIC_RE =
  /как\s+|что\s+такое|гайд|инструкц|пошаг|с\s+нуля|для\s+новичка|сравнен|vs\b|versus|промпт|skill|агент|cursor|mcp|telegram|saas|без\s*vpn|вайб/i;

const NEWS_SIGNAL_RE =
  /выпустил|анонсир|обновил|представил|запустил|новост|что\s+изменил|с\s+\d{1,2}\s+(январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр)/i;

function normalize(text: string): string {
  return text
    .toLocaleLowerCase("ru")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s/-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export function parseSeoMeta(content: string): {
  contentType: string | null;
  intent: string | null;
  primaryKeyword: string | null;
} {
  const typeM = content.match(/type:([^;]+)/);
  const intentM = content.match(/intent:([^;]+)/);
  const primaryM = content.match(/primary:([^;\s-]+)/);
  return {
    contentType: typeM ? safeDecode(typeM[1]) : null,
    intent: intentM ? safeDecode(intentM[1]) : null,
    primaryKeyword: primaryM ? safeDecode(primaryM[1]) : null,
  };
}

export function extractProductUrls(html: string): string[] {
  const links = [...html.matchAll(/href="(\/[^"]+)"/g)].map((m) => m[1]);
  return [
    ...new Set(
      links.filter((url) =>
        PRODUCT_PREFIXES.some((prefix) => url === prefix || url.startsWith(`${prefix}/`)),
      ),
    ),
  ];
}

export function detectCluster(title: string, tags: string, category: string, html: string): ContentClusterId {
  const titleN = normalize(`${title} ${tags}`);
  const bodyN = normalize(`${category} ${stripHtml(html).slice(0, 800)}`);
  if (NOISE_RE.test(`${titleN} ${bodyN}`)) return "noise";

  let best: ContentClusterId = "noise";
  let bestScore = 0;
  for (const cluster of CLUSTERS) {
    if (cluster.id === "noise") continue;
    let score = 0;
    for (const token of cluster.tokens) {
      const t = normalize(token);
      if (titleN.includes(t)) score += token.length >= 5 ? 4 : 3;
      else if (bodyN.includes(t)) score += token.length >= 5 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = cluster.id;
    }
  }
  return bestScore >= 3 ? best : categoryHint(category);
}

function categoryHint(category: string): ContentClusterId {
  const c = normalize(category);
  if (c.includes("авито")) return "avito-ai";
  if (c.includes("ozon") || c.includes("wildberries") || c.includes("маркетплейс")) return "marketplace";
  if (c.includes("автоматизац")) return "marketplace";
  if (c.includes("дизайн")) return "ui-design";
  if (c.includes("ai-инжиниринг") || c === "ai") return "ai-agents";
  if (c.includes("разработ")) return "cursor-vibe";
  return "llm-models";
}

export function guessPageType(input: {
  title: string;
  contentType: string | null;
  wordCount: number;
  hasFaq: boolean;
}): PageType {
  const title = normalize(input.title);
  if (/vs\b|versus|сравнен|или\s+/.test(title)) return "comparison";
  if (input.hasFaq || /faq|часто задаваем/.test(title)) return "faq";
  if (/кейс|case study|разбор проекта/.test(title)) return "case";
  if (input.contentType === "Practical" || EVERGREEN_TOPIC_RE.test(title)) {
    if (input.wordCount >= 500) return "guide";
    return "explainer";
  }
  if (input.contentType === "Explainer") return "explainer";
  if (input.contentType === "News" || NEWS_SIGNAL_RE.test(title)) return "news";
  if (input.wordCount >= 600 && EVERGREEN_TOPIC_RE.test(title)) return "guide";
  return input.contentType === "Practical" ? "guide" : "news";
}

function titleTokens(title: string): Set<string> {
  return new Set(
    normalize(title)
      .split(" ")
      .filter((w) => w.length >= 4)
      .slice(0, 12),
  );
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const x of a) if (b.has(x)) inter += 1;
  return inter / (a.size + b.size - inter);
}

export type RawPost = {
  id: string;
  slug: string;
  title: string;
  content: string;
  tags: string;
  aiGenerated: boolean;
  viewCount: number;
  publishedAt: Date | null;
  categoryName: string;
};

/**
 * Эвристический вердикт Фазы 0.
 * Не удаляет URL — только рекомендует действие.
 */
export function classifyPost(post: RawPost, peers: RawPost[]): Omit<PostInventoryRow, "mergeIntoSlug"> & { mergeCandidateSlug: string | null } {
  const html = post.content || "";
  const text = stripHtml(html);
  const wordCount = text ? text.split(/\s+/).length : 0;
  const seo = parseSeoMeta(html);
  const productUrls = extractProductUrls(html);
  const hasProductLink = productUrls.length > 0;
  const hasFaq = /FAQ|Часто задаваемые/i.test(html);
  const cluster = detectCluster(post.title, post.tags, post.categoryName, html);
  const pageTypeGuess = guessPageType({
    title: post.title,
    contentType: seo.contentType,
    wordCount,
    hasFaq,
  });

  const tokens = titleTokens(post.title);
  let mergeCandidateSlug: string | null = null;
  let bestSim = 0;
  for (const peer of peers) {
    if (peer.id === post.id) continue;
    if (peer.viewCount < post.viewCount) continue;
    if (peer.viewCount === post.viewCount && peer.slug <= post.slug) continue;
    const sim = jaccard(tokens, titleTokens(peer.title));
    if (sim >= 0.45 && sim > bestSim) {
      bestSim = sim;
      mergeCandidateSlug = peer.slug;
    }
  }

  let verdict: PostVerdict = "keep";
  let priority: Priority = "P3";
  let reason = "";
  let nextAction = "";

  const isContentAsset = /<!--\s*content-asset:/.test(html);
  const isNoise = !isContentAsset && (cluster === "noise" || NOISE_RE.test(normalize(post.title)));
  const isThin = wordCount > 0 && wordCount < 320;
  const isVeryThin = wordCount > 0 && wordCount < 220;
  const isNewsish =
    !isContentAsset &&
    (pageTypeGuess === "news" || seo.contentType === "News" || NEWS_SIGNAL_RE.test(post.title));
  const evergreenCandidate =
    !isNewsish || EVERGREEN_TOPIC_RE.test(post.title) || pageTypeGuess === "guide" || pageTypeGuess === "explainer";
  const strongViews = post.viewCount >= 35;
  const weakViews = post.viewCount <= 5;
  const humanEvergreen = !post.aiGenerated && wordCount >= 400 && !isNoise;

  // Ручные поисковые активы Фазы 1 — не трогаем как News/stop
  if (isContentAsset && !isNoise) {
    const finalType: PageType =
      pageTypeGuess === "news" ? (EVERGREEN_TOPIC_RE.test(post.title) ? "guide" : "explainer") : pageTypeGuess;
    return {
      id: post.id,
      slug: post.slug,
      url: `https://proektmap.ru/blog/${post.slug}`,
      title: post.title,
      category: post.categoryName,
      aiGenerated: post.aiGenerated,
      viewCount: post.viewCount,
      wordCount,
      publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
      contentType: seo.contentType || "Practical",
      intent: seo.intent,
      primaryKeyword: seo.primaryKeyword,
      cluster: cluster === "noise" ? detectCluster(post.title, post.tags, post.categoryName, post.title) : cluster,
      pageTypeGuess: finalType,
      hasProductLink,
      productUrls,
      hasFaq,
      verdict: hasProductLink ? "keep" : "product-link",
      priority: "P0",
      reason: "Поисковый актив (content-asset)",
      nextAction: hasProductLink
        ? "Мониторить спрос; усиливать FAQ и внутренние ссылки"
        : "Добавить CTA на продукт кластера",
      mergeCandidateSlug: null,
    };
  }

  if (isNoise || (isVeryThin && weakViews && post.aiGenerated && isNewsish)) {
    verdict = "stop";
    priority = weakViews ? "P2" : "P3";
    reason = isNoise
      ? "Вне фокуса ProektMap / шум"
      : "Тонкий AI-News без спроса и просмотров";
    nextAction = "Не развивать; при consolidate — 301 на кластерный guide или оставить архивом без инвестиций";
  } else if (mergeCandidateSlug && (isThin || bestSim >= 0.55)) {
    verdict = "merge";
    priority = "P1";
    reason = `Дубль/пересечение с более сильным постом (sim=${bestSim.toFixed(2)})`;
    nextAction = `Объединить в /blog/${mergeCandidateSlug}, с текущего — 301 после ручной проверки`;
  } else if (humanEvergreen || (strongViews && wordCount >= 450 && hasProductLink)) {
    verdict = "keep";
    priority = strongViews ? "P1" : "P2";
    reason = humanEvergreen ? "Сильный human/экспертный материал" : "Уже тянет просмотры и связан с продуктом";
    nextAction = "Оставить; при возможности добавить FAQ/обновить дату";
  } else if (!hasProductLink && !isNoise && (pageTypeGuess !== "news" || post.viewCount >= 15 || evergreenCandidate)) {
    verdict = "product-link";
    priority = cluster === "noise" ? "P3" : "P1";
    reason = "Тема в кластере, но нет ссылки на продукт ProektMap";
    nextAction = `Добавить CTA на ${clusterById(cluster).productUrls[0] || "/resheniya"}`;
  } else if (evergreenCandidate && (isThin || isNewsish) && !isNoise) {
    verdict = "evergreen";
    priority = productClusterPriority(cluster);
    reason = "Тема вечнозелёная, формат сейчас News/тонкий — превратить в guide/entity";
    nextAction = "Расширить до guide: ответ сверху, шаги, плохо→хорошо, CTA";
  } else if (isThin && !isNewsish && !isNoise) {
    verdict = "expand";
    priority = "P1";
    reason = "Кластерный материал слишком тонкий для актива";
    nextAction = "Дописать до 800–1500 слов с уникальной ценностью ProektMap";
  } else if (isNewsish && post.aiGenerated) {
    verdict = "leave-as-news";
    priority = "P3";
    reason = "Своевременная новость — архив, не ядро спроса";
    nextAction = "Не расширять; при новой волне — обновить entity-кластер, не клонировать пост";
  } else if (!hasProductLink && isNewsish) {
    verdict = "leave-as-news";
    priority = "P3";
    reason = "News без продуктовой связки";
    nextAction = "Оставить как News или связать с entity при апдейте кластера";
  } else {
    verdict = "keep";
    priority = "P2";
    reason = "Базово приемлемо";
    nextAction = "Мониторить в матрице спроса";
  }

  // Усиливаем expand, если product-link уже есть, но текст тонкий
  if (verdict === "product-link" && isThin && evergreenCandidate) {
    verdict = "expand";
    reason = "Тонкий кластерный пост — сначала расширить, затем CTA";
    nextAction = "Expand + обязательный product CTA";
    priority = "P0";
  }

  return {
    id: post.id,
    slug: post.slug,
    url: `https://proektmap.ru/blog/${post.slug}`,
    title: post.title,
    category: post.categoryName,
    aiGenerated: post.aiGenerated,
    viewCount: post.viewCount,
    wordCount,
    publishedAt: post.publishedAt ? post.publishedAt.toISOString() : null,
    contentType: seo.contentType,
    intent: seo.intent,
    primaryKeyword: seo.primaryKeyword,
    cluster,
    pageTypeGuess,
    hasProductLink,
    productUrls,
    hasFaq,
    verdict,
    priority,
    reason,
    nextAction,
    mergeCandidateSlug,
  };
}

function productClusterPriority(cluster: ContentClusterId): Priority {
  return clusterPriorityCap(cluster) === "P0" ? "P1" : clusterPriorityCap(cluster);
}

export function finalizeMergeSlugs(
  rows: Array<ReturnType<typeof classifyPost>>,
): PostInventoryRow[] {
  return rows.map((row) => ({
    id: row.id,
    slug: row.slug,
    url: row.url,
    title: row.title,
    category: row.category,
    aiGenerated: row.aiGenerated,
    viewCount: row.viewCount,
    wordCount: row.wordCount,
    publishedAt: row.publishedAt,
    contentType: row.contentType,
    intent: row.intent,
    primaryKeyword: row.primaryKeyword,
    cluster: row.cluster,
    pageTypeGuess: row.pageTypeGuess,
    hasProductLink: row.hasProductLink,
    productUrls: row.productUrls,
    hasFaq: row.hasFaq,
    verdict: row.verdict,
    mergeIntoSlug: row.mergeCandidateSlug,
    priority: row.priority,
    reason: row.reason,
    nextAction: row.nextAction,
  }));
}
