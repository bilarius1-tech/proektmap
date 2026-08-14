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

function escText(value: string): string {
  return (value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function plainText(value: string): string {
  return (value || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapCardTitle(title: string, maxChars = 24): string[] {
  const words = plainText(title).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = `${current} ${word}`.trim();
    if (next.length <= maxChars || !current) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);

  const visible = lines.slice(0, 3);
  if (lines.length > 3 && visible[2]) {
    visible[2] = `${visible[2].slice(0, Math.max(0, maxChars - 1)).trim()}…`;
  }
  return visible.length ? visible : ["Карта роста"];
}

function shortSummary(summary: string, maxChars = 76): string {
  const clean = plainText(summary);
  if (clean.length <= maxChars) return clean;
  const shortened = clean.slice(0, maxChars - 1).replace(/\s+\S*$/, "").trim();
  return `${shortened || clean.slice(0, maxChars - 1)}…`;
}

function wrapSummary(summary: string, maxChars = 38): string[] {
  const words = shortSummary(summary).split(" ").filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = `${current} ${word}`.trim();
    if (next.length <= maxChars || !current) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, 2);
}

// Редакционная обложка для ленты и Telegram:
// крупный заголовок + одна строка, объясняющая суть материала.
export function buildCardSvg(input: OgInput & { summary?: string }): string {
  const theme = themeFor(input.category);
  const seed = hashStr(input.seed || input.title + "|" + (input.category || ""));
  const titleLines = wrapCardTitle(input.title)
    .map(
      (line, index) =>
        `<text x="76" y="${220 + index * 76}" font-family="Inter, DejaVu Sans, sans-serif" font-size="60" font-weight="750" fill="#ffffff">${escText(line)}</text>`,
    )
    .join("");
  const summaryLines = wrapSummary(input.summary || "");
  const summaryText = summaryLines
    .map(
      (line, index) =>
        `<text x="76" y="${534 + index * 38}" font-family="Inter, DejaVu Sans, sans-serif" font-size="31" font-weight="500" fill="rgba(255,255,255,0.9)">${escText(line)}</text>`,
    )
    .join("");
  const iconSvg = iconMarkup(theme.icon);

  let nodes = "";
  for (let index = 0; index < 18; index++) {
    const x = 820 + ((seed >> (index % 16)) % 300);
    const y = 70 + index * 30;
    const radius = index % 5 === 0 ? 6 : 3;
    nodes += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${theme.accent}" fill-opacity="${index % 5 === 0 ? "0.9" : "0.35"}"/>`;
    if (index > 0) {
      const previousX = 820 + ((seed >> ((index - 1) % 16)) % 300);
      const previousY = 70 + (index - 1) * 30;
      nodes += `<line x1="${previousX}" y1="${previousY}" x2="${x}" y2="${y}" stroke="${theme.accent}" stroke-opacity="0.18" stroke-width="1.5"/>`;
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${theme.from}"/>
      <stop offset="100%" stop-color="${theme.to}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${nodes}
  <g transform="translate(76 64)">
    <rect width="50" height="50" fill="rgba(255,255,255,0.1)"/>
    <g transform="translate(13 13)" fill="none" stroke="${theme.accent}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconSvg}</g>
  </g>
  <text x="144" y="98" font-family="Inter, DejaVu Sans, sans-serif" font-size="21" font-weight="650" fill="${theme.accent}" letter-spacing="1.5">${escText((input.category || "PROEKTMAP").toUpperCase())}</text>
  ${titleLines}
  <line x1="76" y1="492" x2="1124" y2="492" stroke="rgba(255,255,255,0.22)" stroke-width="1"/>
  ${summaryText}
  <text x="1124" y="604" font-family="Inter, DejaVu Sans, sans-serif" font-size="18" font-weight="700" fill="rgba(255,255,255,0.68)" text-anchor="end">КАРТА РОСТА · ПРОЧИТАТЬ КРАТКО</text>
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

