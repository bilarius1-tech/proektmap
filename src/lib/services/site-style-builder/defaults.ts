import { preferredPalette } from "./palettes";
import { SCHOOLS } from "./schools";
import type { FontPair, StyleDirection, StyleTokens } from "./types";

export const BANNED_FONTS = ["Inter", "Roboto", "Arial", "Space Grotesk", "system-ui", "sans-serif"];

export const DIRECTION_LABELS = Object.fromEntries(
  (Object.keys(SCHOOLS) as StyleDirection[]).map((key) => [key, SCHOOLS[key].label]),
) as Record<StyleDirection, string>;

export const DIRECTION_VOICE = Object.fromEntries(
  (Object.keys(SCHOOLS) as StyleDirection[]).map((key) => [key, SCHOOLS[key].thesis]),
) as Record<StyleDirection, string>;

export const FONT_PAIRS: FontPair[] = [
  {
    id: "newsreader-golos",
    display: "Newsreader",
    body: "Golos Text",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;600;700&family=Newsreader:opsz,wght@6..72,400;6..72,600;6..72,700&display=swap",
    suits: ["editorial"],
    note: "Современный журнал, кириллица, колонка",
  },
  {
    id: "source-serif-sans",
    display: "Source Serif 4",
    body: "Source Sans 3",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;600;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&display=swap",
    suits: ["editorial"],
    note: "Газетный стек news-org",
  },
  {
    id: "plex-serif-sans",
    display: "IBM Plex Serif",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
    googleHref:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Serif:wght@400;600;700&display=swap",
    suits: ["editorial"],
    note: "Технический журнал, отличная кириллица",
  },
  {
    id: "literata-golos",
    display: "Literata",
    body: "Golos Text",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;600;700&family=Literata:opsz,wght@7..72,500;7..72,700&display=swap",
    suits: ["editorial"],
    note: "Longread, книжная антиква",
  },
  {
    id: "eb-garamond-golos",
    display: "EB Garamond",
    body: "Golos Text",
    googleHref:
      "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=Golos+Text:wght@400;600&display=swap",
    suits: ["editorial", "luxury"],
    note: "Литературный журнал",
  },
  {
    id: "playfair-pt",
    display: "Playfair Display",
    body: "PT Sans",
    googleHref:
      "https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@600;700&display=swap",
    suits: ["editorial"],
    note: "Классическая антиква + PT",
  },
  {
    id: "pt-serif-pt",
    display: "PT Serif",
    body: "PT Sans",
    googleHref:
      "https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400&family=PT+Serif:wght@400;700&display=swap",
    suits: ["editorial"],
    note: "Русская пара ParaType",
  },
  {
    id: "spectral-nunito",
    display: "Spectral",
    body: "Nunito Sans",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Spectral:wght@600;700&display=swap",
    suits: ["editorial", "product-minimal"],
    note: "Мягкая антиква",
  },
  {
    id: "cormorant-golos",
    display: "Cormorant Garamond",
    body: "Golos Text",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Golos+Text:wght@400;600&display=swap",
    suits: ["editorial", "luxury"],
    note: "Люкс-журнал, высокая контрастность",
  },
  {
    id: "plex-swiss",
    display: "IBM Plex Sans",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
    googleHref:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap",
    suits: ["swiss", "techno"],
    note: "Гротеск вместо Helvetica, кириллица",
  },
  {
    id: "commissioner-plex",
    display: "Commissioner",
    body: "IBM Plex Sans",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Commissioner:wght@400;600;700;800&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
    suits: ["swiss"],
    note: "Современный гротеск + Plex",
  },
  {
    id: "geologica-golos",
    display: "Geologica",
    body: "Golos Text",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Geologica:wght@400;600;800&family=Golos+Text:wght@400;600;700&display=swap",
    suits: ["swiss"],
    note: "Геометрический swiss, кириллица",
  },
  {
    id: "golos-plex",
    display: "Golos Text",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;600;700;800&family=IBM+Plex+Mono:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    suits: ["swiss"],
    note: "Русский гротеск + международный текст",
  },
  {
    id: "manrope-source",
    display: "Manrope",
    body: "Source Serif 4",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap",
    suits: ["product-minimal", "glass"],
    note: "Продукт: гротеск + антиква в тексте",
  },
  {
    id: "onest-source",
    display: "Onest",
    body: "Source Serif 4",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Onest:wght@400;600;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap",
    suits: ["product-minimal"],
    note: "Кириллический продукт",
  },
  {
    id: "outfit-source",
    display: "Outfit",
    body: "Source Serif 4",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Outfit:wght@500;700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap",
    suits: ["product-minimal", "bold-marketing", "glass"],
    note: "Геометрия + антиква",
  },
  {
    id: "unbounded-onest",
    display: "Unbounded",
    body: "Onest",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Onest:wght@400;600;700&family=Unbounded:wght@600;700&display=swap",
    suits: ["bold-marketing", "poster"],
    note: "Громкий display, кириллица",
  },
  {
    id: "oswald-nunito",
    display: "Oswald",
    body: "Nunito Sans",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&family=Oswald:wght@500;600&display=swap",
    suits: ["bold-marketing", "poster"],
    note: "Плакатный конденсат",
  },
  {
    id: "outfit-golos",
    display: "Outfit",
    body: "Golos Text",
    googleHref:
      "https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;600;700&family=Outfit:wght@500;700&display=swap",
    suits: ["glass"],
    note: "Стекло: геометрия + кириллица",
  },
  {
    id: "plex-techno",
    display: "IBM Plex Sans",
    body: "IBM Plex Sans",
    mono: "IBM Plex Mono",
    googleHref:
      "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;700&family=IBM+Plex+Sans:wght@400;500;600;700;800&display=swap",
    suits: ["techno"],
    note: "Терминал: Plex + моно цифры",
  },
];

