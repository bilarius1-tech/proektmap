"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { AlertCircle, Check, Copy, Download, Loader2, Palette, Terminal } from "lucide-react";
import {
  DEFAULT_TOKENS,
  FONT_PAIRS,
  applyFontPair,
  applySchool,
  findPair,
  findPairById,
  fontsFor,
  nearestPairFor,
} from "@/lib/services/site-style-builder/defaults";
import { applyColorPair, fallbackMuted, palettesFor } from "@/lib/services/site-style-builder/palettes";
import { renderAgentPrompt, renderDesignMd, renderTokensCss } from "@/lib/services/site-style-builder/render-docs";
import { SCHOOLS } from "@/lib/services/site-style-builder/schools";
import { DESIGN_PACK, renderSkillsInstall } from "@/lib/services/site-style-builder/skills-pack";
import { STYLE_DIRECTIONS, type DesignSystemSnapshot, type ExtractedStyle, type StyleDirection, type StyleTokens } from "@/lib/services/site-style-builder/types";
import { KitPreview } from "./kit";
import { DesignSystemPreview, googleHrefForFamilies } from "./system";

const DIRECTIONS: StyleDirection[] = STYLE_DIRECTIONS;
const PACK_INSTALL = renderSkillsInstall();

function hexOrFallback(value: string, fallback: string) {
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value : fallback;
}

async function copyText(text: string) {
  await navigator.clipboard.writeText(text);
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
      {label}
      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="color"
          value={hexOrFallback(value, "#000000")}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          style={{ width: 40, height: 32, border: "1px solid var(--color-border)", background: "transparent", padding: 0 }}
        />
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          spellCheck={false}
          style={{
            flex: 1,
            minWidth: 0,
            height: 32,
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            padding: "0 8px",
            fontFamily: "ui-monospace, monospace",
            fontSize: 12,
          }}
        />
      </span>
    </label>
  );
}

