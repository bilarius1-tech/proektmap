import { buildSvg } from "./svg";

// ── Расширяемая архитектура ImageProvider ──────────────────────────────
// Позже сюда добавляются KandinskyProvider / FluxProvider без переделки блога:
// реализуешь интерфейс и добавишь в список resolveCover().

export interface CoverRequest {
  title: string;
  category?: string;
  tags?: string[];
  author?: string;
  seed?: string;
  thumbnailUrl?: string; // RSS thumbnail — второй источник
}

export interface CoverResult {
  url: string; // итоговый URL обложки
  provider: string; // какой провайдер сработал
}

export interface ImageProvider {
  name: string;
  canHandle(req: CoverRequest): boolean;
  produce(req: CoverRequest): Promise<CoverResult>;
}

// ── Провайдер 1: SVG-движок ProektMap (из title/category/tags) ─────────
export const svgOgProvider: ImageProvider = {
  name: "svg-og",
  canHandle: () => true,
  async produce(req) {
    const params = new URLSearchParams();
    params.set("title", req.title);
    if (req.category) params.set("category", req.category);
    if (req.tags?.length) params.set("tags", req.tags.join(","));
    if (req.author) params.set("author", req.author);
    if (req.seed) params.set("seed", req.seed);
    return { url: "/api/og?" + params.toString(), provider: "svg-og" };
  },
};

// ── Провайдер 2: RSS thumbnail (скачивает картинку из фида) ────────────
export const thumbnailProvider: ImageProvider = {
  name: "rss-thumbnail",
  canHandle: (req) => !!req.thumbnailUrl,
  async produce(req) {
    const url = req.thumbnailUrl as string;
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    const contentType = (res.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!res.ok || !contentType.startsWith("image")) {
      throw new Error("thumbnail: не изображение");
    }
    const buffer = Buffer.from(await res.arrayBuffer());
    if (buffer.length < 10 * 1024 || buffer.length > 5 * 1024 * 1024) {
      throw new Error("thumbnail: некорректный размер");
    }
    const extByType: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif", "image/svg+xml": "svg", "image/avif": "avif" };
    const ext = extByType[contentType] || "jpg";
    const filename = `blog-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");
    await mkdir(join(process.cwd(), "public", "uploads"), { recursive: true });
    await writeFile(join(process.cwd(), "public", "uploads", filename), buffer);
    return { url: `/uploads/${filename}`, provider: "rss-thumbnail" };
  },
};

// ── Резолвер: первый подходящий провайдер, с фолбэком ──────────────────
const DEFAULT_PROVIDERS: ImageProvider[] = [thumbnailProvider, svgOgProvider];

export async function resolveCover(req: CoverRequest, providers: ImageProvider[] = DEFAULT_PROVIDERS): Promise<CoverResult> {
  for (const p of providers) {
    if (p.canHandle(req)) {
      try {
        return await p.produce(req);
      } catch (e) {
        console.error(`ImageProvider ${p.name} failed:`, (e as Error).message);
      }
    }
  }
  // финальный фолбэк — SVG-движок
  return svgOgProvider.produce(req);
}

export { buildSvg };

