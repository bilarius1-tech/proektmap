import { getDb } from "@/lib/db";
import { blogCoverUrl, cardCoverUrl } from "@/lib/og/card-url";
import { MICROSERVICES, normalizeMediaUrl } from "@/lib/services/data";

export type HomeMediaKind = "blog" | "video" | "service";

export type HomeMediaTile = {
  kind: HomeMediaKind;
  title: string;
  href: string;
  image: string;
  kicker: string;
  meta?: string;
  featured?: boolean;
};

export type HomeMediaFeed = {
  tiles: HomeMediaTile[];
  blogCount: number;
  videoCount: number;
  serviceCount: number;
};

const BASE = "https://proektmap.ru";

function formatDuration(sec: number): string {
  if (!sec || sec < 1) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/**
 * Свежие публикации для медиа-стены главной:
 * блог + VK Video + микросервисы с обложками.
 */
export async function getHomeMediaFeed(): Promise<HomeMediaFeed> {
  const db = await getDb();

  const [posts, videos, metas] = await Promise.all([
    db.blogPost.findMany({
      where: { status: "published" },
      orderBy: { publishedAt: "desc" },
      take: 4,
      select: {
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        tags: true,
        publishedAt: true,
        category: { select: { name: true } },
      },
    }),
    db.vkVideo.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
      select: {
        id: true,
        title: true,
        thumbUrl: true,
        duration: true,
        channelSlug: true,
      },
    }),
    db.microserviceMeta.findMany(),
  ]);

  const metaMap = new Map(metas.map((m) => [m.slug, m]));

  const mergedServices = MICROSERVICES.filter((s) => s.status === "active").map((s) => {
    const meta = metaMap.get(s.slug);
    return {
      ...s,
      title: meta?.customTitle || s.title,
      coverImage: normalizeMediaUrl(meta?.coverImage || s.coverImage || ""),
      isFeatured: meta?.isFeatured ?? s.isFeatured ?? false,
      sortOrder: meta?.sortOrder ?? 999,
    };
  });

  mergedServices.sort((a, b) => {
    if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1;
    if (!!a.coverImage !== !!b.coverImage) return a.coverImage ? -1 : 1;
    return a.sortOrder - b.sortOrder;
  });

  const serviceTiles: HomeMediaTile[] = mergedServices.slice(0, 3).map((s) => ({
    kind: "service" as const,
    title: s.title,
    href: `/services/${s.slug}`,
    image:
      s.coverImage ||
      cardCoverUrl({
        title: s.title,
        summary: s.shortDescription,
        category: "Микросервис",
        seed: s.slug,
        baseUrl: BASE,
      }),
    kicker: "Микросервис",
    meta: s.badges[0],
  }));

  const blogTiles: HomeMediaTile[] = posts.map((p, i) => ({
    kind: "blog" as const,
    title: p.title,
    href: `/blog/${p.slug}`,
    image: blogCoverUrl({
      title: p.title,
      summary: p.excerpt,
      category: p.category?.name || "Блог",
      seed: p.slug,
      baseUrl: BASE,
      coverImage: p.coverImage,
    }),
    kicker: "Гайд",
    meta: p.category?.name || undefined,
    featured: i === 0,
  }));

  const videoTiles: HomeMediaTile[] = videos.map((v) => ({
    kind: "video" as const,
    title: v.title,
    href: "/video",
    image: v.thumbUrl || cardCoverUrl({ title: v.title, category: "Видео", seed: v.id, baseUrl: BASE }),
    kicker: "Видео",
    meta: formatDuration(v.duration) || v.channelSlug,
  }));

  // Мозаика: лид-блог → видео → сервисы → остальные блоги
  const tiles: HomeMediaTile[] = [];
  if (blogTiles[0]) tiles.push(blogTiles[0]);
  tiles.push(...videoTiles);
  tiles.push(...serviceTiles);
  tiles.push(...blogTiles.slice(1));

  return {
    tiles,
    blogCount: posts.length,
    videoCount: videos.length,
    serviceCount: serviceTiles.length,
  };
}