export function fontsFor(direction: StyleDirection): FontPair[] {
  return FONT_PAIRS.filter((pair) => pair.suits.includes(direction));
}

export function preferredFont(direction: StyleDirection): FontPair {
  return fontsFor(direction)[0] ?? FONT_PAIRS[0];
}

export function findPairById(id: string): FontPair | undefined {
  return FONT_PAIRS.find((pair) => pair.id === id);
}

export function findPair(display: string, body: string): FontPair | undefined {
  return FONT_PAIRS.find((pair) => pair.display === display && pair.body === body);
}

export function spacingFor(density: StyleTokens["density"]) {
  return density === "compact"
    ? { xs: 4, s: 8, m: 12, l: 20, xl: 32 }
    : { xs: 8, s: 12, m: 20, l: 32, xl: 56 };
}

export function sanitizeExtractedFont(name: string, fallback: string): string {
  const clean = name.replace(/['"]/g, "").trim();
  if (!clean || BANNED_FONTS.some((banned) => clean.toLowerCase() === banned.toLowerCase())) {
    return fallback;
  }
  const known = FONT_PAIRS.find(
    (pair) => pair.display.toLowerCase() === clean.toLowerCase() || pair.body.toLowerCase() === clean.toLowerCase(),
  );
  if (known) {
    return known.display.toLowerCase() === clean.toLowerCase() ? known.display : known.body;
  }
  return clean;
}

export function nearestPairFor(display: string, body: string, direction: StyleDirection): FontPair {
  const exact = findPair(display, body);
  if (exact) return exact;
  return preferredFont(direction);
}

const editorialFonts = preferredFont("editorial");
const editorialColors = preferredPalette("editorial");
const editorialSchool = SCHOOLS.editorial;

export const DEFAULT_TOKENS: StyleTokens = {
  productName: "Сайт услуг",
  audience: "клиенты из России",
  direction: "editorial",
  paletteId: editorialColors.id,
  fontPairId: editorialFonts.id,
  accent: editorialColors.accent,
  bg: editorialColors.bg,
  text: editorialColors.text,
  muted: editorialColors.muted,
  border: editorialColors.border,
  fontDisplay: editorialFonts.display,
  fontBody: editorialFonts.body,
  fontMono: editorialFonts.mono,
  radius: editorialSchool.radius,
  buttonStyle: editorialSchool.buttonStyle,
  buttonHeight: editorialSchool.buttonHeight,
  density: editorialSchool.density,
  gridColumns: editorialSchool.layout.columns,
  maxWidth: editorialSchool.layout.maxWidth,
};

export function applyFontPair(tokens: StyleTokens, pair: FontPair): StyleTokens {
  return {
    ...tokens,
    fontPairId: pair.id,
    fontDisplay: pair.display,
    fontBody: pair.body,
    fontMono: pair.mono,
  };
}

export function applySchool(
  prev: StyleTokens,
  direction: StyleDirection,
  opts?: { keepColors?: boolean },
): StyleTokens {
  const school = SCHOOLS[direction];
  const fonts = preferredFont(direction);
  const colors = preferredPalette(direction);
  return {
    ...prev,
    direction,
    fontPairId: fonts.id,
    fontDisplay: fonts.display,
    fontBody: fonts.body,
    fontMono: fonts.mono,
    radius: school.radius,
    density: school.density,
    buttonStyle: school.buttonStyle,
    buttonHeight: school.buttonHeight,
    gridColumns: school.layout.columns,
    maxWidth: school.layout.maxWidth,
    ...(opts?.keepColors
      ? {}
      : {
          paletteId: colors.id,
          bg: colors.bg,
          text: colors.text,
          muted: colors.muted,
          border: colors.border,
          accent: colors.accent,
        }),
  };
}