export default function SiteStyleBuilderWorkspace() {
  const [tokens, setTokens] = useState<StyleTokens>(DEFAULT_TOKENS);
  const [url, setUrl] = useState("https://proektmap.ru/resheniya/premium-landing");
  const [extracting, setExtracting] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [fromUrl, setFromUrl] = useState(false);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [system, setSystem] = useState<DesignSystemSnapshot | null>(null);
  const [previewMode, setPreviewMode] = useState<"system" | "kit">("system");
  const [copied, setCopied] = useState<"md" | "prompt" | "css" | "skills" | null>(null);
  const [advancedColors, setAdvancedColors] = useState(false);

  const pair =
    findPairById(tokens.fontPairId) ??
    findPair(tokens.fontDisplay, tokens.fontBody) ??
    nearestPairFor(tokens.fontDisplay, tokens.fontBody, tokens.direction);
  const designMd = useMemo(() => renderDesignMd(tokens), [tokens]);
  const agentPrompt = useMemo(() => renderAgentPrompt(tokens), [tokens]);
  const tokensCss = useMemo(() => renderTokensCss(tokens), [tokens]);
  const school = SCHOOLS[tokens.direction];
  const schoolPalettes = palettesFor(tokens.direction);
  const schoolFonts = fontsFor(tokens.direction);
  const otherFonts = FONT_PAIRS.filter((item) => !item.suits.includes(tokens.direction));

  useEffect(() => {
    const id = "site-style-builder-fonts";
    let link = document.getElementById(id) as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    const href =
      googleHrefForFamilies(system?.fonts?.length ? system.fonts : [tokens.fontDisplay, tokens.fontBody]) ||
      pair.googleHref;
    link.href = href;
  }, [pair.googleHref, system, tokens.fontBody, tokens.fontDisplay]);

  function patch(partial: Partial<StyleTokens>) {
    setTokens((prev) => ({ ...prev, ...partial }));
  }

  function applyExtract(extracted: ExtractedStyle) {
    const direction = extracted.suggestedDirection || tokens.direction;
    const next: StyleTokens = {
      ...DEFAULT_TOKENS,
      ...extracted.tokens,
      productName: tokens.productName,
      audience: tokens.audience,
      direction,
      muted: extracted.tokens.muted || fallbackMuted(extracted.tokens.bg || DEFAULT_TOKENS.bg),
      gridColumns: extracted.grid?.columns || extracted.tokens.gridColumns || DEFAULT_TOKENS.gridColumns,
      maxWidth: extracted.grid?.maxWidth || extracted.tokens.maxWidth || DEFAULT_TOKENS.maxWidth,
      paletteId: "custom",
    };
    const catalog = findPair(next.fontDisplay, next.fontBody);
    if (catalog) {
      next.fontPairId = catalog.id;
      next.fontMono = catalog.mono;
    } else {
      next.fontPairId = "custom";
    }
    next.paletteId = "custom";
    setTokens(next);
    setFromUrl(true);
    setSourceUrl(extracted.sourceUrl);
    setSystem(extracted.system || null);
    setPreviewMode("system");
    setWarnings(extracted.warnings);
  }

  async function extractFromUrl() {
    setExtracting(true);
    setExtractError(null);
    setWarnings([]);
    try {
      const response = await fetch("/api/services/site-style-builder/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();
      if (!response.ok) {
        setExtractError(data.error || "Не удалось снять стиль. Задайте токены вручную.");
        return;
      }
      applyExtract(data as ExtractedStyle);
    } catch {
      setExtractError("Сеть недоступна. Задайте токены вручную — конструктор работает без съёма.");
    } finally {
      setExtracting(false);
    }
  }

  async function handleCopy(kind: "md" | "prompt" | "css" | "skills") {
    const text =
      kind === "md" ? designMd : kind === "prompt" ? agentPrompt : kind === "css" ? tokensCss : PACK_INSTALL;
    await copyText(text);
    setCopied(kind);
    window.setTimeout(() => setCopied(null), 1800);
    fetch("/api/services/site-style-builder/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "use" }),
    }).catch(() => {});
  }

  function downloadMd() {
    const blob = new Blob([designMd], { type: "text/markdown;charset=utf-8" });
    const href = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = href;
    a.download = "DESIGN.md";
    a.click();
    URL.revokeObjectURL(href);
    fetch("/api/services/site-style-builder/stats", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "use" }),
    }).catch(() => {});
  }

  return (
    <div className="site-style-builder">
      <section
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          borderRadius: "var(--radius-l)",
          padding: 20,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
          <Palette size={18} />
          Снять стиль с сайта
        </div>
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
          Рабочий съём: после ссылки превью становится дизайн-системой этого сайта — цвета, шрифты, радиусы, атомы.
        </p>
        <div className="site-style-url-row">
          <input
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://"
            style={{
              flex: "1 1 220px",
              minWidth: 0,
              width: "100%",
              height: 44,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
              padding: "0 12px",
              boxSizing: "border-box",
            }}
          />
          <button
            type="button"
            onClick={extractFromUrl}
            disabled={extracting}
            style={{
              height: 44,
              padding: "0 16px",
              border: "none",
              background: "var(--color-accent)",
              color: "#fff",
              fontWeight: 700,
              cursor: extracting ? "wait" : "pointer",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              flex: "0 0 auto",
            }}
          >
            {extracting ? <Loader2 size={16} style={{ animation: "site-style-spin 1s linear infinite" }} /> : null}
            {extracting ? "Снимаем…" : "Снять токены"}
          </button>
        </div>
        {extractError && (
          <p style={{ margin: 0, color: "#b45309", fontSize: 13, display: "flex", gap: 8, alignItems: "flex-start" }}>
            <AlertCircle size={16} />
            {extractError}
          </p>
        )}
        {warnings.map((warning) => (
          <p key={warning} style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 13 }}>
            {warning}
          </p>
        ))}
      </section>

      <section
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          borderRadius: "var(--radius-l)",
          padding: 20,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800 }}>
            <Terminal size={18} />
            Скиллы в заказ
          </div>
          <button type="button" onClick={() => handleCopy("skills")} style={actionBtn}>
            {copied === "skills" ? <Check size={14} /> : <Copy size={14} />}
            Copy установку
          </button>
        </div>
        <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.5 }}>
          GitHub-пакет, который уже стоит в /ai-skills: Anthropic, taste, Vercel, Impeccable. Команды уходят в
          DESIGN.md и в промпт — агент подключает их сам.
        </p>
        <ol className="site-style-skill-pack">
          {DESIGN_PACK.map((skill, index) => (
            <li key={skill.slug}>
              <span>{index + 1}</span>
              <strong>{skill.title}</strong>
              <em>{skill.author}</em>
            </li>
          ))}
        </ol>
        <pre
          style={{
            margin: 0,
            maxHeight: 140,
            overflow: "auto",
            padding: 12,
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
            fontSize: 12,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {PACK_INSTALL}
        </pre>
      </section>

      <div className="site-style-builder-grid">
        <section
          className="site-style-controls"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border-light)",
            borderRadius: "var(--radius-l)",
            padding: 20,
            display: "grid",
            gap: 14,
            minWidth: 0,
          }}
        >
          <strong>Конструктор</strong>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
            Продукт
            <input
              value={tokens.productName}
              onChange={(event) => patch({ productName: event.target.value })}
              style={fieldStyle}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
            Для кого
            <input
              value={tokens.audience}
              onChange={(event) => patch({ audience: event.target.value })}
              style={fieldStyle}
            />
          </label>
          <div style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Стиль</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DIRECTIONS.map((direction) => (
                <button
                  key={direction}
                  type="button"
                  onClick={() => {
                    if (direction === tokens.direction) return;
                    setTokens((prev) => applySchool(prev, direction, { keepColors: fromUrl }));
                  }}
                  style={{
                    ...chipStyle,
                    borderColor: tokens.direction === direction ? "var(--color-accent)" : "var(--color-border)",
                    background: tokens.direction === direction ? "var(--color-accent-light)" : "transparent",
                  }}
                >
                  {SCHOOLS[direction].shortLabel}
                </button>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.45, color: "var(--color-text-secondary)" }}>
              {school.thesis}
            </p>
          </div>

          <div style={{ display: "grid", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>Цветовая пара</span>
            <div style={{ display: "grid", gap: 8 }}>
              {schoolPalettes.map((palette) => {
                const active = tokens.paletteId === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    onClick={() => setTokens((prev) => applyColorPair(prev, palette))}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr",
                      gap: 10,
                      alignItems: "center",
                      textAlign: "left",
                      padding: "8px 10px",
                      border: `1px solid ${active ? "var(--color-accent)" : "var(--color-border)"}`,
                      background: active ? "var(--color-accent-light)" : "transparent",
                      cursor: "pointer",
                      color: "inherit",
                    }}
                  >
                    <span style={{ display: "flex", border: "1px solid rgba(0,0,0,0.12)" }}>
                      {[palette.bg, palette.text, palette.accent].map((hex) => (
                        <span key={hex} style={{ width: 16, height: 22, background: hex, display: "block" }} />
                      ))}
                    </span>
                    <span>
                      <strong style={{ display: "block", fontSize: 12 }}>{palette.name}</strong>
                      <span style={{ fontSize: 11, color: "var(--color-text-secondary)" }}>{palette.note}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setAdvancedColors((value) => !value)}
              style={{ ...chipStyle, justifySelf: "start", height: 32, fontWeight: 600 }}
            >
              {advancedColors ? "Скрыть ручные hex" : "Ручные hex"}
            </button>
            {advancedColors && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <ColorField label="Фон" value={tokens.bg} onChange={(bg) => patch({ bg, paletteId: "custom" })} />
                <ColorField label="Текст" value={tokens.text} onChange={(text) => patch({ text, paletteId: "custom" })} />
                <ColorField
                  label="Приглушённый"
                  value={tokens.muted}
                  onChange={(muted) => patch({ muted, paletteId: "custom" })}
                />
                <ColorField
                  label="Бордер"
                  value={tokens.border}
                  onChange={(border) => patch({ border, paletteId: "custom" })}
                />
                <ColorField
                  label="Акцент"
                  value={tokens.accent}
                  onChange={(accent) => patch({ accent, paletteId: "custom" })}
                />
              </div>
            )}
          </div>

          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
            Шрифтовая пара
            <select
              value={tokens.fontPairId === "custom" ? "custom" : pair.id}
              onChange={(event) => {
                if (event.target.value === "custom") return;
                const next = findPairById(event.target.value) ?? FONT_PAIRS.find((item) => item.id === event.target.value);
                if (next) setTokens((prev) => applyFontPair(prev, next));
              }}
              style={fieldStyle}
            >
              {tokens.fontPairId === "custom" && (
                <option value="custom">
                  С сайта: {tokens.fontDisplay} + {tokens.fontBody}
                </option>
              )}
              <optgroup label={school.shortLabel}>
                {schoolFonts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.display} + {item.body} — {item.note}
                  </option>
                ))}
              </optgroup>
              {otherFonts.length > 0 && (
                <optgroup label="Другие школы">
                  {otherFonts.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.display} + {item.body} — {item.note}
                    </option>
                  ))}
                </optgroup>
              )}
            </select>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
            Кнопки
            <select
              value={tokens.buttonStyle}
              onChange={(event) => patch({ buttonStyle: event.target.value as StyleTokens["buttonStyle"] })}
              style={fieldStyle}
            >
              <option value="fill">Заливка</option>
              <option value="outline">Контур</option>
            </select>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
            Высота кнопки: {tokens.buttonHeight}px
            <input
              type="range"
              min={36}
              max={56}
              value={tokens.buttonHeight}
              onChange={(event) => patch({ buttonHeight: Number(event.target.value) })}
            />
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, fontWeight: 600 }}>
            Скругление: {tokens.radius}px
            <input
              type="range"
              min={0}
              max={24}
              value={tokens.radius}
              onChange={(event) => patch({ radius: Number(event.target.value) })}
            />
          </label>
          <div style={{ display: "flex", gap: 8 }}>
            {(["airy", "compact"] as const).map((density) => (
              <button
                key={density}
                type="button"
                onClick={() => patch({ density })}
                style={{
                  ...chipStyle,
                  flex: 1,
                  borderColor: tokens.density === density ? "var(--color-accent)" : "var(--color-border)",
                  background: tokens.density === density ? "var(--color-accent-light)" : "transparent",
                }}
              >
                {density === "airy" ? "Воздух" : "Компакт"}
              </button>
            ))}
          </div>
        </section>

        <div style={{ display: "grid", gap: 8, minWidth: 0 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {(
              [
                ["system", "Система"],
                ["kit", "Макет"],
              ] as const
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setPreviewMode(mode)}
                style={{
                  ...chipStyle,
                  borderColor: previewMode === mode ? "var(--color-accent)" : "var(--color-border)",
                  background: previewMode === mode ? "var(--color-accent-light)" : "transparent",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {previewMode === "system" ? (
            <DesignSystemPreview tokens={tokens} system={system} sourceUrl={sourceUrl} />
          ) : (
            <KitPreview tokens={tokens} pair={pair} />
          )}
        </div>
      </div>

      <section
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border-light)",
          borderRadius: "var(--radius-l)",
          padding: 20,
          display: "grid",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" onClick={() => handleCopy("md")} style={actionBtn}>
            {copied === "md" ? <Check size={14} /> : <Copy size={14} />}
            Copy DESIGN.md
          </button>
          <button type="button" onClick={() => handleCopy("prompt")} style={actionBtn}>
            {copied === "prompt" ? <Check size={14} /> : <Copy size={14} />}
            Copy промпт
          </button>
          <button type="button" onClick={() => handleCopy("css")} style={actionBtn}>
            {copied === "css" ? <Check size={14} /> : <Copy size={14} />}
            Copy tokens.css
          </button>
          <button type="button" onClick={() => handleCopy("skills")} style={actionBtn}>
            {copied === "skills" ? <Check size={14} /> : <Copy size={14} />}
            Copy скиллы
          </button>
          <button type="button" onClick={downloadMd} style={actionBtn}>
            <Download size={14} />
            Скачать DESIGN.md
          </button>
        </div>
        <pre
          style={{
            margin: 0,
            maxHeight: 280,
            overflow: "auto",
            padding: 14,
            background: "var(--color-bg-secondary)",
            border: "1px solid var(--color-border)",
            fontSize: 12,
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
          }}
        >
          {designMd}
        </pre>
      </section>
    </div>
  );
}

const fieldStyle: CSSProperties = {
  height: 36,
  width: "100%",
  maxWidth: "100%",
  minWidth: 0,
  boxSizing: "border-box",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  padding: "0 10px",
};

const chipStyle: CSSProperties = {
  height: 32,
  padding: "0 10px",
  border: "1px solid var(--color-border)",
  background: "transparent",
  color: "var(--color-text-primary)",
  fontSize: 11,
  fontWeight: 700,
  cursor: "pointer",
};

const actionBtn: CSSProperties = {
  height: 40,
  padding: "0 12px",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
};
