/**
 * Фаза 0: пишет артефакты в data/content-engine/ через общую lib.
 *   npm run content:phase0
 */

import fs from "node:fs";
import path from "node:path";
import { getDb } from "../../src/lib/db/index";
import { CLUSTERS } from "../../src/lib/blog/content-engine/clusters";
import { runPhase0Analysis } from "../../src/lib/blog/content-engine/matrix";

const OUT_DIR = path.join(process.cwd(), "data/content-engine");

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function csvEscape(value: unknown): string {
  const s = value == null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => csvEscape(row[h])).join(","));
  }
  return lines.join("\n");
}

async function main() {
  ensureDir(OUT_DIR);
  const db = await getDb();
  const { inventory, demandMatrix, summary } = await runPhase0Analysis(db);

  const fullSummary = {
    ...summary,
    topActions: {
      stop: inventory.filter((r) => r.verdict === "stop").slice(0, 15),
      merge: inventory.filter((r) => r.verdict === "merge").slice(0, 15),
      evergreen: inventory
        .filter((r) => r.verdict === "evergreen")
        .sort((a, b) => (a.priority < b.priority ? -1 : 1))
        .slice(0, 20),
      expand: inventory.filter((r) => r.verdict === "expand").slice(0, 15),
      productLink: inventory.filter((r) => r.verdict === "product-link").slice(0, 15),
    },
    p0Demand: demandMatrix.filter((r) => r.priority === "P0"),
    clusters: CLUSTERS.map((c) => ({
      id: c.id,
      title: c.title,
      role: c.role,
      productUrls: c.productUrls,
      posts: summary.byCluster[c.id] || 0,
    })),
    pipeline: {
      from: "news → article → publish",
      to: "demand → intent → search task → ProektMap value → page → links → CTA → measure",
      rssRole: "signal only",
      geo: "quality SEO with unique value; no magic GEO layer",
    },
  };

  const inventoryCsv = inventory.map((r) => ({
    slug: r.slug,
    title: r.title,
    verdict: r.verdict,
    priority: r.priority,
    cluster: r.cluster,
    pageTypeGuess: r.pageTypeGuess,
    viewCount: r.viewCount,
    wordCount: r.wordCount,
    aiGenerated: r.aiGenerated,
    hasProductLink: r.hasProductLink,
    mergeIntoSlug: r.mergeIntoSlug || "",
    productUrls: r.productUrls.join(" "),
    reason: r.reason,
    nextAction: r.nextAction,
    url: r.url,
  }));

  const demandCsv = demandMatrix.map((r) => ({
    id: r.id,
    query: r.query,
    intent: r.intent,
    pageType: r.pageType,
    cluster: r.cluster,
    existingUrl: r.existingUrl || "",
    existingTitle: r.existingTitle || "",
    gap: r.gap,
    priority: r.priority,
    productCta: r.productCta,
    uniqueValueHint: r.uniqueValueHint,
    notes: r.notes,
  }));

  fs.writeFileSync(path.join(OUT_DIR, "post-inventory.json"), JSON.stringify(inventory, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "post-inventory.csv"), toCsv(inventoryCsv));
  fs.writeFileSync(path.join(OUT_DIR, "demand-matrix.json"), JSON.stringify(demandMatrix, null, 2));
  fs.writeFileSync(path.join(OUT_DIR, "demand-matrix.csv"), toCsv(demandCsv));
  fs.writeFileSync(path.join(OUT_DIR, "phase-0-summary.json"), JSON.stringify(fullSummary, null, 2));

  console.log(
    JSON.stringify(
      {
        ok: true,
        out: OUT_DIR,
        published: inventory.length,
        byVerdict: summary.byVerdict,
        demandGaps: summary.demandGaps,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
