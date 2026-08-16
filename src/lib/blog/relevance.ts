export type EditorialRubric =
  | "Авито"
  | "Ozon"
  | "Wildberries"
  | "Маркетплейсы"
  | "Автоматизация продаж"
  | "AI для бизнеса";

export type RelevanceVerdict =
  | { ok: true; rubric: EditorialRubric; angle: string }
  | { ok: false; reason: string };

const DROP = /simulated\s*cell|биологическ|cyberpunk|pop\s*mart|arxiv|вентиляц|игровой|playstation|\bxbox\b|\bsteam\b/i;
const AI = /(^|[^а-я])(ai|ии)([^а-я]|$)|нейросет|gpt|llm|chatgpt|deepseek|агент|автоматиз|бот|промпт|yandexgpt|gigachat|copilot|генератив/i;
const AVITO = /авито|avito/i;
const OZON = /(^|[^a-z])ozon([^a-z]|$)|озон/i;
const WILDBERRIES = /wildberries|вайлдберр|вальдберр|(^|[^a-z])wb([^a-z]|$)/i;
const GLOBAL_MARKETPLACE = /amazon|shopify|aliexpress|alibaba|ebay|etsy/i;
const MARKETPLACE = /маркетплейс|marketplace|e-?commerce|электронн\w*\s+торгов/i;
const SELLER_VALUE = /продав|селлер|магазин|товар|карточк|объявлен|фото|описан|контент|ретуш|ценообраз|цен[аы]|остат|склад|логист|достав|возврат|комисси|тариф|правил|ранжир|выдач|реклам|продвиж|аналитик|конверс|заказ|отзыв|рейтинг|клиент|покупател|спрос|маржин|прибыл/i;
const SALES_SYSTEM = /продаж|заявк|лид|crm|воронк|колл-?центр|поддержк|чат|мессенджер|telegram|телеграм|оплат|платеж|юkassa|юкасса|касс|эквайр|чек|брошенн\w*\s+корзин|повторн\w*\s+продаж/i;
const AUTOMATION = /автоматиз|интеграц|api|webhook|парсинг|бот|агент|нейросет|(^|[^а-я])(ai|ии)([^а-я]|$)|генерац|скрипт|no-?code|rpa/i;
const PLATFORM_CHANGE = /комисси|тариф|правил|оферт|api|алгоритм|ранжир|реклам|продвиж|логист|достав|возврат|маркиров|налог|штраф|блокиров|антибан/i;

function haystack(title: string, description: string, category: string): string {
  return `${title} ${description} ${category}`.toLocaleLowerCase("ru").replace(/ё/g, "е");
}

/**
 * Seller-first фильтр: материал проходит, только если даёт продавцу
 * применимый шаг — улучшить карточку, продажи, операции или экономику.
 * Мировые кейсы допускаются, если их можно адаптировать для продавца в РФ.
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

  return { ok: false, reason: "no-commercial-value" };
}

export const DEFAULT_SEO_KEYWORDS = [
  "автоматизация продаж",
  "AI для продавцов",
  "AI для бизнеса",
  "Авито для продавцов",
  "Авито автоматизация",
  "нейросеть для объявлений",
  "Ozon для продавцов",
  "автоматизация Ozon",
  "Wildberries для продавцов",
  "автоматизация Wildberries",
  "карточка товара маркетплейс",
  "аналитика маркетплейсов",
  "автоматизация маркетплейсов",
  "CRM для продаж",
  "Telegram бот для заявок",
  "ЮKassa",
  "e-commerce автоматизация",
];
