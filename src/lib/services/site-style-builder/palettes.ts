import type { ColorPair, StyleDirection, StyleTokens } from "./types";

/** Готовые цветовые системы: фон + текст + бордер + акцент подобраны вместе. */
export const COLOR_PAIRS: ColorPair[] = [
  {
    id: "paper-wine",
    name: "Бумага и вино",
    note: "Журнал: тёплая бумага, чернила, винный акцент",
    bg: "#F3EEE4",
    text: "#1C1916",
    muted: "#6B645C",
    border: "#D8CFC2",
    accent: "#8B2E2E",
    suits: ["editorial"],
  },
  {
    id: "newsprint",
    name: "Газета",
    note: "Журнал: newsprint, акцент = чернила",
    bg: "#F6F3EA",
    text: "#1A1A1A",
    muted: "#6E6A60",
    border: "#E0DACB",
    accent: "#1A1A1A",
    suits: ["editorial"],
  },
  {
    id: "night-desk",
    name: "Ночной стол",
    note: "Журнал: тёмный longread, латунный акцент",
    bg: "#141210",
    text: "#F2EBE0",
    muted: "#A3988A",
    border: "#2C2722",
    accent: "#C4A36A",
    suits: ["editorial"],
  },
  {
    id: "gallery",
    name: "Галерея",
    note: "Журнал: белая стена, тёплый металл",
    bg: "#F7F7F4",
    text: "#1B1B18",
    muted: "#6F6F68",
    border: "#E4E4DC",
    accent: "#9A7B4F",
    suits: ["editorial"],
  },
  {
    id: "swiss-red",
    name: "Swiss red",
    note: "Международный стиль: серый лист, сигнал красный",
    bg: "#FAFAF9",
    text: "#111111",
    muted: "#8C8C80",
    border: "#D4D4CC",
    accent: "#E5533C",
    suits: ["swiss"],
  },
  {
    id: "swiss-black",
    name: "Swiss black",
    note: "Только гротеск, волосяная линия, без цветного акцента",
    bg: "#FFFFFF",
    text: "#0A0A0A",
    muted: "#6E6E6E",
    border: "#E5E5E0",
    accent: "#0A0A0A",
    suits: ["swiss"],
  },
  {
    id: "swiss-blue",
    name: "Basel blue",
    note: "Плакат Müller-Brockmann: холодный лист, прусский синий",
    bg: "#F3F4F2",
    text: "#121212",
    muted: "#7A7A74",
    border: "#D0D0C8",
    accent: "#1A4A8A",
    suits: ["swiss"],
  },
  {
    id: "swiss-orange",
    name: "Poster orange",
    note: "Стройка/плакат: серый бетон, оранжевый сигнал",
    bg: "#F2F1EE",
    text: "#111111",
    muted: "#8A887E",
    border: "#D2D0C8",
    accent: "#E25B2A",
    suits: ["swiss"],
  },
  {
    id: "product-teal",
    name: "Продукт, тихий теал",
    note: "Спокойный SaaS, один акцент",
    bg: "#FAFAF7",
    text: "#161616",
    muted: "#6B6B64",
    border: "#E4E1D8",
    accent: "#0F766E",
    suits: ["product-minimal"],
  },
  {
    id: "product-stone",
    name: "Камень",
    note: "Нейтральный продукт без «AI-зелёного»",
    bg: "#F5F5F4",
    text: "#1C1917",
    muted: "#78716C",
    border: "#E7E5E4",
    accent: "#44403C",
    suits: ["product-minimal"],
  },
  {
    id: "bold-ink",
    name: "Плакат на бумаге",
    note: "Громкий оффер, чёрная заливка",
    bg: "#FFF8EE",
    text: "#111111",
    muted: "#6B645C",
    border: "#111111",
    accent: "#111111",
    suits: ["bold-marketing"],
  },
  {
    id: "bold-signal",
    name: "Сигнал в ночи",
    note: "Тёмный фон, один ядовитый акцент",
    bg: "#0F0F0F",
    text: "#F5F0E8",
    muted: "#A39E94",
    border: "#2A2A2A",
    accent: "#FF5A1F",
    suits: ["bold-marketing"],
  },
  {
    id: "glass-night",
    name: "Стекло ночь",
    note: "Одна матовая поверхность, не три карточки",
    bg: "#0B1220",
    text: "#F4F7FB",
    muted: "#9AA7B8",
    border: "#2A3A50",
    accent: "#7EB8FF",
    suits: ["glass"],
  },
  {
    id: "glass-day",
    name: "Стекло день",
    note: "Светлое стекло, холодный акцент",
    bg: "#E8EEF4",
    text: "#0F172A",
    muted: "#5B6B7C",
    border: "#C5D0DC",
    accent: "#1D4E89",
    suits: ["glass"],
  },
  {
    id: "luxury-gold",
    name: "Премиум золото",
    note: "Тёмный кабинет, золотая волосяная линия",
    bg: "#12100C",
    text: "#F3EDE3",
    muted: "#A39888",
    border: "#3A342A",
    accent: "#C4A36A",
    suits: ["luxury"],
  },
  {
    id: "luxury-ivory",
    name: "Слоновая кость",
    note: "Светлый люкс, чернила и латунь",
    bg: "#F6F0E4",
    text: "#1A1410",
    muted: "#7A6E60",
    border: "#D9CFBE",
    accent: "#8A6A32",
    suits: ["luxury"],
  },
  {
    id: "techno-cyan",
    name: "Техно циан",
    note: "Уголь и один сигнал. Не фиолетовый киберпанк",
    bg: "#0A0E12",
    text: "#D7F5EE",
    muted: "#7A9A94",
    border: "#1C2A2E",
    accent: "#2EE6A6",
    suits: ["techno"],
  },
  {
    id: "techno-amber",
    name: "Техно янтарь",
    note: "Терминал, янтарный курсор",
    bg: "#111111",
    text: "#F5F0E8",
    muted: "#8A8680",
    border: "#2A2A2A",
    accent: "#F5A524",
    suits: ["techno"],
  },
  {
    id: "poster-red",
    name: "Афиша красная",
    note: "Две краски: бумага и сигнал",
    bg: "#F4EDE4",
    text: "#111111",
    muted: "#6E6A64",
    border: "#111111",
    accent: "#C41E3A",
    suits: ["poster"],
  },
  {
    id: "poster-ink",
    name: "Афиша инверсия",
    note: "Чёрное поле, одна светлая краска",
    bg: "#111111",
    text: "#F5F0E8",
    muted: "#9A958C",
    border: "#F5F0E8",
    accent: "#F5F0E8",
    suits: ["poster"],
  },
];

