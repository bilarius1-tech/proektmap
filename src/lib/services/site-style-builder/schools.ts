import type { Density, StyleDirection, StyleTokens, TypeScale } from "./types";

export interface SchoolSpec {
  id: StyleDirection;
  shortLabel: string;
  label: string;
  thesis: string;
  radius: number;
  density: Density;
  buttonStyle: StyleTokens["buttonStyle"];
  buttonHeight: number;
  typeScale: TypeScale;
  layout: {
    columns: number;
    maxWidth: number;
    align: "left" | "center";
    hairline: boolean;
    shadows: boolean;
    uppercaseUi: boolean;
    blur: boolean;
  };
  composition: string[];
  bans: string[];
}

export const SCHOOLS: Record<StyleDirection, SchoolSpec> = {
  editorial: {
    id: "editorial",
    shortLabel: "Журнал",
    label: "Editorial — журнальная колонка",
    thesis:
      "Сильная антиква, кикер капсом, колонка ~38ch, один визуальный якорь. Это журнал, не сетка карточек.",
    radius: 2,
    density: "airy",
    buttonStyle: "outline",
    buttonHeight: 44,
    typeScale: {
      kicker: { size: 11, tracking: "0.14em", transform: "uppercase" },
      display: { size: 42, weight: 600, line: 1.08, tracking: "-0.02em" },
      body: { size: 17, line: 1.65, measure: "38em" },
    },
    layout: {
      columns: 8,
      maxWidth: 720,
      align: "left",
      hairline: true,
      shadows: false,
      uppercaseUi: false,
      blur: false,
    },
    composition: [
      "Кикер 11px / tracking 0.14em / uppercase над заголовком.",
      "Display-антиква 42px, вес 600, не жирный плакат.",
      "Текст в колонке max 38em, drop-cap только у первого абзаца.",
      "Один фото-плат или цитата с волосяной линейкой слева.",
      "Кнопка контуром, радиус 2px. Hero без feature-карточек.",
    ],
    bans: [
      "Сетка из 3–4 одинаковых карточек в первом экране",
      "Скругление > 4px, тени, стекло, фиолетовый градиент",
      "Inter / Roboto / Arial / Space Grotesk",
      "Центрированный маркетинговый оффер на всю ширину",
    ],
  },
  swiss: {
    id: "swiss",
    shortLabel: "Swiss",
    label: "Swiss — международный стиль",
    thesis:
      "Один гротеск, модульная сетка, волосяная линия, кикер капсом, радиус 0. Акцент — сигнал, не градиент.",
    radius: 0,
    density: "compact",
    buttonStyle: "fill",
    buttonHeight: 44,
    typeScale: {
      kicker: { size: 11, tracking: "0.12em", transform: "uppercase" },
      display: { size: 52, weight: 800, line: 1.02, tracking: "-0.03em" },
      body: { size: 15, line: 1.7, measure: "36em" },
    },
    layout: {
      columns: 12,
      maxWidth: 1100,
      align: "left",
      hairline: true,
      shadows: false,
      uppercaseUi: true,
      blur: false,
    },
    composition: [
      "Сетка 12 колонок, max-width 1100, всё по левому краю.",
      "Один гротеск на заголовок и текст; цифры можно моно.",
      "Кикер uppercase, заголовок 52px / 800 / tracking -0.03em.",
      "Волосяные линейки 1px вместо теней и карточек.",
      "Кнопка заливка чернилами или акцентом, радиус 0, без pill.",
    ],
    bans: [
      "Скруглённые карточки, drop-shadow, blur, градиенты",
      "Второй display-шрифт «для красоты»",
      "Центрированный hero и «три преимущества»",
      "Inter / Roboto / Arial как «нейтральный гротеск»",
    ],
  },
  "product-minimal": {
    id: "product-minimal",
    shortLabel: "Продукт",
    label: "Product-minimal — спокойный продукт",
    thesis: "Плотная иерархия продукта, спокойный акцент, без маркетингового крика.",
    radius: 8,
    density: "compact",
    buttonStyle: "fill",
    buttonHeight: 40,
    typeScale: {
      kicker: { size: 11, tracking: "0.08em", transform: "uppercase" },
      display: { size: 28, weight: 700, line: 1.15, tracking: "-0.02em" },
      body: { size: 15, line: 1.55, measure: "40em" },
    },
    layout: {
      columns: 12,
      maxWidth: 1120,
      align: "left",
      hairline: false,
      shadows: false,
      uppercaseUi: false,
      blur: false,
    },
    composition: [
      "Заголовок продукта 28px, не журнальная шапка.",
      "Форма и кнопка в одном ритме, радиус 8px.",
      "Один акцент на CTA и ссылках, не на фоне.",
      "Карточка — поверхность, не витрина.",
    ],
    bans: [
      "Маркетинговый крик, неоновый градиент",
      "Inter как единственный шрифт без характера",
      "Карточки внутри карточек",
    ],
  },
  "bold-marketing": {
    id: "bold-marketing",
    shortLabel: "Оффер",
    label: "Bold-marketing — громкий оффер",
    thesis: "Крупный оффер, высокий контраст, одна CTA. Не фиолетовый AI-градиент.",
    radius: 4,
    density: "airy",
    buttonStyle: "fill",
    buttonHeight: 52,
    typeScale: {
      kicker: { size: 12, tracking: "0.16em", transform: "uppercase" },
      display: { size: 48, weight: 800, line: 1.02, tracking: "-0.03em" },
      body: { size: 16, line: 1.5, measure: "34em" },
    },
    layout: {
      columns: 8,
      maxWidth: 900,
      align: "left",
      hairline: false,
      shadows: false,
      uppercaseUi: true,
      blur: false,
    },
    composition: [
      "Оффер занимает первый экран, одна CTA.",
      "Контраст текст/фон максимальный, акцент один.",
      "Кнопка высокая (52px), без ghost-вторичных.",
    ],
    bans: [
      "Фиолетовый градиент «из коробки»",
      "Hero из трёх карточек фич",
      "Мелкий серый текст на цветном фоне",
    ],
  },
  glass: {
    id: "glass",
    shortLabel: "Стекло",
    label: "Glass — одна матовая поверхность",
    thesis:
      "Один слой стекла (blur 16px), 1px кромка, тёмный или холодный холст. Не три стеклянные карточки.",
    radius: 16,
    density: "airy",
    buttonStyle: "outline",
    buttonHeight: 44,
    typeScale: {
      kicker: { size: 11, tracking: "0.14em", transform: "uppercase" },
      display: { size: 36, weight: 600, line: 1.12, tracking: "-0.02em" },
      body: { size: 16, line: 1.55, measure: "36em" },
    },
    layout: {
      columns: 12,
      maxWidth: 1080,
      align: "left",
      hairline: true,
      shadows: false,
      uppercaseUi: false,
      blur: true,
    },
    composition: [
      "Одна стеклянная панель на экран, backdrop-filter 16px, кромка 1px.",
      "Холст сплошной, не градиент «aurora».",
      "Кнопка контуром по стеклу, радиус 16px максимум.",
      "Сетка 12, контент в панели, не россыпь карточек.",
    ],
    bans: [
      "Три одинаковые glass-карточки в hero",
      "Фиолетовый/розовый градиент, неон по всему экрану",
      "blur > 24px, стекло на каждом блоке",
      "Inter и «frosted everything»",
    ],
  },
  luxury: {
    id: "luxury",
    shortLabel: "Золото",
    label: "Luxury — премиум, латунь, не блёстки",
    thesis:
      "Тёмный или слоновая кость, антиква, золото только линией и кикером. Не градиентный glitter.",
    radius: 0,
    density: "airy",
    buttonStyle: "outline",
    buttonHeight: 48,
    typeScale: {
      kicker: { size: 11, tracking: "0.18em", transform: "uppercase" },
      display: { size: 44, weight: 500, line: 1.08, tracking: "-0.01em" },
      body: { size: 16, line: 1.7, measure: "38em" },
    },
    layout: {
      columns: 8,
      maxWidth: 860,
      align: "left",
      hairline: true,
      shadows: false,
      uppercaseUi: true,
      blur: false,
    },
    composition: [
      "Кикер капсом цветом латуни, заголовок антиквой 44/500.",
      "Золото — 1px линия и текст кикера, не заливка кнопки.",
      "Мрамор/фольга запрещены. Воздух большой.",
      "Кнопка контур латунью, радиус 0.",
    ],
    bans: [
      "Золотой градиент на тексте, блёстки, стоковый мрамор",
      "Скруглённые luxury-карточки с тенью",
      "Inter, Script-шрифты, «elegance» сток",
    ],
  },
  techno: {
    id: "techno",
    shortLabel: "Техно",
    label: "Techno — терминал, один сигнал",
    thesis:
      "Уголь, гротеск + моно на цифрах, одна сигнальная краска (циан или янтарь). Не фиолетовый киберпанк.",
    radius: 0,
    density: "compact",
    buttonStyle: "fill",
    buttonHeight: 40,
    typeScale: {
      kicker: { size: 11, tracking: "0.16em", transform: "uppercase" },
      display: { size: 36, weight: 700, line: 1.08, tracking: "-0.03em" },
      body: { size: 14, line: 1.55, measure: "40em" },
    },
    layout: {
      columns: 12,
      maxWidth: 1120,
      align: "left",
      hairline: true,
      shadows: false,
      uppercaseUi: true,
      blur: false,
    },
    composition: [
      "Сетка 12, волосяная модульная линия, цифры моно.",
      "Один сигнал: циан или янтарь. Фон уголь.",
      "Кнопка заливка сигнала, радиус 0, высота 40.",
      "Кикер моно/капс. Без неона на каждом слове.",
    ],
    bans: [
      "Фиолетовый киберпанк, scanline-гиф, 3 неоновые кнопки",
      "Стекло + неон вместе",
      "Inter, Orbitron, «HUD» декорации",
    ],
  },
  poster: {
    id: "poster",
    shortLabel: "Афиша",
    label: "Poster — две краски, крупный шрифт",
    thesis:
      "Как печатная афиша: две краски, конденсат, радиус 0, один оффер. Не коллаж стока.",
    radius: 0,
    density: "airy",
    buttonStyle: "fill",
    buttonHeight: 52,
    typeScale: {
      kicker: { size: 12, tracking: "0.2em", transform: "uppercase" },
      display: { size: 56, weight: 800, line: 0.95, tracking: "-0.04em" },
      body: { size: 16, line: 1.4, measure: "28em" },
    },
    layout: {
      columns: 6,
      maxWidth: 800,
      align: "left",
      hairline: false,
      shadows: false,
      uppercaseUi: true,
      blur: false,
    },
    composition: [
      "Заголовок 56/800, почти без интерлиньяжа, как плакат.",
      "Две краски: бумага и сигнал (или инверсия).",
      "Одна CTA на всю ширину колонки, радиус 0.",
      "Без фото-коллажа и без третьего шрифта.",
    ],
    bans: [
      "Пять шрифтов, стоковый коллаж, тени",
      "Фиолетовый градиент, 3 карточки фич",
      "Inter / Roboto",
    ],
  },
};

export function typeScaleFor(direction: StyleDirection, density: Density): TypeScale {
  const base = SCHOOLS[direction].typeScale;
  const k = density === "compact" ? 0.92 : 1;
  return {
    kicker: base.kicker,
    display: { ...base.display, size: Math.round(base.display.size * k) },
    body: base.body,
  };
}

