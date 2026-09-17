import { getDb } from "@/lib/db";
import { STYLE_DIRECTIONS, type ButtonStyle, type Density, type StyleDirection } from "./types";

const FALLBACK_FONTS = new Set(
  [
    "times new roman",
    "times",
    "georgia",
    "arial",
    "helvetica",
    "serif",
    "sans-serif",
    "system-ui",
    "-apple-system",
    "blinkmacsystemfont",
  ].map((item) => item.toLowerCase()),
);

export interface StyleEvidence {
  bg?: string | null;
  text?: string | null;
  accent?: string | null;
  muted?: string | null;
  border?: string | null;
  fontDisplay?: string | null;
  fontBody?: string | null;
  radius?: number | null;
  displaySize?: number | null;
  bodySize?: number | null;
  letterSpacing?: string | null;
  maxWidth?: number | null;
  columns?: number | null;
  hasBlur?: boolean;
  hasShadow?: boolean;
  heading?: string | null;
  palette?: string[];
  fonts?: string[];
  fontFaces?: string[];
  typeScale?: number[];
  radii?: number[];
  cssVariables?: Record<string, string>;
  canvas?: string[];
}

export interface InterpretedDossier {
  direction: StyleDirection;
  bg: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  fontDisplay: string;
  fontBody: string;
  radius: number;
  buttonStyle: ButtonStyle;
  buttonHeight: number;
  density: Density;
  columns: number;
  maxWidth: number;
  displaySize?: number;
  bodySize?: number;
  palette: string[];
  fonts: string[];
  typeScale: number[];
  radii: number[];
  heading?: string;
  reason: string;
}

async function deepseekKey(): Promise<{ key: string; model: string }> {
  try {
    const db = await getDb();
    const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
    const row = settings as { deepseekApiKey?: string; deepseekModel?: string } | null;
    const key = row?.deepseekApiKey || process.env.DEEPSEEK_API_KEY || "";
    const model = row?.deepseekModel || "deepseek-chat";
    return { key, model };
  } catch {
    return { key: process.env.DEEPSEEK_API_KEY || "", model: "deepseek-chat" };
  }
}

function parseJsonObject(text: string): Record<string, unknown> | null {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function asHex(value: unknown): string | null {
  const hex = String(value || "").trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(hex) ? hex : null;
}

function asFont(value: unknown): string | null {
  const name = String(value || "")
    .replace(/['"]/g, "")
    .split(",")[0]
    .trim();
  if (!name || FALLBACK_FONTS.has(name.toLowerCase())) return null;
  return name;
}

function asHexList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const hex = asHex(item);
    if (!hex || seen.has(hex)) continue;
    seen.add(hex);
    out.push(hex);
  }
  return out;
}

function asFontList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const name = asFont(item);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out;
}

function asDirection(value: unknown): StyleDirection {
  const raw = String(value || "").trim() as StyleDirection;
  return STYLE_DIRECTIONS.includes(raw) ? raw : "product-minimal";
}

function pickCanvasBg(evidence: StyleEvidence): string {
  const pool = [evidence.bg, ...(evidence.canvas || []), ...(evidence.palette || [])]
    .map((item) => asHex(item))
    .filter((item): item is string => Boolean(item));
  if (pool.includes("#FFFFFF")) return "#FFFFFF";
  if (pool.includes("#FFF")) return "#FFFFFF";
  return pool[0] || "#FFFFFF";
}

function webFontsOf(evidence: StyleEvidence): string[] {
  return asFontList([
    ...(evidence.fontFaces || []),
    ...(evidence.fonts || []),
    evidence.fontDisplay,
    evidence.fontBody,
  ]);
}

/** Если DeepSeek молчит — не отдаём Times/cream: собираем досье из CSS-доказательств. */
export function fallbackDossierFromEvidence(evidence: StyleEvidence): InterpretedDossier | null {
  const fonts = webFontsOf(evidence);
  const font = fonts[0] || asFont(evidence.fontDisplay) || asFont(evidence.fontBody);
  if (!font) return null;
  const bg = pickCanvasBg(evidence);
  const text = asHex(evidence.text) || "#141414";
  const accent = asHex(evidence.accent) && evidence.accent !== bg && evidence.accent !== text
    ? asHex(evidence.accent)!
    : asHex((evidence.palette || []).find((hex) => asHex(hex) && asHex(hex) !== bg && asHex(hex) !== text)) || "#226DB7";
  const radii = (evidence.radii || []).filter((n) => Number.isFinite(n) && n >= 0 && n <= 80);
  const radiusObserved = evidence.radius != null && Number.isFinite(evidence.radius) ? evidence.radius : 0;
  const radius = radiusObserved >= 8 ? Math.min(48, radiusObserved) : Math.min(48, Math.max(radiusObserved, ...radii, 8));
  const palette = [bg, text, asHex(evidence.muted), asHex(evidence.border), accent, ...(evidence.palette || [])]
    .map((item) => asHex(item))
    .filter((item): item is string => Boolean(item));
  return {
    direction: "product-minimal",
    bg,
    text,
    muted: asHex(evidence.muted) || "#6B7280",
    border: asHex(evidence.border) || "#E5E7EB",
    accent,
    fontDisplay: font,
    fontBody: asFont(evidence.fontBody) || fonts[1] || font,
    radius,
    buttonStyle: "fill",
    buttonHeight: 48,
    density: "airy",
    columns: [4, 6, 8, 12].includes(Number(evidence.columns)) ? Number(evidence.columns) : 12,
    maxWidth: Math.min(1440, Math.max(960, Number(evidence.maxWidth) || 1120)),
    displaySize: evidence.displaySize || undefined,
    bodySize: evidence.bodySize || undefined,
    palette: [...new Set(palette)].slice(0, 12),
    fonts,
    typeScale: evidence.typeScale || [],
    radii: radii.length ? radii : [radius],
    heading: evidence.heading || undefined,
    reason: "DeepSeek не ответил — досье собрано из CSS: веб-шрифт и холст страницы, без системных Times/Arial.",
  };
}

