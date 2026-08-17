export type SeoContentType = "News" | "Explainer" | "Practical";

export type InternalLinkCandidate = {
  title: string;
  url: string;
  description: string;
};

export type SeoArticle = {
  title: string;
  metaTitle: string;
  metaDesc: string;
  contentType: SeoContentType;
  intent: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  html: string;
  faq: { question: string; answer: string }[];
};

export type SeoCheck = {
  score: number;
  checks: Record<string, { passed: boolean; points: number; note: string }>;
  missing: string[];
};

const CONTENT_TYPES = new Set<SeoContentType>(["News", "Explainer", "Practical"]);

function normalize(value: string): string {
  return value.toLocaleLowerCase("ru").replace(/ё/g, "е").replace(/[^a-zа-я0-9]+/g, " ").replace(/\s+/g, " ").trim();
}

function stripHtml(value: string): string {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
}

function wordCount(html: string): number {
  const text = stripHtml(html);
  return text ? text.split(/\s+/).length : 0;
}

/**
 * Русский текст склоняется, поэтому дословное совпадение ключа даёт ложные отказы.
 * Считаем ключ найденным, если каждое значимое слово присутствует с точностью до окончания.
 */
export function containsKeyword(haystack: string, keyword: string): boolean {
  const text = normalize(haystack);
  const key = normalize(keyword);
  if (!key || !text) return false;
  if (text.includes(key)) return true;

  const words = key.split(" ").filter((word) => word.length >= 3);
  if (words.length === 0) return false;

  const textWords = text.split(" ");
  return words.every((word) => {
    const stem = word.slice(0, Math.max(4, word.length - 2));
    return textWords.some((candidate) => candidate.startsWith(stem));
  });
}

export function parseSeoKeywords(value: string): string[] {
  return [...new Set(value.split(/[,;\n]/).map((keyword) => keyword.trim()).filter((keyword) => keyword.length >= 2))].slice(0, 120);
}

export function parseSeoArticle(raw: string): SeoArticle {
  const cleaned = raw.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart < 0 || jsonEnd <= jsonStart) throw new Error("AI не вернул JSON");

  const parsed = JSON.parse(cleaned.slice(jsonStart, jsonEnd + 1)) as Partial<SeoArticle>;
  const contentType = CONTENT_TYPES.has(parsed.contentType as SeoContentType) ? parsed.contentType as SeoContentType : "Explainer";
  const faq = Array.isArray(parsed.faq)
    ? parsed.faq
        .map((item) => ({
          question: String(item?.question || "").trim(),
          answer: String(item?.answer || "").trim(),
        }))
        .filter((item) => item.question && item.answer)
        .slice(0, 5)
    : [];

  const article: SeoArticle = {
    title: String(parsed.title || "").trim(),
    metaTitle: String(parsed.metaTitle || "").trim(),
    metaDesc: String(parsed.metaDesc || "").trim(),
    contentType,
    intent: String(parsed.intent || "информационный").trim(),
    primaryKeyword: String(parsed.primaryKeyword || "").trim(),
    secondaryKeywords: Array.isArray(parsed.secondaryKeywords)
      ? parsed.secondaryKeywords.map(String).map((item) => item.trim()).filter(Boolean).slice(0, 15)
      : [],
    html: String(parsed.html || "").trim(),
    faq,
  };

  if (!article.title || !article.primaryKeyword || !article.html.startsWith("<")) {
    throw new Error("AI вернул неполную SEO-статью");
  }

  return article;
}

