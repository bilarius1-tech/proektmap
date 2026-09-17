import { existsSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";
import { DEFAULT_TOKENS } from "./defaults";
import { fallbackDossierFromEvidence, interpretEvidence } from "./interpret";
import { fallbackMuted } from "./palettes";
import { assertPublicHttpUrl } from "./ssrf";
import type { ExtractedStyle, StyleTokens } from "./types";

const EXTRACT_TIMEOUT_MS = 12_000;

type PageSample = {
  bg: string | null;
  text: string | null;
  accent: string | null;
  border: string | null;
  fontBody: string | null;
  fontDisplay: string | null;
  radius: number | null;
  gap: number | null;
  displaySize: number | null;
  bodySize: number | null;
  letterSpacing: string | null;
  maxWidth: number | null;
  columns: number | null;
  hasBlur: boolean;
  hasShadow: boolean;
  heading: string | null;
  palette: string[];
  fonts: string[];
  typeScale: number[];
  radii: number[];
  fontFaces: string[];
  canvas: string[];
  cssVariables: Record<string, string>;
};

function resolveChromeExecutable(): string {
  const candidates = [chromium.executablePath()];
  const cache = join(homedir(), ".cache/ms-playwright");
  if (existsSync(cache)) {
    for (const dir of readdirSync(cache)) {
      if (!dir.startsWith("chromium")) continue;
      candidates.push(join(cache, dir, "chrome-linux64", "chrome"));
      candidates.push(join(cache, dir, "chrome-linux", "chrome"));
    }
  }
  const found = candidates.find((path) => existsSync(path));
  if (!found) {
    throw new Error("Executable doesn't exist");
  }
  return found;
}

function uniqueHex(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const hex = value.toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(hex) || seen.has(hex)) continue;
    seen.add(hex);
    out.push(value.toUpperCase());
  }
  return out.slice(0, 12);
}

const FALLBACK_FONT_NAMES = /^(times new roman|times|georgia|arial|helvetica|serif|sans-serif|system-ui|-apple-system|blinkmacsystemfont)$/i;

function uniqueFonts(values: Array<string | undefined>): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const value of values) {
    const name = (value || "").trim();
    if (!name || FALLBACK_FONT_NAMES.test(name)) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(name);
  }
  return out.slice(0, 4);
}

function launchErrorMessage(error: unknown): string {
  const text = error instanceof Error ? `${error.message}\n${error.stack ?? ""}` : String(error);
  console.error("[site-style-extract]", text);
  if (/Executable doesn't exist/i.test(text)) {
    return "На сервере ещё не установлен Chromium. Конструктор работает вручную — задайте токены сами.";
  }
  return (error instanceof Error ? error.message : String(error)).slice(0, 240) || "Не удалось открыть сайт.";
}

