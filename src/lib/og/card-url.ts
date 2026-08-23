export interface CardCoverParams {
  title: string;
  summary?: string;
  category?: string;
  seed?: string;
  baseUrl?: string;
  coverImage?: string;
}

export function cardCoverUrl({
  title,
  summary,
  category,
  seed,
  baseUrl = "",
}: CardCoverParams): string {
  const params = new URLSearchParams({ mode: "card", v: "2", title });
  if (summary) params.set("summary", summary);
  if (category) params.set("category", category);
  if (seed) params.set("seed", seed);
  return `${baseUrl}/api/og?${params.toString()}`;
}

export function blogCoverUrl(params: CardCoverParams): string {
  const coverImage = params.coverImage?.trim();
  if (!coverImage) return cardCoverUrl(params);

  const normalized = coverImage.startsWith("/uploads/")
    ? coverImage.replace("/uploads/", "/api/media/")
    : coverImage;

  if (/^https?:\/\//i.test(normalized)) return normalized;
  return `${params.baseUrl || ""}${normalized.startsWith("/") ? normalized : `/${normalized}`}`;
}
