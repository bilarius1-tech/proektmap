export type PublishReportItem = {
  title: string;
};

export type PublishReportStats = {
  queued: number;
  timeouts?: number;
  jsonErrors?: number;
  seoRejected?: number;
  hour?: number;
};

/**
 * Короткий служебный отчёт админу.
 * Без Prisma, без сырых stack trace и без списка лент.
 */
export function buildPublishReport(queued: PublishReportItem[], stats?: PublishReportStats): string {
  const queuedCount = stats?.queued ?? queued.length;
  const lines = [
    "Авто-сбор " + (stats?.hour != null ? `${String(stats.hour).padStart(2, "0")}:00 МСК` : "завершён"),
    `В очередь: ${queuedCount}`,
  ];
  if ((stats?.timeouts || 0) > 0) lines.push(`AI не успел: ${stats!.timeouts}`);
  if ((stats?.jsonErrors || 0) > 0) lines.push(`AI без JSON: ${stats!.jsonErrors}`);
  if ((stats?.seoRejected || 0) > 0) lines.push(`Не прошло SEO: ${stats!.seoRejected}`);
  if (queued.length > 0) {
    lines.push("");
    for (const item of queued.slice(0, 8)) lines.push("• " + item.title);
  }
  return lines.join("\n");
}

export function isTransientFeedFailure(reason: string): boolean {
  const text = (reason || "").toLowerCase();
  return (
    text.includes("timeout") ||
    text.includes("aborted") ||
    text.includes("abort") ||
    text.includes("econnreset") ||
    text.includes("fetch failed")
  );
}

export function isAiTimeout(reason: string): boolean {
  const text = (reason || "").toLowerCase();
  return text.includes("timeout") || text.includes("aborted") || text.includes("abort");
}

export function isAiJsonError(reason: string): boolean {
  const text = (reason || "").toLowerCase();
  return text.includes("json") || text.includes("неполную seo");
}