export async function extractStyleFromUrl(target: URL): Promise<ExtractedStyle> {
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  const warnings: string[] = [];

  try {
    browser = await chromium.launch({
      executablePath: resolveChromeExecutable(),
      args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      timeout: EXTRACT_TIMEOUT_MS,
    });
    const page = await browser.newPage({
      viewport: { width: 1280, height: 800 },
      userAgent:
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    });
    page.setDefaultTimeout(EXTRACT_TIMEOUT_MS);

    const response = await page.goto(target.toString(), {
      waitUntil: "domcontentloaded",
      timeout: EXTRACT_TIMEOUT_MS,
    });

    const finalUrl = await assertPublicHttpUrl(page.url());

    if (!response || response.status() >= 400) {
      warnings.push("Страница ответила с ошибкой, токены могут быть неточными.");
    }

    await Promise.race([
      page.evaluate(`document.fonts.ready`),
      new Promise((resolve) => setTimeout(resolve, 2500)),
    ]).catch(() => {});
    await new Promise((resolve) => setTimeout(resolve, 400));

    const sample = await page.evaluate(`(() => {
      const toHex = (value) => {
        if (value == null) return null;
        const s = String(value).trim();
        if (!s || s === "transparent" || s === "none" || s === "inherit") return null;
        if (s.charAt(0) === "#") {
          let h = s.slice(1);
          if (h.length === 3 || h.length === 4) h = h.split("").map((c) => c + c).join("").slice(0, 6);
          if (h.length >= 6 && /^[0-9a-fA-F]{6}/.test(h)) return "#" + h.slice(0, 6).toLowerCase();
          return null;
        }
        const m = s.match(/rgba?\\(\\s*([\\d.]+)\\s*[,\\s]\\s*([\\d.]+)\\s*[,\\s]\\s*([\\d.]+)/i);
        if (!m) return null;
        const r = Math.round(Number(m[1]));
        const g = Math.round(Number(m[2]));
        const b = Math.round(Number(m[3]));
        const alpha = s.match(/rgba?\\([^)]*[,/]\\s*([\\d.]+)\\s*\\)/i);
        if (alpha && Number(alpha[1]) === 0) return null;
        return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
      };

      const fallbackFont = /^(times new roman|times|georgia|arial|helvetica|serif|sans-serif|system-ui|-apple-system|blinkmacsystemfont)$/i;

      const firstFamily = (value) =>
        String(value).split(",")[0].replace(/['"]/g, "").trim() || null;

      const body = getComputedStyle(document.body);
      const heading = document.querySelector("h1, h2");
      const button = document.querySelector("button, a.button, a.btn, [class*='btn'], input[type='submit']");
      const field = document.querySelector("input, textarea, select");
      const link = document.querySelector("main a, a");

      const headingStyle = heading ? getComputedStyle(heading) : null;
      const buttonStyle = button ? getComputedStyle(button) : null;
      const fieldStyle = field ? getComputedStyle(field) : null;
      const linkStyle = link ? getComputedStyle(link) : null;

      const accent =
        (buttonStyle && toHex(buttonStyle.backgroundColor)) ||
        (linkStyle && toHex(linkStyle.color)) ||
        (buttonStyle && toHex(buttonStyle.color));

      const radiusRaw = (buttonStyle && buttonStyle.borderRadius) || (fieldStyle && fieldStyle.borderRadius) || "0";
      const radius = parseFloat(radiusRaw);

      const gapRaw = getComputedStyle(document.body).gap || getComputedStyle(document.documentElement).rowGap;
      const gap = parseFloat(gapRaw || "0");

      const main = document.querySelector("main, [class*='container'], .wrapper") || document.body;
      const maxWidthRaw = parseFloat(getComputedStyle(main).maxWidth);
      const gridEl = document.querySelector("[class*='grid'], [style*='grid-template']");
      let columns = null;
      if (gridEl) {
        const tpl = getComputedStyle(gridEl).gridTemplateColumns;
        if (tpl && tpl !== "none") {
          columns = tpl.split(" ").filter(Boolean).length;
        }
      }
      const probe = Array.from(document.querySelectorAll("header, nav, main, div")).slice(0, 36);
      const hasBlur = probe.some((el) => {
        const st = getComputedStyle(el);
        const f = st.backdropFilter || st.webkitBackdropFilter;
        return f && f !== "none";
      });
      const hasShadow = probe.some((el) => {
        const sh = getComputedStyle(el).boxShadow;
        return sh && sh !== "none";
      });

      const colorScore = {};
      const fontScore = {};
      const sizeScore = {};
      const radiusScore = {};
      const genericFont = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-sans-serif|ui-serif|ui-monospace|inherit|initial|unset|-apple-system|blinkmacsystemfont)$/i;
      const nodes = Array.from(document.querySelectorAll("body, body *")).slice(0, 700);
      for (const el of nodes) {
        const r = el.getBoundingClientRect();
        if (r.width < 6 || r.height < 6) continue;
        const st = getComputedStyle(el);
        const area = Math.min(r.width * r.height, 280000);
        const bumpColor = (raw, weight) => {
          const hex = toHex(raw);
          if (!hex) return;
          colorScore[hex] = (colorScore[hex] || 0) + weight;
        };
        bumpColor(st.backgroundColor, area);
        bumpColor(st.color, Math.sqrt(area) * 8);
        bumpColor(st.borderTopColor, 24);
        const fam = firstFamily(st.fontFamily);
        if (fam && !genericFont.test(fam) && !fallbackFont.test(fam)) fontScore[fam] = (fontScore[fam] || 0) + 1;
        const fs = Math.round(parseFloat(st.fontSize));
        if (fs >= 11 && fs <= 96) sizeScore[fs] = (sizeScore[fs] || 0) + 1;
        const rad = Math.round(parseFloat(st.borderRadius));
        if (Number.isFinite(rad) && rad > 0 && rad < 64) radiusScore[rad] = (radiusScore[rad] || 0) + 1;
      }
      const ranked = (map, n) =>
        Object.keys(map)
          .sort((a, b) => map[b] - map[a])
          .slice(0, n);

      const fontFaces = [];
      try {
        document.fonts.forEach((face) => {
          const fam = String(face.family || "").replace(/['"]/g, "").trim();
          if (fam && !fallbackFont.test(fam) && fontFaces.indexOf(fam) < 0) fontFaces.push(fam);
        });
      } catch (e) {}

      const pickFont = (computed) => {
        const fam = firstFamily(computed);
        if (fam && !fallbackFont.test(fam)) return fam;
        return fontFaces[0] || fam;
      };

      const canvasScore = {};
      const vw = window.innerWidth || 1280;
      const vh = window.innerHeight || 800;
      const htmlBg = toHex(getComputedStyle(document.documentElement).backgroundColor);
      const bodyBg = toHex(getComputedStyle(document.body).backgroundColor);
      if (htmlBg) canvasScore[htmlBg] = (canvasScore[htmlBg] || 0) + vw * vh * 6;
      if (bodyBg) canvasScore[bodyBg] = (canvasScore[bodyBg] || 0) + vw * vh * 5;
      for (const el of [document.querySelector("main"), document.querySelector("#app"), document.querySelector("[class*='wrapper']")]) {
        if (!el) continue;
        const hex = toHex(getComputedStyle(el).backgroundColor);
        if (!hex) continue;
        canvasScore[hex] = (canvasScore[hex] || 0) + vw * vh;
      }
      Array.from(document.querySelectorAll("section, div, main")).slice(0, 80).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width < vw * 0.55 || r.height < 120) return;
        const hex = toHex(getComputedStyle(el).backgroundColor);
        if (hex) canvasScore[hex] = (canvasScore[hex] || 0) + r.width * r.height;
      });
      const canvas = ranked(canvasScore, 6);

      const cssVariables = {};
      const rootStyles = getComputedStyle(document.documentElement);
      for (let i = 0; i < Math.min(rootStyles.length, 80); i++) {
        const prop = rootStyles[i];
        if (prop && prop.indexOf("--") === 0) {
          const hex = toHex(rootStyles.getPropertyValue(prop));
          if (hex) cssVariables[prop] = hex;
        }
      }

      return {
        bg: (htmlBg === "#ffffff" || bodyBg === "#ffffff" ? "#ffffff" : null) || canvas[0] || bodyBg || htmlBg,
        text: toHex(body.color),
        accent,
        border: fieldStyle ? toHex(fieldStyle.borderTopColor) : toHex(body.borderTopColor),
        fontBody: pickFont(body.fontFamily),
        fontDisplay: headingStyle ? pickFont(headingStyle.fontFamily) : pickFont(body.fontFamily),
        radius: Number.isFinite(radius) ? Math.round(radius) : null,
        gap: Number.isFinite(gap) ? Math.round(gap) : null,
        displaySize: headingStyle ? Math.round(parseFloat(headingStyle.fontSize)) : null,
        bodySize: Math.round(parseFloat(body.fontSize)),
        letterSpacing: headingStyle ? headingStyle.letterSpacing : null,
        maxWidth: Number.isFinite(maxWidthRaw) ? Math.round(maxWidthRaw) : null,
        columns,
        hasBlur,
        hasShadow,
        heading: heading && heading.textContent ? heading.textContent.trim().slice(0, 80) : null,
        palette: ranked(colorScore, 10),
        fonts: (fontFaces.concat(ranked(fontScore, 4))).filter((v, i, a) => v && a.indexOf(v) === i).slice(0, 6),
        typeScale: ranked(sizeScore, 6).map(Number).sort((a, b) => b - a),
        radii: ranked(radiusScore, 5).map(Number).sort((a, b) => a - b),
        fontFaces,
        canvas,
        cssVariables,
      };
    })()`) as PageSample;

    const tokens: Partial<StyleTokens> = {
      bg: sample.bg || DEFAULT_TOKENS.bg,
      text: sample.text || DEFAULT_TOKENS.text,
      muted: fallbackMuted(sample.bg || DEFAULT_TOKENS.bg),
      accent: sample.accent && sample.accent !== sample.bg && sample.accent !== sample.text ? sample.accent : DEFAULT_TOKENS.accent,
      border: sample.border || DEFAULT_TOKENS.border,
      fontBody: uniqueFonts([sample.fontBody || undefined, sample.fontFaces[0], ...(sample.fonts || [])])[0] || DEFAULT_TOKENS.fontBody,
      fontDisplay: uniqueFonts([sample.fontDisplay || undefined, sample.fontFaces[0], ...(sample.fonts || [])])[0] || DEFAULT_TOKENS.fontDisplay,
      radius:
        sample.radius != null && Number.isFinite(sample.radius) && sample.radius >= 0
          ? Math.min(48, Math.round(sample.radius))
          : sample.radii[sample.radii.length - 1] ?? DEFAULT_TOKENS.radius,
      density: sample.gap !== null && sample.gap < 12 ? "compact" : "airy",
    };

    if (!sample.accent || sample.accent === sample.text || sample.accent === sample.bg) {
      warnings.push("Акцент на странице слабо отличился — DeepSeek уточнит по палитре.");
    }

    await browser.close().catch(() => {});
    browser = undefined;

    const interpreted = await interpretEvidence({
      bg: sample.bg,
      text: sample.text,
      accent: sample.accent,
      muted: tokens.muted,
      border: sample.border,
      fontDisplay: sample.fontDisplay,
      fontBody: sample.fontBody,
      radius: tokens.radius,
      displaySize: sample.displaySize,
      bodySize: sample.bodySize,
      letterSpacing: sample.letterSpacing,
      maxWidth: sample.maxWidth,
      columns: sample.columns,
      hasBlur: sample.hasBlur,
      hasShadow: sample.hasShadow,
      heading: sample.heading,
      palette: sample.palette,
      fonts: sample.fonts,
      fontFaces: sample.fontFaces,
      typeScale: sample.typeScale,
      radii: sample.radii,
      cssVariables: sample.cssVariables,
      canvas: sample.canvas,
    });

    const dossier = interpreted || fallbackDossierFromEvidence({
      bg: sample.bg,
      text: sample.text,
      accent: sample.accent,
      muted: tokens.muted,
      border: sample.border,
      fontDisplay: sample.fontDisplay,
      fontBody: sample.fontBody,
      radius: tokens.radius,
      displaySize: sample.displaySize,
      bodySize: sample.bodySize,
      letterSpacing: sample.letterSpacing,
      maxWidth: sample.maxWidth,
      columns: sample.columns,
      hasBlur: sample.hasBlur,
      hasShadow: sample.hasShadow,
      heading: sample.heading,
      palette: sample.palette,
      fonts: sample.fonts,
      fontFaces: sample.fontFaces,
      typeScale: sample.typeScale,
      radii: sample.radii,
      cssVariables: sample.cssVariables,
      canvas: sample.canvas,
    });

    if (dossier) {
      tokens.bg = dossier.bg;
      tokens.text = dossier.text;
      tokens.muted = dossier.muted;
      tokens.border = dossier.border;
      tokens.accent = dossier.accent;
      tokens.fontDisplay = dossier.fontDisplay;
      tokens.fontBody = dossier.fontBody;
      tokens.radius = dossier.radius;
      tokens.buttonStyle = dossier.buttonStyle;
      tokens.buttonHeight = dossier.buttonHeight;
      tokens.density = dossier.density;
      tokens.gridColumns = dossier.columns;
      tokens.maxWidth = dossier.maxWidth;
      warnings.push(`${interpreted ? "DeepSeek" : "CSS"}: ${dossier.reason}`);
    } else {
      tokens.gridColumns = sample.columns || 12;
      tokens.maxWidth = sample.maxWidth && sample.maxWidth >= 960 ? sample.maxWidth : 1120;
      warnings.push("DeepSeek не ответил — токены сняты из CSS, стиль выберите сами.");
    }

    const grid = {
      columns: tokens.gridColumns || 12,
      maxWidth: tokens.maxWidth || 1100,
    };

    return {
      sourceUrl: finalUrl.toString(),
      tokens,
      warnings,
      suggestedDirection: dossier?.direction || interpreted?.direction,
      grid,
      evidenceNote: dossier?.reason || interpreted?.reason,
      system: {
        palette: uniqueHex([
          tokens.bg,
          tokens.text,
          tokens.muted,
          tokens.border,
          tokens.accent,
          ...(dossier?.palette || sample.palette || []),
        ]),
        fonts: uniqueFonts([
          tokens.fontDisplay,
          tokens.fontBody,
          ...(dossier?.fonts || []),
          sample.fontDisplay || undefined,
          sample.fontBody || undefined,
          ...(sample.fontFaces || []),
          ...(sample.fonts || []),
        ]),
        typeScale:
          dossier?.typeScale?.length
            ? dossier.typeScale
            : sample.typeScale.length > 0
              ? sample.typeScale
              : [sample.displaySize, sample.bodySize].filter((n): n is number => Boolean(n)),
        radii: dossier?.radii?.length ? dossier.radii : sample.radii.length > 0 ? sample.radii : tokens.radius ? [tokens.radius] : [],
        heading: dossier?.heading || sample.heading,
      },
    };
  } catch (error) {
    throw new Error(launchErrorMessage(error));
  } finally {
    await browser?.close().catch(() => {});
  }
}
