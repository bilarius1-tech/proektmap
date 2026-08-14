import { themeFor, iconMarkup } from "./tokens";
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

// Миниатюра без текста — для карточек списка (цвет категории + иконка + узор).
// Текст сюда не попадает, поэтому мелкий размер не режет читаемость.
export function buildThumbSvg(category?: string, seed?: string): string {
  const theme = themeFor(category);
  const s = hashStr(seed || category || "thumb");

  let dots = "";
  for (let c = 0; c < 13; c++) {
    for (let r = 0; r < 8; r++) {
      const x = 40 + c * 95 + ((s >> (c % 12)) % 20) - 10;
      const y = 40 + r * 80 + ((s >> (r % 12)) % 20) - 10;
      const rad = (1.5 + ((s >> ((c * 5 + r) % 20)) % 3)).toFixed(1);
      dots += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${theme.accent}" fill-opacity="0.25"/>`;
    }
  }
  // диагональные линии для фактуры
  let lines = "";
  for (let i = 0; i < 5; i++) {
    const y = 120 + i * 110 + (s % 30);
    lines += `<line x1="0" y1="${y}" x2="1200" y2="${y - 220}" stroke="${theme.accent}" stroke-opacity="0.12" stroke-width="1.5"/>`;
  }

  const iconSvg = iconMarkup(theme.icon);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${lines}
  ${dots}
  <circle cx="600" cy="315" r="130" fill="rgba(255,255,255,0.08)"/>
  <circle cx="600" cy="315" r="130" fill="none" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="1.5"/>
  <g transform="translate(545 260) scale(4.6)" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</g>
</svg>`;
}