/** DeepSeek по ключу собирает токены ЭТОГО сайта, а не школу из каталога. */
export async function interpretEvidence(evidence: StyleEvidence): Promise<InterpretedDossier | null> {
  const { key, model } = await deepseekKey();
  if (!key) return null;

  const allowed = STYLE_DIRECTIONS.join(", ");
  const sys = `Ты инженер визуала. По computed CSS живой страницы восстанови её дизайн-систему как есть.
Ответ — только JSON без markdown:
{
  "bg":"#FFFFFF","text":"#111111","muted":"#667085","border":"#E5E7EB","accent":"#2563EB",
  "fontDisplay":"Onest","fontBody":"Onest",
  "radius":12,"buttonStyle":"fill","buttonHeight":44,"density":"airy",
  "columns":12,"maxWidth":1120,"displaySize":40,"bodySize":16,
  "direction":"product-minimal",
  "palette":["#FFFFFF","#111111"],
  "fonts":["Onest"],
  "typeScale":[40,24,16],
  "radii":[8,12,999],
  "heading":"заголовок h1 если есть",
  "reason":"кратко что увидел"
}
direction — ближайший ярлык из: ${allowed}. Это метка, не замена токенов.
Жёсткие правила:
- Опиши ЭТОТ сайт. Не подменяй фон «бумагой журнала» и не ставь Times New Roman / Arial / Georgia, если в fontFaces или fonts есть веб-шрифт (Onest, Golos, Montserrat и т.д.).
- bg — холст, который видит человек (html/body/main). Если страница белая — bg #FFFFFF, даже если в палитре есть беж.
- Цвета только из palette / canvas / cssVariables / bg/text/accent сэмпла. Не выдумывай hex.
- accent — цвет CTA или бренда, не цвет абзаца.
- radius — с реальных кнопок, пилюля 20–50 допустима.
- buttonStyle fill если кнопка залита акцентом, иначе outline.`;

  try {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: sys },
          { role: "user", content: JSON.stringify(evidence) },
        ],
        max_tokens: 900,
        temperature: 0.1,
      }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!res.ok) {
      console.error("[site-style-interpret] DeepSeek HTTP", res.status);
      return null;
    }
    const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const parsed = parseJsonObject(json.choices?.[0]?.message?.content || "");
    if (!parsed) {
      console.error("[site-style-interpret] JSON не разобрался");
      return null;
    }

    const direction = asDirection(parsed.direction);

    const bg = asHex(parsed.bg);
    const text = asHex(parsed.text);
    const accent = asHex(parsed.accent);
    if (!bg || !text || !accent) return null;

    const columnsRaw = Number(parsed.columns);
    const columns = [4, 6, 8, 12].includes(columnsRaw) ? columnsRaw : 12;
    const maxWidth = Math.min(1440, Math.max(640, Number(parsed.maxWidth) || 1100));
    const radiusRaw = Number(parsed.radius);
    const radius = Number.isFinite(radiusRaw) ? Math.min(48, Math.max(0, Math.round(radiusRaw))) : 8;
    const buttonHeightRaw = Number(parsed.buttonHeight);
    const buttonHeight = Number.isFinite(buttonHeightRaw)
      ? Math.min(56, Math.max(36, Math.round(buttonHeightRaw)))
      : 44;
    const buttonStyle: ButtonStyle = parsed.buttonStyle === "outline" ? "outline" : "fill";
    const density: Density = parsed.density === "compact" ? "compact" : "airy";
    const evidenceFonts = webFontsOf(evidence);
    const fontDisplay =
      asFont(parsed.fontDisplay) || asFontList(parsed.fonts)[0] || evidenceFonts[0] || "";
    const fontBody =
      asFont(parsed.fontBody) || asFontList(parsed.fonts)[1] || fontDisplay || evidenceFonts[0] || "";
    if (!fontDisplay) return null;

    const palette = asHexList(parsed.palette);
    if (!palette.includes(bg)) palette.unshift(bg);
    if (!palette.includes(text)) palette.push(text);
    if (!palette.includes(accent)) palette.push(accent);

    return {
      direction,
      bg,
      text,
      muted: asHex(parsed.muted) || text,
      border: asHex(parsed.border) || "#E5E7EB",
      accent,
      fontDisplay,
      fontBody: fontBody || fontDisplay,
      radius,
      buttonStyle,
      buttonHeight,
      density,
      columns,
      maxWidth,
      displaySize: Number(parsed.displaySize) || undefined,
      bodySize: Number(parsed.bodySize) || undefined,
      palette: palette.slice(0, 12),
      fonts: asFontList(parsed.fonts).length ? asFontList(parsed.fonts) : [fontDisplay, fontBody].filter(Boolean),
      typeScale: Array.isArray(parsed.typeScale)
        ? parsed.typeScale.map(Number).filter((n) => n >= 10 && n <= 96).slice(0, 8)
        : [],
      radii: Array.isArray(parsed.radii)
        ? parsed.radii.map(Number).filter((n) => n >= 0 && n <= 80).slice(0, 6)
        : [radius],
      heading: String(parsed.heading || "").slice(0, 80) || undefined,
      reason: String(parsed.reason || "").slice(0, 220),
    };
  } catch (error) {
    console.error("[site-style-interpret]", error instanceof Error ? error.message : error);
    return null;
  }
}