export function palettesFor(direction: StyleDirection): ColorPair[] {
  return COLOR_PAIRS.filter((pair) => pair.suits.includes(direction));
}

export function findPalette(id: string): ColorPair | undefined {
  return COLOR_PAIRS.find((pair) => pair.id === id);
}

export function preferredPalette(direction: StyleDirection): ColorPair {
  return palettesFor(direction)[0] ?? COLOR_PAIRS[0];
}

export function matchPalette(tokens: Pick<StyleTokens, "bg" | "text" | "border" | "accent">): ColorPair | undefined {
  return COLOR_PAIRS.find(
    (pair) =>
      pair.bg.toLowerCase() === tokens.bg.toLowerCase() &&
      pair.text.toLowerCase() === tokens.text.toLowerCase() &&
      pair.border.toLowerCase() === tokens.border.toLowerCase() &&
      pair.accent.toLowerCase() === tokens.accent.toLowerCase(),
  );
}

export function applyColorPair(tokens: StyleTokens, pair: ColorPair): StyleTokens {
  return {
    ...tokens,
    paletteId: pair.id,
    bg: pair.bg,
    text: pair.text,
    muted: pair.muted,
    border: pair.border,
    accent: pair.accent,
  };
}

export function fallbackMuted(bg: string): string {
  const hex = bg.replace("#", "");
  if (hex.length < 6) return "#6B645C";
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  const luma = (r * 299 + g * 587 + b * 114) / 1000;
  return luma < 140 ? "#A3988A" : "#6B645C";
}
