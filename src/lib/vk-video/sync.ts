import { VK_VIDEO_CHANNELS, type VkVideoChannel } from "./channels";

const VK_API = "https://api.vk.com/method";
const API_VERSION = "5.199";

export type SyncedVkVideo = {
  id: string;
  ownerId: number;
  videoId: number;
  channelSlug: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  publishedAt: Date;
  thumbUrl: string;
  playerUrl: string;
  vkUrl: string;
};

type VkApiError = { error_code: number; error_msg: string };

function getToken(): string {
  return (process.env.VK_SERVICE_TOKEN || process.env.VK_ACCESS_TOKEN || "").trim();
}

export function hasVkToken(): boolean {
  return Boolean(getToken());
}

async function vkCall<T>(method: string, params: Record<string, string | number>): Promise<T> {
  const token = getToken();
  if (!token) {
    throw new Error("VK_SERVICE_TOKEN не задан. См. docs/VK-VIDEO.md");
  }
  const qs = new URLSearchParams({
    access_token: token,
    v: API_VERSION,
  });
  for (const [k, v] of Object.entries(params)) qs.set(k, String(v));

  const res = await fetch(`${VK_API}/${method}?${qs.toString()}`, {
    signal: AbortSignal.timeout(25000),
  });
  if (!res.ok) throw new Error(`VK HTTP ${res.status} на ${method}`);
  const json = (await res.json()) as { response?: T; error?: VkApiError };
  if (json.error) {
    throw new Error(`VK ${method}: [${json.error.error_code}] ${json.error.error_msg}`);
  }
  if (json.response === undefined) throw new Error(`VK ${method}: пустой ответ`);
  return json.response;
}

async function resolveOwnerId(channel: VkVideoChannel): Promise<number> {
  if (channel.communityId && channel.communityId > 0) {
    return -Math.abs(channel.communityId);
  }
  if (!channel.screenName) {
    throw new Error(`Канал ${channel.slug}: нет communityId и screenName`);
  }

  // Сервисный ключ часто не умеет utils.resolveScreenName — берём groups.getById
  try {
    const byId = await vkCall<any>("groups.getById", { group_id: channel.screenName });
    const group = Array.isArray(byId) ? byId[0] : byId?.groups?.[0] || byId?.[0] || byId;
    if (group?.id) return -Math.abs(group.id);
  } catch {
    // fallback ниже
  }

  const resolved = await vkCall<{ type: string; object_id: number } | { type: string; object_id: number }[]>(
    "utils.resolveScreenName",
    { screen_name: channel.screenName }
  );
  const row = Array.isArray(resolved) ? resolved[0] : resolved;
  if (!row || !row.object_id) {
    throw new Error(`Не удалось резолвить @${channel.screenName}`);
  }
  if (row.type === "user") return row.object_id;
  return -Math.abs(row.object_id);
}

type VkVideoItem = {
  id: number;
  owner_id: number;
  title?: string;
  description?: string;
  duration?: number;
  date?: number;
  views?: number;
  player?: string;
  image?: { url: string; width: number; height: number }[];
  first_frame?: { url: string; width: number; height: number }[];
};

function pickThumb(item: VkVideoItem): string {
  const frames = [...(item.image || []), ...(item.first_frame || [])];
  if (!frames.length) return "";
  const sorted = [...frames].sort((a, b) => b.width * b.height - a.width * a.height);
  return sorted[0]?.url || "";
}

function mapItem(item: VkVideoItem, channelSlug: string): SyncedVkVideo | null {
  if (!item?.id || !item.owner_id) return null;
  const ownerId = item.owner_id;
  const videoId = item.id;
  const playerUrl =
    item.player ||
    `https://vk.com/video_ext.php?oid=${ownerId}&id=${videoId}&hd=2`;
  return {
    id: `${ownerId}_${videoId}`,
    ownerId,
    videoId,
    channelSlug,
    title: (item.title || "Без названия").trim().slice(0, 300),
    description: (item.description || "").trim().slice(0, 4000),
    duration: item.duration || 0,
    views: item.views || 0,
    publishedAt: new Date((item.date || 0) * 1000),
    thumbUrl: pickThumb(item),
    playerUrl,
    vkUrl: `https://vk.com/video${ownerId}_${videoId}`,
  };
}

async function fetchChannelVideos(channel: VkVideoChannel, maxItems = 60): Promise<SyncedVkVideo[]> {
  const ownerId = await resolveOwnerId(channel);
  const out: SyncedVkVideo[] = [];
  let offset = 0;
  const pageSize = 50;

  while (out.length < maxItems) {
    const page = await vkCall<{ count: number; items: VkVideoItem[] }>("video.get", {
      owner_id: ownerId,
      count: pageSize,
      offset,
      extended: 0,
    });
    const items = page.items || [];
    if (!items.length) break;
    for (const item of items) {
      const mapped = mapItem(item, channel.slug);
      if (mapped) out.push(mapped);
      if (out.length >= maxItems) break;
    }
    offset += items.length;
    // VK иногда отдаёт < count за запрос — не останавливаемся на этом
    if (offset >= (page.count || 0)) break;
    await new Promise((r) => setTimeout(r, 350));
  }

  return out;
}

export type SyncVkVideoResult = {
  ok: boolean;
  channels: { slug: string; fetched: number; upserted: number; error?: string }[];
  totalUpserted: number;
  hasToken: boolean;
};

/** Синхронизирует каналы в таблицу vk_videos (upsert). */
export async function syncVkVideosToDb(db: any, opts?: { maxPerChannel?: number }): Promise<SyncVkVideoResult> {
  const maxPerChannel = opts?.maxPerChannel ?? 60;
  const result: SyncVkVideoResult = {
    ok: true,
    channels: [],
    totalUpserted: 0,
    hasToken: hasVkToken(),
  };

  if (!result.hasToken) {
    result.ok = false;
    return result;
  }

  const now = new Date();

  for (const channel of VK_VIDEO_CHANNELS) {
    try {
      const videos = await fetchChannelVideos(channel, maxPerChannel);
      let upserted = 0;
      for (const v of videos) {
        await db.vkVideo.upsert({
          where: { id: v.id },
          create: {
            id: v.id,
            ownerId: v.ownerId,
            videoId: v.videoId,
            channelSlug: v.channelSlug,
            title: v.title,
            description: v.description,
            duration: v.duration,
            views: v.views,
            publishedAt: v.publishedAt,
            thumbUrl: v.thumbUrl,
            playerUrl: v.playerUrl,
            vkUrl: v.vkUrl,
            isPublished: true,
            syncedAt: now,
          },
          update: {
            title: v.title,
            description: v.description,
            duration: v.duration,
            views: v.views,
            publishedAt: v.publishedAt,
            thumbUrl: v.thumbUrl,
            playerUrl: v.playerUrl,
            vkUrl: v.vkUrl,
            channelSlug: v.channelSlug,
            syncedAt: now,
          },
        });
        upserted += 1;
      }
      result.channels.push({ slug: channel.slug, fetched: videos.length, upserted });
      result.totalUpserted += upserted;
    } catch (e: any) {
      result.ok = false;
      result.channels.push({
        slug: channel.slug,
        fetched: 0,
        upserted: 0,
        error: e?.message || String(e),
      });
    }
  }

  return result;
}

export function formatDuration(sec: number): string {
  if (!sec || sec < 0) return "";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const mm = m % 60;
    return `${h}:${String(mm).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}`;
}
