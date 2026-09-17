import type { CSSProperties, ReactNode } from "react";
import { spacingFor } from "@/lib/services/site-style-builder/defaults";
import { SCHOOLS, typeScaleFor } from "@/lib/services/site-style-builder/schools";
import type { DesignSystemSnapshot, StyleTokens } from "@/lib/services/site-style-builder/types";

export function googleHrefForFamilies(names: string[]): string {
  const skip = /^(times new roman|times|georgia|arial|helvetica|serif|sans-serif|system-ui|-apple-system)$/i;
  const uniq = [...new Set(names.map((name) => name.trim()).filter((name) => name && !skip.test(name)))];
  if (uniq.length === 0) return "";
  const query = uniq
    .map((name) => `family=${encodeURIComponent(name)}:wght@400;500;600;700`)
    .join("&");
  return `https://fonts.googleapis.com/css2?${query}&display=swap`;
}

const ROLES: Array<{ key: keyof Pick<StyleTokens, "bg" | "text" | "muted" | "border" | "accent">; label: string }> = [
  { key: "bg", label: "Фон" },
  { key: "text", label: "Текст" },
  { key: "muted", label: "Приглушённый" },
  { key: "border", label: "Бордер" },
  { key: "accent", label: "Акцент" },
];

export function DesignSystemPreview({
  tokens,
  system,
  sourceUrl,
}: {
  tokens: StyleTokens;
  system: DesignSystemSnapshot | null;
  sourceUrl?: string | null;
}) {
  const scale = typeScaleFor(tokens.direction, tokens.density);
  const space = spacingFor(tokens.density);
  const fonts = system?.fonts?.length ? system.fonts : [tokens.fontDisplay, tokens.fontBody].filter(Boolean);
  const displayName = fonts[0] || tokens.fontDisplay;
  const bodyName = fonts[1] || fonts[0] || tokens.fontBody;
  const displayFamily = `"${displayName}", system-ui, sans-serif`;
  const bodyFamily = `"${bodyName}", system-ui, sans-serif`;
  const palette = mergePalette(tokens, system);
  const radii = system?.radii?.length ? system.radii : [tokens.radius];
  const typeScale = system?.typeScale?.length
    ? system.typeScale
    : [scale.display.size, 22, scale.body.size, scale.kicker.size];
  const host = hostOf(sourceUrl);
  const heading = system?.heading || tokens.productName;

  const fillBtn: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: tokens.buttonHeight,
    padding: "0 16px",
    borderRadius: tokens.radius,
    border: `1px solid ${tokens.accent}`,
    background: tokens.accent,
    color: tokens.bg,
    fontFamily: bodyFamily,
    fontWeight: 700,
    fontSize: 13,
  };
  const ghostBtn: CSSProperties = {
    ...fillBtn,
    background: "transparent",
    color: tokens.accent,
  };

  return (
    <section
      className="site-style-kit site-style-ds"
      style={{
        background: tokens.bg,
        color: tokens.text,
        border: `1px solid ${tokens.border}`,
        borderRadius: Math.min(16, Math.max(0, tokens.radius)),
        padding: space.l,
        display: "grid",
        gap: space.m,
        minWidth: 0,
      }}
    >
      <header style={{ display: "grid", gap: 4 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: tokens.muted,
            fontFamily: bodyFamily,
          }}
        >
          Дизайн-система{host ? ` · ${host}` : ` · ${SCHOOLS[tokens.direction].shortLabel}`}
        </span>
        <strong style={{ fontFamily: displayFamily, fontSize: 18, lineHeight: 1.2 }}>{heading}</strong>
      </header>

      <div>
        <RowLabel color={tokens.muted}>Цвета</RowLabel>
        <div className="site-style-ds-swatches">
          {palette.map((item) => (
            <div key={`${item.hex}-${item.label}`} className="site-style-ds-swatch">
              <span style={{ background: item.hex, border: `1px solid ${tokens.border}` }} />
              <em>{item.label}</em>
              <code>{item.hex}</code>
            </div>
          ))}
        </div>
      </div>

      <div>
        <RowLabel color={tokens.muted}>Шрифты</RowLabel>
        <p
          style={{
            margin: "0 0 8px",
            fontFamily: displayFamily,
            fontSize: `clamp(22px, 4vw, ${typeScale[0] || scale.display.size}px)`,
            lineHeight: 1.15,
            fontWeight: 600,
          }}
        >
          {displayName}
        </p>
        <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: 1.5, color: tokens.muted }}>
          {bodyName}. Колонка {tokens.maxWidth}px, {tokens.gridColumns} колонок. Агент читает эти значения, а не
          картинку.
        </p>
        <div className="site-style-ds-scale">
          {fonts.map((font) => (
            <span key={font} style={{ fontFamily: `"${font}", sans-serif` }}>
              {font}
            </span>
          ))}
        </div>
        <div className="site-style-ds-scale">
          {typeScale.map((size) => (
            <span key={size} style={{ fontFamily: displayFamily, fontSize: Math.min(size, 28) }}>
              {size}
            </span>
          ))}
        </div>
      </div>

      <div>
        <RowLabel color={tokens.muted}>Форма</RowLabel>
        <div className="site-style-ds-scale">
          {radii.map((radius) => (
            <span
              key={radius}
              style={{
                width: 44,
                height: 32,
                border: `1px solid ${tokens.border}`,
                background: tokens.bg,
                borderRadius: radius,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontFamily: bodyFamily,
              }}
            >
              {radius}
            </span>
          ))}
          <span style={{ fontSize: 12, color: tokens.muted, fontFamily: bodyFamily }}>
            отступ {space.m}px · кнопка {tokens.buttonHeight}px
          </span>
        </div>
      </div>

      <div>
        <RowLabel color={tokens.muted}>Атомы</RowLabel>
        <div className="site-style-ds-atoms">
          <span style={fillBtn}>Кнопка</span>
          <span style={ghostBtn}>Контур</span>
          <span
            style={{
              height: tokens.buttonHeight,
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius,
              padding: "0 12px",
              display: "inline-flex",
              alignItems: "center",
              color: tokens.muted,
              fontFamily: bodyFamily,
              fontSize: 13,
              minWidth: 120,
            }}
          >
            Поле ввода
          </span>
          <span
            style={{
              border: `1px solid ${tokens.border}`,
              borderRadius: tokens.radius,
              padding: "10px 12px",
              fontFamily: bodyFamily,
              fontSize: 12,
              color: tokens.text,
            }}
          >
            Карточка · accent {tokens.accent}
          </span>
        </div>
      </div>

      <div>
        <RowLabel color={tokens.muted}>Сетка {tokens.gridColumns} · {tokens.maxWidth}px</RowLabel>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(tokens.gridColumns, 12)}, minmax(0, 1fr))`,
            gap: 4,
          }}
        >
          {Array.from({ length: Math.min(tokens.gridColumns, 12) }).map((_, index) => (
            <span key={index} style={{ height: 10, background: tokens.accent, opacity: index === 0 ? 1 : 0.28 }} />
          ))}
        </div>
      </div>
    </section>
  );
}

function RowLabel({ children, color }: { children: ReactNode; color: string }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  );
}

function mergePalette(tokens: StyleTokens, system: DesignSystemSnapshot | null) {
  const semantic = ROLES.map((role) => ({ hex: tokens[role.key].toUpperCase(), label: role.label }));
  const extra = (system?.palette || [])
    .map((hex) => hex.toUpperCase())
    .filter((hex) => !semantic.some((item) => item.hex === hex))
    .map((hex) => ({ hex, label: "С сайта" }));
  return [...semantic, ...extra].slice(0, 12);
}

function hostOf(url?: string | null) {
  if (!url) return "";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
