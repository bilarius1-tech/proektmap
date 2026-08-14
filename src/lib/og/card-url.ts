export interface CardCoverParams {
  title: string;
  summary?: string;
  category?: string;
  seed?: string;
  baseUrl?: string;
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
