export type SiteKind = "landing" | "multipage" | "product";

export interface StyleSeed {
  bg: string;
  text: string;
  muted: string;
  accent: string;
  border: string;
  fontDisplay: string;
  fontBody: string;
  radius: number;
  maxWidth: number;
  buttonHeight: number;
  sourceUrl?: string;
}

export interface TemplateInput {
  productName: string;
  audience: string;
  offer: string;
  action: string;
  leadTo: string;
  idea: string;
  refs: string;
  constraints: string;
  kind: SiteKind;
  style?: StyleSeed | null;
}

export interface TemplateDossier {
  productName: string;
  slug: string;
  kind: SiteKind;
  briefMd: string;
  designMd: string;
  sitemapMd: string;
  referencesMd: string;
  handoffMd: string;
  tokensCss: string;
  cursorPrompt: string;
  warnings: string[];
}

export const KIND_LABELS: Record<SiteKind, string> = {
  landing: "Одна главная",
  multipage: "Несколько страниц",
  product: "Продуктовый сайт",
};
