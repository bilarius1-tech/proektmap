export type PublishReportItem = {
  title: string;
};

/**
 * Служебный отчёт админу. Без «Ошибок источников», без Prisma, без timeout.
 * Таймауты лент — норма, их пишем только в лог сервера.
 */
export function buildPublishReport(queued: PublishReportItem[]): string | null {
  if (queued.length === 0) return null;

  const lines = [
    "Авто-сбор: статьи в очереди — " + queued.length,
    "",
  ];
  for (const item of queued.slice(0, 8)) {
    lines.push("• " + item.title);
  }
  return lines.join("\n");
}

export function isTransientFeedFailure(reason: string): boolean {
  const text = (reason || "").toLowerCase();
  return (
    text.includes("timeout") ||
    text.includes("aborted") ||
    text.includes("abort") ||
    text.includes("ai не вернул json") ||
    text.includes("econnreset") ||
    text.includes("fetch failed")
  );
}
