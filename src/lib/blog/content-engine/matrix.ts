/**
 * Инвентаризация блога + матрица спроса (общая логика phase0 и автопилота).
 */

import { CLUSTERS, DEMAND_MATRIX_SEED, clusterById } from "./clusters";
import {
  classifyPost,
  finalizeMergeSlugs,
  type RawPost,
} from "./classify-post";
import type {
  DemandMatrixRow,
  GapStatus,
  PostInventoryRow,
  Priority,
} from "./types";

export type Phase0Result = {
  inventory: PostInventoryRow[];
  demandMatrix: DemandMatrixRow[];
  summary: {
    generatedAt: string;
    publishedCount: number;
    byVerdict: Record<string, number>;
    byCluster: Record<string, number>;
    byPriority: Record<string, number>;
    demandGaps: { missing: number; weak: number; covered: number };
    productFocus: { core: string; satellite: string };
  };
};

function normalize(text: string): string {
  return text
    .toLocaleLowerCase("ru")
    .replace(/ё/g, "е")
    .replace(/[^a-zа-я0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOP = new Set([
  "как", "что", "это", "для", "или", "без", "при", "про", "из", "на", "по", "со", "от",
  "the", "and", "for", "with", "from", "into", "vs", "versus", "чем", "есть", "может",
  "можно", "нужно", "свой", "свои", "через", "после", "перед", "также", "более",
]);

function queryTokens(query: string): string[] {
  return normalize(query)
    .split(" ")
    .filter((t) => t.length >= 3 && !STOP.has(t));
}

export function scorePostForQuery(post: PostInventoryRow, query: string, cluster: string): number {
  const hay = normalize(`${post.title} ${post.primaryKeyword || ""} ${post.intent || ""}`);
  const qTokens = queryTokens(query);
  if (qTokens.length === 0) return -10;

  let tokenHits = 0;
  for (const t of qTokens) {
    if (hay.includes(t)) tokenHits += 1;
  }
  if (tokenHits === 0) return -10;

  let score = tokenHits * 4;
  if (post.cluster === cluster) score += 4;
  if (post.verdict === "keep" || post.verdict === "evergreen" || post.verdict === "expand") score += 2;
  if (post.verdict === "stop" || post.verdict === "leave-as-news") score -= 3;
  score += Math.min(6, Math.floor(post.viewCount / 12));
  score += Math.min(4, Math.floor(post.wordCount / 250));
  if (post.hasProductLink) score += 2;
  if (post.pageTypeGuess === "guide" || post.pageTypeGuess === "entity" || post.pageTypeGuess === "comparison") {
    score += 3;
  }
  if (post.pageTypeGuess === "news") score -= 2;
  const coverage = tokenHits / Math.max(1, qTokens.length);
  score += Math.round(coverage * 8);
  if (qTokens.length >= 3 && coverage < 0.4) score -= 8;
  return score;
}

function isSearchAsset(post: PostInventoryRow): boolean {
  if (post.verdict !== "keep" || !post.hasProductLink || post.pageTypeGuess === "news") return false;
  if (post.wordCount < 120) return false;
  if (/content-asset|поисковый актив/i.test(post.reason)) return true;
  return !post.aiGenerated;
}

export function gapFor(score: number, post: PostInventoryRow | null, hasProductPage: boolean): GapStatus {
  if (!post || score < 12) {
    return hasProductPage ? "weak" : "missing";
  }
  if (isSearchAsset(post) && score >= 12) return "covered";

  if (
    post.wordCount < 500 ||
    !post.hasProductLink ||
    post.pageTypeGuess === "news" ||
    post.verdict === "evergreen" ||
    post.verdict === "expand" ||
    post.verdict === "product-link" ||
    post.verdict === "merge" ||
    post.verdict === "leave-as-news" ||
    score < 18
  ) {
    return "weak";
  }
  if (post.verdict === "keep" && post.wordCount >= 500 && post.hasProductLink) return "covered";
  return "weak";
}

export async function buildInventory(db: any): Promise<PostInventoryRow[]> {
  const posts = await db.blogPost.findMany({
    where: { status: "published" },
    select: {
      id: true,
      slug: true,
      title: true,
      content: true,
      tags: true,
      aiGenerated: true,
      viewCount: true,
      publishedAt: true,
      category: { select: { name: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  const raw: RawPost[] = posts.map((p: any) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    content: p.content,
    tags: p.tags || "",
    aiGenerated: p.aiGenerated,
    viewCount: p.viewCount,
    publishedAt: p.publishedAt,
    categoryName: p.category?.name || "",
  }));

  const classified = raw.map((post) => classifyPost(post, raw));
  return finalizeMergeSlugs(classified);
}

export function buildDemandMatrix(inventory: PostInventoryRow[]): DemandMatrixRow[] {
  return DEMAND_MATRIX_SEED.map((seed) => {
    let best: PostInventoryRow | null = null;
    let bestScore = -999;
    for (const post of inventory) {
      const score = scorePostForQuery(post, seed.query, seed.cluster);
      if (score > bestScore) {
        bestScore = score;
        best = post;
      }
    }
    const hasProductPage = Boolean(seed.productCta);
    const blogOk = best && bestScore >= 12;
    const gap = gapFor(bestScore, blogOk ? best : null, hasProductPage);

    if (!blogOk && hasProductPage) {
      return {
        ...seed,
        existingUrl: `https://proektmap.ru${seed.productCta}`,
        existingTitle: `Продукт: ${seed.productCta}`,
        gap: "weak" as GapStatus,
        notes: seed.notes
          ? `${seed.notes} | Поискового blog-актива нет — есть продукт`
          : "Поискового blog-актива нет — есть продукт",
      };
    }

    return {
      ...seed,
      existingUrl: blogOk ? best!.url : null,
      existingTitle: blogOk ? best!.title : null,
      gap,
    };
  });
}

export async function runPhase0Analysis(db: any): Promise<Phase0Result> {
  const inventory = await buildInventory(db);
  const demandMatrix = buildDemandMatrix(inventory);

  const byVerdict: Record<string, number> = {};
  const byCluster: Record<string, number> = {};
  const byPriority: Record<string, number> = {};
  for (const row of inventory) {
    byVerdict[row.verdict] = (byVerdict[row.verdict] || 0) + 1;
    byCluster[row.cluster] = (byCluster[row.cluster] || 0) + 1;
    byPriority[row.priority] = (byPriority[row.priority] || 0) + 1;
  }

  return {
    inventory,
    demandMatrix,
    summary: {
      generatedAt: new Date().toISOString(),
      publishedCount: inventory.length,
      byVerdict,
      byCluster,
      byPriority,
      demandGaps: {
        missing: demandMatrix.filter((r) => r.gap === "missing").length,
        weak: demandMatrix.filter((r) => r.gap === "weak").length,
        covered: demandMatrix.filter((r) => r.gap === "covered").length,
      },
      productFocus: {
        core: "AI vibe-coding in Russia + educational materials",
        satellite: "Avito/marketplaces = clicks only, not asset production queue",
      },
    },
  };
}

const PRIORITY_ORDER: Record<Priority, number> = { P0: 0, P1: 1, P2: 2, P3: 3 };

/**
 * Следующая тема для автопилота: core-кластер, P0→P1, gap weak|missing,
 * ещё нет content-asset с этим demandId в контенте.
 */
export function pickNextAutopilotTopic(
  demandMatrix: DemandMatrixRow[],
  inventory: PostInventoryRow[],
  dbContentsWithDemandIds: string[],
): DemandMatrixRow | null {
  const coveredDemandIds = new Set(dbContentsWithDemandIds);
  const candidates = demandMatrix
    .filter((row) => {
      const role = clusterById(row.cluster).role;
      if (role !== "core") return false;
      if (row.priority === "P2" || row.priority === "P3") return false;
      if (row.gap !== "weak" && row.gap !== "missing") return false;
      if (coveredDemandIds.has(row.id)) return false;
      return true;
    })
    .sort((a, b) => {
      const pd = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      if (pd !== 0) return pd;
      if (a.gap === "missing" && b.gap !== "missing") return -1;
      if (b.gap === "missing" && a.gap !== "missing") return 1;
      return a.query.localeCompare(b.query, "ru");
    });

  return candidates[0] || null;
}

/** Достаёт demandId из HTML постов с маркером content-asset. */
export function extractDemandIdsFromInventory(inventory: PostInventoryRow[], contents: { id: string; content: string }[]): string[] {
  const byId = new Map(contents.map((c) => [c.id, c.content]));
  const ids: string[] = [];
  for (const post of inventory) {
    const html = byId.get(post.id) || "";
    const m = html.match(/content-asset:([a-z0-9-]+)/i);
    if (m) ids.push(m[1]);
  }
  return ids;
}
