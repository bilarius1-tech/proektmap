import { COMMUNITY_PATH } from "./config";

export type CommunityDiscussion = {
  id: string;
  title: string;
  href: string;
  replies: number;
  lastPostedAt: string;
  lastAuthor: string | null;
  tag: { name: string; color: string | null; href: string } | null;
};

type JsonApiResource = {
  type: string;
  id: string;
  attributes?: Record<string, unknown>;
  relationships?: Record<string, { data?: { type: string; id: string } | { type: string; id: string }[] | null }>;
};

const CACHE_TTL_MS = 5 * 60 * 1000;
const FETCH_TIMEOUT_MS = 2500;

let cache: { at: number; items: CommunityDiscussion[] } | null = null;

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** Разбор ответа Flarum `/api/discussions?include=lastPostedUser,tags`. */
export function parseDiscussions(payload: unknown): CommunityDiscussion[] {
  const doc = payload as { data?: JsonApiResource[]; included?: JsonApiResource[] };
  if (!Array.isArray(doc?.data)) return [];

  const included = new Map((doc.included || []).map((r) => [`${r.type}:${r.id}`, r]));
  const rel = (r: JsonApiResource, name: string) => {
    const data = r.relationships?.[name]?.data;
    const list = Array.isArray(data) ? data : data ? [data] : [];
    return list.map((d) => included.get(`${d.type}:${d.id}`)).filter(Boolean) as JsonApiResource[];
  };

  return doc.data
    .filter((d) => d.type === "discussions" && str(d.attributes?.slug))
    .map((d) => {
      const a = d.attributes || {};
      const author = rel(d, "lastPostedUser")[0];
      const tags = rel(d, "tags");
      const tag = tags.find((t) => t.attributes?.isPrimary) || tags[0];
      return {
        id: d.id,
        title: str(a.title),
        href: `${COMMUNITY_PATH}/d/${str(a.slug)}`,
        replies: Math.max(0, Number(a.commentCount || 0) - 1),
        lastPostedAt: str(a.lastPostedAt) || str(a.createdAt),
        lastAuthor: author ? str(author.attributes?.displayName) || null : null,
        tag: tag
          ? {
              name: str(tag.attributes?.name),
              color: str(tag.attributes?.color) || null,
              href: `${COMMUNITY_PATH}/t/${str(tag.attributes?.slug)}`,
            }
          : null,
      };
    });
}

/** Последние темы форума, видимые гостю. null — форум недоступен (блок не показываем). */
export async function getLatestCommunityDiscussions(limit = 5): Promise<CommunityDiscussion[] | null> {
  if (cache && Date.now() - cache.at < CACHE_TTL_MS) return cache.items.slice(0, limit);

  const base = process.env.COMMUNITY_API_BASE || "https://proektmap.ru/community/api";
  const url = `${base}/discussions?sort=-lastPostedAt&page%5Blimit%5D=10&include=lastPostedUser,tags`;
  try {
    const res = await fetch(url, {
      cache: "no-store",
      headers: { Accept: "application/vnd.api+json" },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) return cache ? cache.items.slice(0, limit) : null;
    const items = parseDiscussions(await res.json());
    cache = { at: Date.now(), items };
    return items.slice(0, limit);
  } catch {
    return cache ? cache.items.slice(0, limit) : null;
  }
}

export function timeAgoRu(iso: string, now = Date.now()): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const min = Math.floor(diff / 60000);
  const plural = (n: number, one: string, few: string, many: string) => {
    const m10 = n % 10;
    const m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
    return many;
  };
  if (min < 1) return "только что";
  if (min < 60) return `${min} ${plural(min, "минуту", "минуты", "минут")} назад`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} ${plural(h, "час", "часа", "часов")} назад`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ${plural(d, "день", "дня", "дней")} назад`;
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
}