export function sanitizeArticleHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*(["']).*?\1/gi, "")
    .replace(/\s(?:href|src)\s*=\s*(["'])javascript:[\s\S]*?\1/gi, "");
}

export function appendFaq(html: string, faq: SeoArticle["faq"]): string {
  if (faq.length === 0 || /<h2[^>]*>\s*(?:FAQ|Часто задаваемые вопросы)/i.test(html)) return html;
  const items = faq
    .map(({ question, answer }) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`)
    .join("");
  return `${html}<section data-seo-faq="true"><h2>Часто задаваемые вопросы</h2>${items}</section>`;
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function scoreSeoArticle(
  article: SeoArticle,
  sourceUrl: string,
  allowedInternalUrls: string[],
  sourceDescription = "",
): SeoCheck {
  const checks: SeoCheck["checks"] = {};
  let score = 0;
  const add = (name: string, passed: boolean, points: number, note: string) => {
    checks[name] = { passed, points: passed ? points : 0, note };
    if (passed) score += points;
  };

  const title = normalize(article.title);
  const primary = normalize(article.primaryKeyword);
  const meta = normalize(article.metaDesc);
  const body = normalize(stripHtml(article.html));
  const headings = [...article.html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => normalize(stripHtml(match[1])));
  const words = wordCount(article.html);
  const internalCount = [...new Set(allowedInternalUrls.filter((url) => article.html.includes(`href="${url}"`) || article.html.includes(`href='${url}'`)))].length;
  const secondaryUsed = article.secondaryKeywords.filter((keyword) => {
    return normalize(keyword).length >= 2 && (containsKeyword(body, keyword) || headings.some((heading) => containsKeyword(heading, keyword)));
  }).length;
  const hasSource = article.html.includes(sourceUrl);
  const normalizedSource = normalize(stripHtml(sourceDescription));
  const isOriginal = normalizedSource.length < 80 || !body.includes(normalizedSource.slice(0, Math.min(220, normalizedSource.length)));

  add("Основной запрос", primary.length >= 2 && containsKeyword(title, primary), 15, primary ? `«${article.primaryKeyword}» в H1` : "Не выбран");
  add("Поисковый интент", article.intent.length >= 4 && CONTENT_TYPES.has(article.contentType), 5, `${article.contentType}: ${article.intent}`);
  add("Title", article.metaTitle.length >= 30 && article.metaTitle.length <= 80 && containsKeyword(article.metaTitle, primary), 10, `${article.metaTitle.length} символов`);
  add("Description", article.metaDesc.length >= 90 && article.metaDesc.length <= 180 && containsKeyword(meta, primary), 15, `${article.metaDesc.length} символов`);
  add("H2 структура", headings.length >= 2, 10, `${headings.length} заголовка H2`);
  add("Полезность", words >= 220 && words <= 1400, 10, `${words} слов`);
  add("Оригинальность", isOriginal, 5, isOriginal ? "Не повторяет RSS-описание" : "Повторяет исходное описание");
  add("Внутренние ссылки", internalCount >= 1, 15, `${internalCount} ссылок из каталога ProektMap`);
  add("Дополнительные запросы", secondaryUsed >= 1, 10, `${secondaryUsed} запросов использовано`);
  add("FAQ", article.faq.length === 0 || article.faq.length >= 2, 2, article.faq.length ? `${article.faq.length} вопроса` : "Не нужен для этого интента");
  add("Источник", hasSource, 3, hasSource ? "Ссылка присутствует" : "Нет ссылки на источник");

  return {
    score,
    checks,
    missing: Object.entries(checks).filter(([, check]) => !check.passed).map(([name, check]) => `${name}: ${check.note}`),
  };
}

export function buildSeoPrompt(input: {
  sourceTitle: string;
  sourceDescription: string;
  sourceUrl: string;
  category: string;
  siteKeywords: string[];
  internalLinks: InternalLinkCandidate[];
  revision?: { article: SeoArticle; check: SeoCheck };
}): string {
  const links = input.internalLinks.slice(0, 8).map((item) => `- ${item.title} | ${item.url}`).join("\n");
  const revision = input.revision
    ? `\nИсправь SEO (${input.revision.check.score}/100): ${input.revision.check.missing.join("; ")}.`
    : "";

  return `Ты SEO-редактор ProektMap для продавцов, авитологов и селлеров в России.
Источник — только факты. Не выдумывай цифры. Если новость зарубежная — переведи в сценарий для РФ.
Каждая статья даёт один практический шаг: карточка, заявки, цена, остатки, CRM, оплата или меньше ручной работы.

ИСТОЧНИК: ${input.sourceTitle}
ОПИСАНИЕ: ${input.sourceDescription || "(нет)"}
URL: ${input.sourceUrl}
РУБРИКА: ${input.category}
КЛЮЧИ: ${input.siteKeywords.slice(0, 12).join(", ") || "автоматизация продаж"}
ССЫЛКИ (1–2 штуки, только из списка):
${links || "- /ai-tools | AI-инструменты"}

ФОРМАТ: News, Explainer или Practical.

ОБЯЗАТЕЛЬНО, иначе статья отбраковывается:
1. primaryKeyword — короткая фраза 2–4 слова.
2. Эта фраза дословно входит в title, metaTitle и metaDesc — скопируй её без изменений и без склонения.
3. metaTitle 35–70 символов, metaDesc 100–165 символов.
4. html: 300–450 слов, 2–3 <h2>, чек-лист из 3–5 <li>.
5. Каждое слово из secondaryKeywords дословно встречается в тексте html.
6. В html минимум одна ссылка вида <a href="/ai-tools">…</a> строго из списка выше, URL копируй символ в символ.
7. Последний абзац html — <a href="${input.sourceUrl}">Источник</a>.

Без Markdown, <h1>, script и стилей.
${revision}
Верни ТОЛЬКО JSON:
{"title":"...","metaTitle":"...","metaDesc":"...","contentType":"News","intent":"...","primaryKeyword":"...","secondaryKeywords":["...","..."],"html":"<p>...</p>","faq":[]}`;
}
