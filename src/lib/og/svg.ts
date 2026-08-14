import { themeFor } from "./tokens";
import { pickComposition, hashStr, CompMeta } from "./compositions";

export interface OgInput {
  title: string;
  category?: string;
  tags?: string[];
  author?: string;
  seed?: string;
}

export function buildSvg(input: OgInput): string {
  const theme = themeFor(input.category);
  const seed = hashStr(input.seed || input.title + "|" + (input.category || ""));
  const comp = pickComposition(seed);
  const meta: CompMeta = {
    category: input.category || "ProektMap",
    tags: input.tags || [],
    author: input.author || "",
  };
  const inner = comp(input.title || "Карта роста", theme, seed, meta);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
${inner}
</svg>`;
}

