/**
 * Контент-цех V2 — типы Фазы 0 (инвентаризация + матрица спроса).
 * Не путать с SEO Score auto-publish: здесь вердикт по активу, не по разметке.
 */

export type PostVerdict =
  | "keep"
  | "merge"
  | "expand"
  | "evergreen"
  | "product-link"
  | "leave-as-news"
  | "stop";

export type PageType =
  | "news"
  | "guide"
  | "entity"
  | "comparison"
  | "faq"
  | "case"
  | "commercial"
  | "explainer";

export type SearchIntent =
  | "informational"
  | "commercial"
  | "transactional"
  | "navigational"
  | "how-to"
  | "comparison";

export type GapStatus = "covered" | "weak" | "missing";

export type Priority = "P0" | "P1" | "P2" | "P3";

export type ContentClusterId =
  | "ai-agents"
  | "cursor-vibe"
  | "telegram-bot"
  | "saas-product"
  | "avito-ai"
  | "ai-russia"
  | "prompts-skills"
  | "mcp-tools"
  | "ui-design"
  | "microservices"
  | "marketplace"
  | "llm-models"
  | "resheniya-hub"
  | "noise";

export type PostInventoryRow = {
  id: string;
  slug: string;
  url: string;
  title: string;
  category: string;
  aiGenerated: boolean;
  viewCount: number;
  wordCount: number;
  publishedAt: string | null;
  contentType: string | null;
  intent: string | null;
  primaryKeyword: string | null;
  cluster: ContentClusterId;
  pageTypeGuess: PageType;
  hasProductLink: boolean;
  productUrls: string[];
  hasFaq: boolean;
  verdict: PostVerdict;
  mergeIntoSlug: string | null;
  priority: Priority;
  reason: string;
  nextAction: string;
};

export type DemandMatrixRow = {
  id: string;
  query: string;
  intent: SearchIntent;
  pageType: PageType;
  cluster: ContentClusterId;
  existingUrl: string | null;
  existingTitle: string | null;
  gap: GapStatus;
  priority: Priority;
  productCta: string;
  uniqueValueHint: string;
  notes: string;
};
