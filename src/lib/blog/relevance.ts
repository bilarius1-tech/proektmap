export type EditorialRubric =
  | "AI-инжиниринг"
  | "Авито"
  | "Ozon"
  | "Wildberries"
  | "Маркетплейсы"
  | "Автоматизация продаж"
  | "AI для бизнеса";

export type RelevanceVerdict =
  | { ok: true; rubric: EditorialRubric; angle: string }
  | { ok: false; reason: string };

const DROP = /simulated\s*cell|биологическ|cyberpunk|pop\s*mart|arxiv|вентиляц|игровой|playstation|\bxbox\b|\bsteam\b|iphone|samsung\s*galaxy|криптовалют|nft\b/i;
const AI = /(^|[^а-я])(ai|ии)([^а-я]|$)|нейросет|gpt|llm|chatgpt|deepseek|агент|автоматиз|бот|промпт|yandexgpt|gigachat|copilot|генератив/i;
const AI_ENGINEERING = /cursor|claude|composer|mcp|openrouter|deepseek|агентн|ai[\s-]?agent|llm|промпт|prompt|skill|вайб|vibe\s*cod|инженер|без\s*vpn|speechkit|yandexgpt|gigachat|модел\w*\s+(ai|ии|llm)|нейросет|copilot|anthropic|openai|локальн\w*\s+модел/i;
const AVITO = /авито|avito/i;
const OZON = /(^|[^a-z])ozon([^a-z]|$)|озон/i;
const WILDBERRIES = /wildberries|вайлдберр|вальдберр|(^|[^a-z])wb([^a-z]|$)/i;
const GLOBAL_MARKETPLACE = /amazon|shopify|aliexpress|alibaba|ebay|etsy/i;
const MARKETPLACE = /маркетплейс|marketplace|e-?commerce|электронн\w*\s+торгов/i;
const SELLER_VALUE = /продав|селлер|магазин|товар|карточк|объявлен|фото|описан|контент|ретуш|ценообраз|цен[аы]|остат|склад|логист|достав|возврат|комисси|тариф|правил|ранжир|выдач|реклам|продвиж|аналитик|конверс|заказ|отзыв|рейтинг|клиент|покупател|спрос|маржин|прибыл/i;
const SALES_SYSTEM = /продаж|заявк|лид|crm|воронк|колл-?центр|поддержк|чат|мессенджер|telegram|телеграм|оплат|платеж|юkassa|юкасса|касс|эквайр|чек|брошенн\w*\s+корзин|повторн\w*\s+продаж/i;
const AUTOMATION = /автоматиз|интеграц|api|webhook|парсинг|бот|агент|нейросет|(^|[^а-я])(ai|ии)([^а-я]|$)|генерац|скрипт|no-?code|rpa/i;
const PLATFORM_CHANGE = /комисси|тариф|правил|оферт|api|алгоритм|ранжир|реклам|продвиж|логист|достав|возврат|маркиров|налог|штраф|блокиров|антибан/i;
/** Растяжка «для продавцов» на темы без коммерческого контекста — отклоняем. */
const SELLER_STRETCH = /для\s+продавц|что\s+делать\s+селлер|продавц\w*\s+на\s+авито\s+из\s+новост/i;

function haystack(title: string, description: string, category: string): string {
  return `${title} ${description} ${category}`.toLocaleLowerCase("ru").replace(/ё/g, "е");
}

/**
 * AI-engineering first: материал проходит, если даёт практику AI-инженеру,
 * либо реальное действие продавцу на площадке — без натянутых «для селлеров».
 */
export function judgeRelevance(title: string, description = "", category = ""): RelevanceVerdict {
  const text = haystack(title, description, category);

  if (DROP.test(text)) {
    return { ok: false, reason: "off-topic" };
  }

  const hasSellerValue = SELLER_VALUE.test(text);
  const hasSalesSystem = SALES_SYSTEM.test(text);
  const hasAutomation = AUTOMATION.test(text);
  const hasPlatformChange = PLATFORM_CHANGE.test(text);
  const actionable = hasSellerValue && (hasAutomation || hasPlatformChange || hasSalesSystem);
  const isAiEngineering = AI_ENGINEERING.test(text) || (AI.test(text) && /практик|инструмент|агент|модель|cursor|промпт|mcp|skill|разработ/i.test(text));

  // Приоритет: AI-инжиниринг без натянутого seller-угла
  if (isAiEngineering && !SELLER_STRETCH.test(text)) {
    // Чистый AI/агенты/Cursor — ок даже без «продавца»
    if (!hasSellerValue || AI_ENGINEERING.test(text)) {
      return {
        ok: true,
        rubric: "AI-инжиниринг",
        angle: "что изменилось для AI-инженера и какой следующий шаг на практике",
      };
    }
  }

  if (AVITO.test(text)) {
    return actionable
      ? { ok: true, rubric: "Авито", angle: "практическая польза для авитолога и продавца" }
      : { ok: false, reason: "avito-without-seller-action" };
  }

  if (OZON.test(text)) {
    return actionable
      ? { ok: true, rubric: "Ozon", angle: "практическая польза для продавца на Ozon" }
      : { ok: false, reason: "ozon-without-seller-action" };
  }

  if (WILDBERRIES.test(text)) {
    return actionable
      ? { ok: true, rubric: "Wildberries", angle: "практическая польза для продавца на Wildberries" }
      : { ok: false, reason: "wildberries-without-seller-action" };
  }

  if (GLOBAL_MARKETPLACE.test(text) || MARKETPLACE.test(text)) {
    return actionable
      ? { ok: true, rubric: "Маркетплейсы", angle: "мировой приём с адаптацией для торговли в России" }
      : { ok: false, reason: "marketplace-without-seller-action" };
  }

  if (hasSalesSystem && hasAutomation) {
    return { ok: true, rubric: "Автоматизация продаж", angle: "измеримый следующий шаг в воронке продаж" };
  }

  if (AI.test(text) && (hasSellerValue || hasSalesSystem)) {
    return { ok: true, rubric: "AI для бизнеса", angle: "применение AI для выручки или снижения рутины" };
  }

  // Запрет: новость без AI/практики, но с попыткой «притянуть продавца»
  if (SELLER_STRETCH.test(text) && !actionable) {
    return { ok: false, reason: "seller-stretch" };
  }

  return { ok: false, reason: "no-ai-or-commercial-value" };
}

export const DEFAULT_SEO_KEYWORDS = [
  "AI-инжиниринг",
  "AI агенты",
  "Cursor",
  "промпт-инжиниринг",
  "MCP",
  "вайбкодинг",
  "DeepSeek",
  "AI без VPN",
  "готовые решения AI",
  "микросервисы ProektMap",
  "Авито автоматизация",
  "нейросеть для объявлений",
  "Telegram бот",
  "CRM для продаж",
  "ЮKassa",
];
