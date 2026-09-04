/**
 * Дневная квота авто-публикации (drip из очереди queued → published).
 *
 * Лимит: env BLOG_AUTO_PUBLISH_DAILY_LIMIT (по умолчанию 2).
 * Считаются только AI-сгенерированные посты, опубликованные с начала суток МСК.
 */

export function getBlogAutoPublishDailyLimit(): number {
  const raw = process.env.BLOG_AUTO_PUBLISH_DAILY_LIMIT;
  const parsed = raw ? Number.parseInt(raw, 10) : 2;
  if (!Number.isFinite(parsed) || parsed < 1) return 2;
  return Math.min(parsed, 10);
}

/** Начало текущих суток по Europe/Moscow (UTC+3, без DST). */
export function mskDayStartUtc(now = new Date()): Date {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const day = fmt.format(now); // YYYY-MM-DD
  return new Date(`${day}T00:00:00+03:00`);
}

export async function countAiPublishedSince(db: any, since: Date): Promise<number> {
  return db.blogPost.count({
    where: {
      status: "published",
      aiGenerated: true,
      publishedAt: { gte: since },
    },
  });
}
