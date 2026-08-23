import { ICON_SVG } from "./icons";

export interface CategoryTheme {
  from: string; // градиент — начало
  to: string; // градиент — конец
  accent: string; // акцент (узлы, линии, подписи)
  icon: string; // ключ иконки в ICON_SVG
}

// Категории → цветовая тема + иконка (свой цвет на каждую тему)
const THEMES: Record<string, CategoryTheme> = {
  "авито": { from: "#0f766e", to: "#134e4a", accent: "#5eead4", icon: "store" },
  "ai": { from: "#312e81", to: "#1e1b4b", accent: "#818cf8", icon: "brain" },
  "ии": { from: "#312e81", to: "#1e1b4b", accent: "#818cf8", icon: "brain" },
  "нейросети": { from: "#312e81", to: "#1e1b4b", accent: "#818cf8", icon: "brain" },
  "ai-инжиниринг": { from: "#4c1d95", to: "#2e1065", accent: "#a78bfa", icon: "sparkles" },
  "инжиниринг": { from: "#4c1d95", to: "#2e1065", accent: "#a78bfa", icon: "sparkles" },
  "разработка": { from: "#0c4a6e", to: "#082f49", accent: "#38bdf8", icon: "code" },
  "development": { from: "#0c4a6e", to: "#082f49", accent: "#38bdf8", icon: "code" },
  "маркетплейсы": { from: "#7c2d12", to: "#431407", accent: "#fb923c", icon: "shopping-cart" },
  "e-commerce": { from: "#7c2d12", to: "#431407", accent: "#fb923c", icon: "shopping-cart" },
  "дизайн": { from: "#831843", to: "#500724", accent: "#f472b6", icon: "palette" },
  "модели": { from: "#14532d", to: "#052e16", accent: "#4ade80", icon: "layers" },
  "боты": { from: "#1e3a8a", to: "#172554", accent: "#60a5fa", icon: "bot" },
};

const DEFAULT_THEME: CategoryTheme = { from: "#0fb880", to: "#098a5e", accent: "#6ee7b7", icon: "compass" };

export function themeFor(category?: string): CategoryTheme {
  if (!category) return DEFAULT_THEME;
  const key = category.toLowerCase().trim();
  for (const [k, v] of Object.entries(THEMES)) {
    if (key.includes(k)) return v;
  }
  return DEFAULT_THEME;
}

export function iconMarkup(name: string): string {
  return ICON_SVG[name] || ICON_SVG["compass"] || "";
}
