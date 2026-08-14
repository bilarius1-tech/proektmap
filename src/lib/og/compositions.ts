import { CategoryTheme, iconMarkup } from "./tokens";

// ── Детерминированный PRNG (mulberry32) ────────────────────────────────
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// ── Перенос заголовка по словам ────────────────────────────────────────
function wrapTitle(title: string, maxChars: number): string[] {
  const words = title.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if ((cur + " " + w).trim().length <= maxChars) {
      cur = (cur + " " + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [title];
}

function esc(s: string): string {
  return (s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ── Иконка (Lucide, 24x24 viewBox, обводка) ────────────────────────────
function icon(name: string, x: number, y: number, size: number, color: string): string {
  const markup = iconMarkup(name);
  const s = (size / 24).toFixed(4);
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${markup}</g>`;
}

export interface CompMeta {
  category: string;
  tags: string[];
  author: string;
}

type Composition = (title: string, theme: CategoryTheme, seed: number, meta: CompMeta) => string;

const FONT = "Inter, DejaVu Sans, sans-serif";

// ── 1. Сетка: текст слева, сетка узлов справа ──────────────────────────
const gridComp: Composition = (title, theme, seed, meta) => {
  const r = rng(seed);
  const lines = wrapTitle(title, 22).slice(0, 3);

  // сетка узлов справа (колонки x 4-5, строки 6)
  let nodes = "";
  let links = "";
  const cols = 6;
  const rows = 8;
  const ox = 720;
  const oy = 60;
  const sx = 72;
  const sy = 64;
  const pts: [number, number][] = [];
  for (let c = 0; c < cols; c++) {
    for (let rw = 0; rw < rows; rw++) {
      const x = ox + c * sx + (r() - 0.5) * 20;
      const y = oy + rw * sy + (r() - 0.5) * 20;
      pts.push([x, y]);
      const big = r() > 0.85;
      nodes += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${big ? 5 : 2.5}" fill="${theme.accent}" fill-opacity="${big ? 0.95 : 0.55}"/>`;
    }
  }
  // соединяем соседние узлы случайно
  for (let i = 0; i < pts.length - 1; i++) {
    if (r() > 0.75) {
      const [x1, y1] = pts[i];
      const [x2, y2] = pts[i + 1];
      links += `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${theme.accent}" stroke-opacity="0.25" stroke-width="1"/>`;
    }
  }

  const titleLines = lines
    .map((ln, i) => `<text x="80" y="${230 + i * 70}" font-family="${FONT}" font-size="52" font-weight="bold" fill="#ffffff">${esc(ln)}</text>`)
    .join("");

  // теги строкой
  const tagsText = (meta.tags || []).slice(0, 3).join("  ·  ");

  return `
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${links}
  ${nodes}
  <rect x="80" y="96" width="52" height="52" rx="14" fill="rgba(255,255,255,0.12)"/>
  ${icon(theme.icon, 94, 110, 24, theme.accent)}
  <text x="148" y="132" font-family="${FONT}" font-size="24" font-weight="600" fill="rgba(255,255,255,0.9)">${esc(meta.category)}</text>
  ${titleLines}
  ${tagsText ? `<text x="80" y="${230 + lines.length * 70 + 40}" font-family="${FONT}" font-size="22" fill="${theme.accent}">${esc(tagsText)}</text>` : ""}
  <text x="80" y="590" font-family="${FONT}" font-size="24" font-weight="700" fill="rgba(255,255,255,0.85)">proektmap.ru</text>
  `;
};

// ── 2. Диагональ: раздел по диагонали ──────────────────────────────────
const diagonalComp: Composition = (title, theme, seed, meta) => {
  const r = rng(seed);
  const lines = wrapTitle(title, 20).slice(0, 3);
  const titleLines = lines
    .map((ln, i) => `<text x="80" y="${380 + i * 66}" font-family="${FONT}" font-size="50" font-weight="bold" fill="#ffffff">${esc(ln)}</text>`)
    .join("");

  let dots = "";
  for (let i = 0; i < 26; i++) {
    const x = 640 + r() * 540;
    const y = 20 + r() * 590;
    dots += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(1 + r() * 3).toFixed(1)}" fill="${theme.accent}" fill-opacity="${(0.3 + r() * 0.5).toFixed(2)}"/>`;
  }

  return `
  <rect width="1200" height="630" fill="url(#bg)"/>
  <polygon points="0,0 900,0 600,630 0,630" fill="rgba(255,255,255,0.05)"/>
  <line x1="900" y1="0" x2="600" y2="630" stroke="${theme.accent}" stroke-opacity="0.5" stroke-width="3"/>
  ${dots}
  <g transform="translate(985 78)">
    <circle cx="60" cy="60" r="60" fill="rgba(255,255,255,0.12)"/>
  </g>
  ${icon(theme.icon, 985 + 36, 78 + 36, 48, theme.accent)}
  <text x="80" y="330" font-family="${FONT}" font-size="22" font-weight="600" fill="${theme.accent}" letter-spacing="2">${esc(meta.category.toUpperCase())}</text>
  ${titleLines}
  <text x="80" y="590" font-family="${FONT}" font-size="24" font-weight="700" fill="rgba(255,255,255,0.85)">proektmap.ru</text>
  `;
};

// ── 3. Радиальный: граф узлов вокруг заголовка ─────────────────────────
const radialComp: Composition = (title, theme, seed, meta) => {
  const r = rng(seed);
  const lines = wrapTitle(title, 18).slice(0, 3);

  const cx = 600;
  const cy = 300;
  let nodes = "";
  let links = "";
  const N = 14;
  const pts: [number, number][] = [];
  for (let i = 0; i < N; i++) {
    const ang = (i / N) * Math.PI * 2 + r() * 0.5;
    const rad = 150 + r() * 140;
    const x = cx + Math.cos(ang) * rad;
    const y = cy + Math.sin(ang) * rad * 0.85;
    pts.push([x, y]);
    nodes += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="5" fill="${theme.accent}" fill-opacity="0.9"/>`;
  }
  for (let i = 0; i < N; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 2) % N];
    links += `<line x1="${x1.toFixed(0)}" y1="${y1.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y2.toFixed(0)}" stroke="${theme.accent}" stroke-opacity="0.3" stroke-width="1.5"/>`;
  }
  // соединения к центру
  for (const [x, y] of pts) {
    links += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(0)}" y2="${y.toFixed(0)}" stroke="${theme.accent}" stroke-opacity="0.15" stroke-width="1"/>`;
  }

  const titleLines = lines
    .map((ln, i) => `<text x="${cx}" y="${cy - 40 + (i - (lines.length - 1) / 2) * 64}" font-family="${FONT}" font-size="48" font-weight="bold" fill="#ffffff" text-anchor="middle">${esc(ln)}</text>`)
    .join("");

  return `
  <rect width="1200" height="630" fill="url(#bg)"/>
  ${links}
  ${nodes}
  ${icon(theme.icon, cx - 18, 60, 36, theme.accent)}
  <text x="${cx}" y="116" font-family="${FONT}" font-size="20" font-weight="600" fill="rgba(255,255,255,0.9)" text-anchor="middle">${esc(meta.category)}</text>
  ${titleLines}
  <text x="${cx}" y="580" font-family="${FONT}" font-size="24" font-weight="700" fill="rgba(255,255,255,0.85)" text-anchor="middle">proektmap.ru</text>
  `;
};

// ── 4. Минимализм: крупная типографика ─────────────────────────────────
const minimalComp: Composition = (title, theme, seed, meta) => {
  const lines = wrapTitle(title, 26).slice(0, 3);
  const titleLines = lines
    .map((ln, i) => `<text x="80" y="${240 + i * 80}" font-family="${FONT}" font-size="64" font-weight="bold" fill="#ffffff">${esc(ln)}</text>`)
    .join("");

  const tags = (meta.tags || []).slice(0, 3);
  const tagEls = tags
    .map((t, i) => `<text x="${80 + i * 210}" y="560" font-family="${FONT}" font-size="20" fill="${theme.accent}">#${esc(t)}</text>`)
    .join("");

  return `
  <rect width="1200" height="630" fill="url(#bg)"/>
  <line x1="80" y1="170" x2="520" y2="170" stroke="${theme.accent}" stroke-opacity="0.5" stroke-width="2"/>
  <line x1="80" y1="620" x2="1200" y2="620" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
  ${icon(theme.icon, 80, 70, 40, theme.accent)}
  <text x="140" y="100" font-family="${FONT}" font-size="22" font-weight="600" fill="rgba(255,255,255,0.9)">${esc(meta.category)}</text>
  ${titleLines}
  ${tagEls}
  <text x="1080" y="595" font-family="${FONT}" font-size="24" font-weight="700" fill="rgba(255,255,255,0.85)" text-anchor="end">proektmap.ru</text>
  `;
};

export const COMPOSITIONS: Composition[] = [gridComp, diagonalComp, radialComp, minimalComp];

export function pickComposition(seed: number): Composition {
  return COMPOSITIONS[seed % COMPOSITIONS.length];
}

