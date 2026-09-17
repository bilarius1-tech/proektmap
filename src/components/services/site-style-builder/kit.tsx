import type { CSSProperties } from "react";
import { spacingFor } from "@/lib/services/site-style-builder/defaults";
import { SCHOOLS, typeScaleFor } from "@/lib/services/site-style-builder/schools";
import type { FontPair, StyleTokens } from "@/lib/services/site-style-builder/types";

export function KitPreview({ tokens, pair }: { tokens: StyleTokens; pair: FontPair }) {
  const school = SCHOOLS[tokens.direction];
  const scale = typeScaleFor(tokens.direction, tokens.density);
  const space = spacingFor(tokens.density);
  const displayFamily = `"${tokens.fontDisplay}", ${tokens.direction === "editorial" || tokens.direction === "luxury" ? "serif" : "sans-serif"}`;
  const bodyFamily = `"${tokens.fontBody}", sans-serif`;
  const monoFamily = `"${pair.mono || tokens.fontMono || tokens.fontBody}", ui-monospace, monospace`;
  const displaySize = `clamp(26px, 5vw, ${scale.display.size}px)`;

  const kitButton: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    height: tokens.buttonHeight,
    padding: "0 18px",
    borderRadius: tokens.radius,
    border: `1px solid ${tokens.direction === "swiss" || tokens.direction === "poster" ? tokens.text : tokens.accent}`,
    background:
      tokens.buttonStyle === "fill"
        ? tokens.direction === "swiss"
          ? tokens.text
          : tokens.accent
        : "transparent",
    color: tokens.buttonStyle === "fill" ? tokens.bg : tokens.accent,
    fontFamily: bodyFamily,
    fontWeight: 700,
    fontSize: tokens.direction === "swiss" || tokens.direction === "techno" ? 12 : 14,
    letterSpacing: school.layout.uppercaseUi ? "0.06em" : "0",
    textTransform: school.layout.uppercaseUi ? "uppercase" : "none",
    cursor: "default",
  };

  return (
    <section
      className="site-style-kit"
      style={{
        background: tokens.bg,
        color: tokens.text,
        border: `1px solid ${tokens.border}`,
        borderRadius: tokens.radius > 8 ? 16 : tokens.direction === "swiss" || tokens.direction === "poster" ? 0 : 12,
        padding: space.l,
        display: "grid",
        gap: space.m,
        minHeight: 380,
        minWidth: 0,
        overflow: "hidden",
        backgroundImage:
          tokens.direction === "techno"
            ? `linear-gradient(${tokens.border} 1px, transparent 1px), linear-gradient(90deg, ${tokens.border} 1px, transparent 1px)`
            : undefined,
        backgroundSize: tokens.direction === "techno" ? "32px 32px" : undefined,
      }}
    >
      <span
        style={{
          fontSize: scale.kicker.size,
          fontWeight: 700,
          letterSpacing: scale.kicker.tracking,
          textTransform: scale.kicker.transform,
          color: tokens.muted,
          fontFamily: tokens.direction === "techno" || tokens.direction === "swiss" ? monoFamily : bodyFamily,
        }}
      >
        Кит · {school.shortLabel} · сетка {tokens.gridColumns} · {tokens.maxWidth}px
      </span>

      {tokens.direction === "swiss" ? (
        <SwissKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} monoFamily={monoFamily} scale={scale} displaySize={displaySize} />
      ) : tokens.direction === "editorial" ? (
        <MagazineKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} scale={scale} space={space} displaySize={displaySize} />
      ) : tokens.direction === "glass" ? (
        <GlassKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} scale={scale} displaySize={displaySize} />
      ) : tokens.direction === "luxury" ? (
        <LuxuryKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} scale={scale} displaySize={displaySize} />
      ) : tokens.direction === "techno" ? (
        <TechnoKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} monoFamily={monoFamily} scale={scale} displaySize={displaySize} />
      ) : tokens.direction === "poster" ? (
        <PosterKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} scale={scale} displaySize={displaySize} />
      ) : (
        <ProductKit tokens={tokens} kitButton={kitButton} displayFamily={displayFamily} bodyFamily={bodyFamily} scale={scale} space={space} displaySize={displaySize} />
      )}
    </section>
  );
}

function Heading({
  text,
  displayFamily,
  scale,
  displaySize,
  accent,
}: {
  text: string;
  displayFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  displaySize: string;
  accent?: string;
}) {
  return (
    <h2
      style={{
        margin: 0,
        fontFamily: displayFamily,
        fontSize: displaySize,
        lineHeight: scale.display.line,
        letterSpacing: scale.display.tracking,
        fontWeight: scale.display.weight,
        overflowWrap: "anywhere",
        minWidth: 0,
      }}
    >
      {text}
      {accent ? <span style={{ color: accent }}>.</span> : null}
    </h2>
  );
}

function MagazineKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  scale,
  space,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  space: ReturnType<typeof spacingFor>;
  displaySize: string;
}) {
  return (
    <>
      <p
        style={{
          margin: 0,
          fontSize: scale.kicker.size,
          letterSpacing: scale.kicker.tracking,
          textTransform: "uppercase",
          color: tokens.accent,
          fontFamily: bodyFamily,
          fontWeight: 700,
        }}
      >
        {tokens.audience}
      </p>
      <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} />
      <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: scale.body.line, maxWidth: "38em" }}>
        Колонка держит меру. Агент читает DESIGN.md и не выдумывает hex.
      </p>
      <blockquote
        style={{
          margin: 0,
          padding: `${space.s}px 0 ${space.s}px ${space.m}px`,
          borderLeft: `2px solid ${tokens.accent}`,
          fontFamily: displayFamily,
          fontSize: 18,
          lineHeight: 1.35,
        }}
      >
        Принципы плотности, не копия чужого бренда.
      </blockquote>
      <span style={kitButton}>Читать материал</span>
    </>
  );
}

function SwissKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  monoFamily,
  scale,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  monoFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  displaySize: string;
}) {
  return (
    <>
      <div className="site-style-swiss-hero" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 0.8fr)", gap: 20 }}>
        <div style={{ minWidth: 0 }}>
          <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} accent={tokens.accent} />
          <p style={{ margin: "12px 0 0", fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: scale.body.line, color: tokens.muted }}>
            Модуль {tokens.gridColumns} колонок. Волосяная линия. Один гротеск.
          </p>
          <div style={{ marginTop: 16 }}>
            <span style={kitButton}>Начать путь</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            { n: String(tokens.gridColumns), l: "колонок" },
            { n: String(tokens.radius), l: "радиус" },
          ].map((item) => (
            <div key={item.l} style={{ minWidth: 0 }}>
              <div style={{ fontFamily: monoFamily, fontSize: "clamp(28px, 6vw, 48px)", fontWeight: 700, letterSpacing: "-0.04em", lineHeight: 1 }}>
                {item.n}
              </div>
              <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: tokens.muted, marginTop: 6, fontFamily: bodyFamily }}>
                {item.l}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="site-style-swiss-modules" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 1, background: tokens.border }}>
        {["Модуль", "Кикер", "Сигнал"].map((title) => (
          <div key={title} style={{ background: tokens.bg, padding: "14px 12px", minWidth: 0 }}>
            <div style={{ fontFamily: displayFamily, fontWeight: 700, fontSize: 14 }}>{title}</div>
            <div style={{ fontFamily: bodyFamily, fontSize: 12, color: tokens.muted, marginTop: 6 }}>Без тени. 1px.</div>
          </div>
        ))}
      </div>
    </>
  );
}

function GlassKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  scale,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  displaySize: string;
}) {
  return (
    <div
      style={{
        padding: 20,
        borderRadius: tokens.radius,
        border: `1px solid ${tokens.border}`,
        background: "rgba(255,255,255,0.08)",
        backdropFilter: "blur(16px)",
        display: "grid",
        gap: 12,
        minWidth: 0,
      }}
    >
      <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} />
      <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: scale.body.line, color: tokens.muted }}>
        Одна матовая панель. Не три стеклянные карточки.
      </p>
      <span style={kitButton}>Открыть</span>
    </div>
  );
}

function LuxuryKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  scale,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  displaySize: string;
}) {
  return (
    <>
      <div style={{ height: 1, background: tokens.accent, width: 48 }} />
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: tokens.accent, fontFamily: bodyFamily }}>
        {tokens.audience}
      </p>
      <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} />
      <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: 1.7, color: tokens.muted, maxWidth: "38em" }}>
        Латунь только линией. Без блёсток и стокового мрамора.
      </p>
      <span style={kitButton}>Запись</span>
    </>
  );
}

function TechnoKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  monoFamily,
  scale,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  monoFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  displaySize: string;
}) {
  return (
    <>
      <p style={{ margin: 0, fontFamily: monoFamily, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: tokens.accent }}>
        SYS / {tokens.gridColumns} COL
      </p>
      <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} />
      <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: 1.55, color: tokens.muted }}>
        Один сигнал. Цифры моно. Не фиолетовый киберпанк.
      </p>
      <span style={kitButton}>Run</span>
    </>
  );
}

function PosterKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  scale,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  displaySize: string;
}) {
  return (
    <>
      <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: bodyFamily, color: tokens.accent }}>
        Афиша
      </p>
      <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} />
      <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: 1.4, maxWidth: "28em" }}>
        Две краски. Крупный шрифт. Одна CTA.
      </p>
      <span style={{ ...kitButton, width: "100%" }}>Билет</span>
    </>
  );
}

function ProductKit({
  tokens,
  kitButton,
  displayFamily,
  bodyFamily,
  scale,
  space,
  displaySize,
}: {
  tokens: StyleTokens;
  kitButton: CSSProperties;
  displayFamily: string;
  bodyFamily: string;
  scale: ReturnType<typeof typeScaleFor>;
  space: ReturnType<typeof spacingFor>;
  displaySize: string;
}) {
  return (
    <>
      <Heading text={tokens.productName} displayFamily={displayFamily} scale={scale} displaySize={displaySize} />
      <p style={{ margin: 0, fontFamily: bodyFamily, fontSize: scale.body.size, lineHeight: scale.body.line, color: tokens.muted }}>
        Токены из DESIGN.md. Агент не выдумывает hex.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <span style={kitButton}>Главное действие</span>
        <input
          readOnly
          value="Поле ввода"
          style={{
            height: tokens.buttonHeight,
            border: `1px solid ${tokens.border}`,
            borderRadius: tokens.radius,
            background: tokens.bg,
            color: tokens.text,
            padding: "0 12px",
            fontFamily: bodyFamily,
            minWidth: 0,
            maxWidth: "100%",
          }}
        />
      </div>
      <div style={{ border: `1px solid ${tokens.border}`, borderRadius: tokens.radius, padding: space.m }}>
        <strong style={{ fontFamily: displayFamily }}>Карточка</strong>
        <div style={{ fontFamily: bodyFamily, fontSize: 14, color: tokens.muted, marginTop: 6 }}>Радиус {tokens.radius}px.</div>
      </div>
    </>
  );
}
