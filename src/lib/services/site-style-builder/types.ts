export type StyleDirection =
  | "editorial"
  | "swiss"
  | "glass"
  | "luxury"
  | "techno"
  | "poster"
  | "product-minimal"
  | "bold-marketing";

export type ButtonStyle = "fill" | "outline";
export type Density = "compact" | "airy";

export const STYLE_DIRECTIONS: StyleDirection[] = [
  "editorial",
  "swiss",
  "glass",
  "luxury",
  "techno",
  "poster",
  "product-minimal",
  "bold-marketing",
];

export interface StyleTokens {
  productName: string;
  audience: string;
  direction: StyleDirection;
  paletteId: string;
  fontPairId: string;
  accent: string;
  bg: string;
  text: string;
  muted: string;
  border: string;
  fontDisplay: string;
  fontBody: string;
  fontMono?: string;
  radius: number;
  buttonStyle: ButtonStyle;
  buttonHeight: number;
  density: Density;
  gridColumns: number;
  maxWidth: number;
}

export interface FontPair {
  id: string;
  display: string;
  body: string;
  mono?: string;
  googleHref: string;
  suits: StyleDirection[];
  note: string;
}

export interface ColorPair {
  id: string;
  name: string;
  note: string;
  bg: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
  suits: StyleDirection[];
}

export interface TypeScale {
  kicker: { size: number; tracking: string; transform: "uppercase" | "none" };
  display: { size: number; weight: number; line: number; tracking: string };
  body: { size: number; line: number; measure: string };
}

export interface DesignSystemSnapshot {
  palette: string[];
  fonts: string[];
  typeScale: number[];
  radii: number[];
  heading?: string | null;
}

export interface ExtractedStyle {
  tokens: Partial<StyleTokens>;
  sourceUrl: string;
  warnings: string[];
  suggestedDirection?: StyleDirection;
  grid?: { columns: number; maxWidth: number };
  evidenceNote?: string;
  system?: DesignSystemSnapshot;
}
