"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { AlertCircle, Check, Copy, Download, Loader2, Package } from "lucide-react";
import { IDEA_EXAMPLE, PIPELINE } from "@/lib/services/site-template/examples";
import { KIND_LABELS, type SiteKind, type StyleSeed, type TemplateDossier } from "@/lib/services/site-template/types";

const field: CSSProperties = {
  width: "100%",
  minWidth: 0,
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  padding: "10px 12px",
  fontSize: 14,
  fontFamily: "inherit",
};

const label: CSSProperties = { display: "grid", gap: 6, fontSize: 12, fontWeight: 600 };

function Tab({
  id,
  current,
  onClick,
  children,
}: {
  id: string;
  current: string;
  onClick: () => void;
  children: ReactNode;
}) {
  const on = current === id;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        height: 36,
        padding: "0 12px",
        border: "1px solid var(--color-border)",
        background: on ? "var(--color-text-primary)" : "var(--color-bg-primary)",
        color: on ? "var(--color-bg-primary)" : "var(--color-text-primary)",
        fontWeight: 700,
        fontSize: 12,
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

export default function SiteTemplateWorkspace() {
  const [productName, setProductName] = useState("");
  const [audience, setAudience] = useState("");
  const [offer, setOffer] = useState("");
  const [action, setAction] = useState("Оставить заявку");
  const [leadTo, setLeadTo] = useState("форма на главной");
  const [idea, setIdea] = useState("");
  const [refs, setRefs] = useState("");
  const [constraints, setConstraints] = useState("Русский язык, работа из РФ");
  const [kind, setKind] = useState<SiteKind>("landing");
  const [styleUrl, setStyleUrl] = useState("");
  const [style, setStyle] = useState<StyleSeed | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [building, setBuilding] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dossier, setDossier] = useState<TemplateDossier | null>(null);
  const [tab, setTab] = useState<"brief" | "design" | "map" | "prompt">("brief");
  const [copied, setCopied] = useState<"prompt" | "good" | null>(null);

  async function copy(text: string, key: "prompt" | "good") {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1600);
  }

  async function extractStyle() {
    if (!styleUrl.trim()) return;
    setExtracting(true);
    setError(null);
    try {
      const response = await fetch("/api/services/site-style-builder/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: styleUrl }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Не удалось снять стиль.");
        return;
      }
      const tokens = data.tokens || {};
      setStyle({
        bg: tokens.bg,
        text: tokens.text,
        muted: tokens.muted,
        accent: tokens.accent,
        border: tokens.border,
        fontDisplay: tokens.fontDisplay,
        fontBody: tokens.fontBody,
        radius: tokens.radius,
        maxWidth: tokens.maxWidth,
        buttonHeight: tokens.buttonHeight,
        sourceUrl: data.sourceUrl || styleUrl,
      });
    } catch {
      setError("Сеть недоступна. Соберите шаблон без съёма стиля.");
    } finally {
      setExtracting(false);
    }
  }

  async function build() {
    setBuilding(true);
    setError(null);
    try {
      const response = await fetch("/api/services/site-template/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName,
          audience,
          offer,
          action,
          leadTo,
          idea,
          refs,
          constraints,
          kind,
          style,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Не собралось.");
        return;
      }
      setDossier(data as TemplateDossier);
      setTab("brief");
      fetch("/api/services/site-template/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "use" }),
      }).catch(() => {});
    } catch {
      setError("Сеть недоступна.");
    } finally {
      setBuilding(false);
    }
  }

  async function downloadZip() {
    if (!dossier) return;
    setDownloading(true);
    setError(null);
    try {
      const response = await fetch("/api/services/site-template/pack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dossier),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError((data as { error?: string }).error || "Zip не собрался.");
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${dossier.slug}-site-starter.zip`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Не удалось скачать архив.");
    } finally {
      setDownloading(false);
    }
  }

  const preview =
    tab === "brief"
      ? dossier?.briefMd
      : tab === "design"
        ? dossier?.designMd
        : tab === "map"
          ? dossier?.sitemapMd
          : dossier?.cursorPrompt;

  return (
    <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 8,
        }}
        className="site-template-pipe"
      >
        {PIPELINE.map((step) => (
          <div
            key={step.n}
            style={{
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              padding: "12px 12px 14px",
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-accent)", marginBottom: 4 }}>{step.n}</div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{step.title}</div>
            <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 2 }}>{step.who}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)", gap: 16 }} className="site-template-grid">
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div style={{ border: "1px solid var(--color-border)", padding: 16, background: "var(--color-surface)", display: "grid", gap: 12 }}>
            <div style={{ fontWeight: 800, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
              <Package size={16} /> Заказ шаблона
            </div>
            <label style={label}>
              Название
              <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Altea / Реверанс / Densio" style={field} />
            </label>
            <label style={label}>
              Для кого
              <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="родители детей в спортклубе" style={field} />
            </label>
            <label style={label}>
              Что предлагаете
              <input value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="запись на консультацию / учёт оплат" style={field} />
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <label style={label}>
                Действие
                <input value={action} onChange={(e) => setAction(e.target.value)} style={field} />
              </label>
              <label style={label}>
                Куда заявка
                <input value={leadTo} onChange={(e) => setLeadTo(e.target.value)} style={field} />
              </label>
            </div>
            <label style={label}>
              Идея своими словами
              <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={5} style={{ ...field, resize: "vertical" }} placeholder={IDEA_EXAMPLE.good} />
            </label>
            <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.45, display: "grid", gap: 8 }}>
              <div>
                <b>Плохо.</b> {IDEA_EXAMPLE.bad}
              </div>
              <div>
                <b>Хорошо.</b> {IDEA_EXAMPLE.good}
              </div>
              <div>{IDEA_EXAMPLE.why}</div>
              <button
                type="button"
                onClick={() => {
                  setIdea(IDEA_EXAMPLE.good);
                  void copy(IDEA_EXAMPLE.good, "good");
                }}
                style={{ ...field, width: "auto", cursor: "pointer", fontWeight: 700, height: 36, padding: "0 12px" }}
              >
                {copied === "good" ? "Вставлено" : "Вставить хороший запрос"}
              </button>
            </div>
            <label style={label}>
              Референсы (ссылки)
              <textarea value={refs} onChange={(e) => setRefs(e.target.value)} rows={2} style={{ ...field, resize: "vertical" }} placeholder="https://…" />
            </label>
            <label style={label}>
              Ограничения
              <input value={constraints} onChange={(e) => setConstraints(e.target.value)} style={field} />
            </label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {(Object.keys(KIND_LABELS) as SiteKind[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setKind(id)}
                  style={{
                    height: 34,
                    padding: "0 10px",
                    border: "1px solid var(--color-border)",
                    background: kind === id ? "var(--color-text-primary)" : "var(--color-bg-primary)",
                    color: kind === id ? "var(--color-bg-primary)" : "var(--color-text-primary)",
                    fontWeight: 700,
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  {KIND_LABELS[id]}
                </button>
              ))}
            </div>
            <label style={label}>
              Ссылка на стиль (необязательно)
              <span style={{ display: "flex", gap: 8 }}>
                <input value={styleUrl} onChange={(e) => setStyleUrl(e.target.value)} placeholder="https://altea.clinic" style={field} />
                <button
                  type="button"
                  onClick={() => void extractStyle()}
                  disabled={extracting}
                  style={{
                    height: 40,
                    padding: "0 12px",
                    whiteSpace: "nowrap",
                    border: "none",
                    background: "var(--color-accent)",
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {extracting ? "Снимаем…" : "Снять"}
                </button>
              </span>
            </label>
            {style && (
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>
                Стиль: {style.fontDisplay} · {style.bg} / {style.accent}
                {style.sourceUrl ? ` · ${style.sourceUrl}` : ""}
              </div>
            )}
            <button
              type="button"
              onClick={() => void build()}
              disabled={building}
              style={{
                height: 44,
                border: "none",
                background: "var(--color-text-primary)",
                color: "var(--color-bg-primary)",
                fontWeight: 800,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {building ? <Loader2 size={16} className="spin" /> : <Package size={16} />}
              {building ? "Собираем…" : "Собрать шаблон"}
            </button>
          </div>
        </div>

        <div style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", padding: 16, minWidth: 0, display: "grid", gap: 12, alignContent: "start" }}>
          {!dossier ? (
            <p style={{ margin: 0, color: "var(--color-text-secondary)", fontSize: 14, lineHeight: 1.55 }}>
              После сборки здесь появятся BRIEF.md, DESIGN.md и промпт для Cursor. Скачанный zip — та же среда, что в вашем архиве: скиллы, materials, shared, пример Денсио отдельно. index.html агент пишет у вас на компьютере.
            </p>
          ) : (
            <>
              {dossier.warnings.length > 0 && (
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", display: "flex", gap: 8 }}>
                  <AlertCircle size={14} /> {dossier.warnings[0]}
                </div>
              )}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                <Tab id="brief" current={tab} onClick={() => setTab("brief")}>
                  BRIEF
                </Tab>
                <Tab id="design" current={tab} onClick={() => setTab("design")}>
                  DESIGN
                </Tab>
                <Tab id="map" current={tab} onClick={() => setTab("map")}>
                  Карта
                </Tab>
                <Tab id="prompt" current={tab} onClick={() => setTab("prompt")}>
                  Промпт Cursor
                </Tab>
              </div>
              <pre
                style={{
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontSize: 12,
                  lineHeight: 1.5,
                  maxHeight: 420,
                  overflow: "auto",
                  background: "var(--color-bg-primary)",
                  padding: 12,
                  border: "1px solid var(--color-border)",
                }}
              >
                {preview}
              </pre>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <button
                  type="button"
                  onClick={() => void copy(dossier.cursorPrompt, "prompt")}
                  style={{ height: 40, padding: "0 14px", cursor: "pointer", fontWeight: 700, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", display: "inline-flex", alignItems: "center", gap: 8 }}
                >
                  {copied === "prompt" ? <Check size={14} /> : <Copy size={14} />} Copy промпт
                </button>
                <button
                  type="button"
                  onClick={() => void downloadZip()}
                  disabled={downloading}
                  style={{
                    height: 40,
                    padding: "0 14px",
                    cursor: "pointer",
                    fontWeight: 800,
                    border: "none",
                    background: "var(--color-accent)",
                    color: "#fff",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  {downloading ? <Loader2 size={14} /> : <Download size={14} />} Скачать zip
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
