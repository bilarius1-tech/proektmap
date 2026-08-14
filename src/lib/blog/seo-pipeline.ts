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
    const normalized = normalize(keyword);
    return normalized.length >= 2 && (body.includes(normalized) || headings.some((heading) => heading.includes(normalized)));
  }).length;
  const hasSource = article.html.includes(sourceUrl);
  const normalizedSource = normalize(stripHtml(sourceDescription));
  const isOriginal = normalizedSource.length < 80 || !body.includes(normalizedSource.slice(0, Math.min(220, normalizedSource.length)));

  add("Основной запрос", primary.length >= 2 && title.includes(primary), 15, primary ? `«${article.primaryKeyword}» в H1` : "Не выбран");
  add("Поисковый интент", article.intent.length >= 4 && CONTENT_TYPES.has(article.contentType), 5, `${article.contentType}: ${article.intent}`);
  add("Title", article.metaTitle.length >= 35 && article.metaTitle.length <= 70 && normalize(article.metaTitle).includes(primary), 10, `${article.metaTitle.length} символов`);
  add("Description", article.metaDesc.length >= 120 && article.metaDesc.length <= 170 && meta.includes(primary), 15, `${article.metaDesc.length} символов`);
  add("H2 структура", headings.length >= 3, 10, `${headings.length} заголовка H2`);
  add("Полезность", words >= 550 && words <= 1600, 10, `${words} слов`);
  add("Оригинальность", isOriginal, 5, isOriginal ? "Не повторяет RSS-описание" : "Повторяет исходное описание");
  add("Внутренние ссылки", internalCount >= 2, 15, `${internalCount} ссылок из каталога ProektMap`);
  add("Дополнительные запросы", secondaryUsed >= 2, 10, `${secondaryUsed} запросов использовано`);
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
  const links = input.internalLinks.map((item) => `- ${item.title} | ${item.url} | ${item.description.slice(0, 120)}`).join("\n");
  const revision = input.revision
    ? `\nПРЕДЫДУЩАЯ ВЕРСИЯ НЕ ПРОШЛА SEO CHECK (${input.revision.check.score}/100).\nИсправь: ${input.revision.check.missing.join("; ")}.\nПредыдущий JSON:\n${JSON.stringify(input.revision.article)}\n`
    : "";

  return `Ты — SEO-редактор и эксперт по AI-инжинирингу ProektMap.

ГЛАВНАЯ ФИЛОСОФИЯ:
Не производи статьи. Производи полезные ответы на вопросы пользователей.
НЕ переписывай и НЕ перефразируй новость. Используй её только как фактологический источник и повод создать самостоятельный поисковый материал.
Не выдумывай факты, цены, даты, функции и результаты тестов. Если данных нет — честно обозначь ограничение.

ИСТОЧНИК:
Заголовок: ${input.sourceTitle}
Описание RSS: ${input.sourceDescription || "(нет описания)"}
URL: ${input.sourceUrl}
Категория: ${input.category}

SEO-КЛЮЧИ PROEKTMAP (используй только релевантные, можно добавить точные запросы по теме):
${input.siteKeywords.join(", ") || "(список пуст — сформируй запросы из темы)"}

РАЗРЕШЁННЫЕ ВНУТРЕННИЕ ССЫЛКИ:
${links || "- /ai-tools | AI-инструменты\n- /blueprints | Blueprint'ы\n- /prompts | Промпты"}

КОНВЕЙЕР:
1. Определи поисковый интент и 5–15 реальных формулировок запросов.
2. Выбери основной запрос по релевантности теме и потенциалу ProektMap, а не по мнимой частотности.
3. Выбери ОДИН формат:
   - News: что произошло → что изменилось → кому важно;
   - Explainer: что такое X → как работает → кому пригодится → ограничения;
   - Practical: как использовать X → пошагово → пример → ошибки.
4. Построй оригинальную структуру под интент. Не копируй структуру источника.
5. Добавь собственное объяснение, контекст и практическую ценность, но не новые неподтверждённые факты.
6. Добавь 2–4 ссылки ТОЛЬКО из разрешённого списка, естественными анкорами. Не придумывай URL.
7. FAQ добавляй только если он реально отвечает на отдельные вопросы поиска; тогда 2–5 вопросов.
8. В конце HTML добавь: <p>Источник: <a href="${input.sourceUrl}" target="_blank" rel="noopener">${input.sourceTitle}</a></p>

ТРЕБОВАНИЯ:
- русский язык, понятный разработчикам, AI-инженерам и продактам;
- 550–1200 слов; первый абзац сразу отвечает, что это и зачем читать;
- минимум 3 содержательных <h2>, при необходимости <h3>, списки и таблицы;
- основной запрос естественно в H1/title, meta description и вступлении;
- без переспама, воды, маркетинговых штампов и риторических вопросов ради вовлечения;
- metaTitle 35–70 символов; metaDesc 120–170 символов;
- чистый безопасный HTML без Markdown, <h1>, <script>, <style> и inline-стилей.
${revision}
Верни ТОЛЬКО валидный JSON:
{
  "title": "H1 статьи без HTML",
  "metaTitle": "SEO Title",
  "metaDesc": "Meta Description",
  "contentType": "News|Explainer|Practical",
  "intent": "краткое описание интента",
  "primaryKeyword": "основной запрос",
  "secondaryKeywords": ["5–15 дополнительных запросов"],
  "html": "<p>...</p><h2>...</h2>...",
  "faq": [{"question": "...", "answer": "..."}]
}`;
}
