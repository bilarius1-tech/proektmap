"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Copy,
  Layers,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import {
  AGENT_MODE_LABEL,
  FAMILY_META,
  TASK_FILTERS,
  VIBE_KITS,
  VIBE_SCENARIOS,
  getVibeKit,
  priceLabel,
  type VibeFamily,
  type VibePrice,
  type VibeScenario,
} from "@/lib/vibe-blocks/data";

const FAMILY_FILTERS: { id: "all" | VibeFamily; label: string }[] = [
  { id: "all", label: "Все семьи" },
  { id: "animation", label: FAMILY_META.animation.short },
  { id: "landing", label: FAMILY_META.landing.short },
  { id: "foundation", label: FAMILY_META.foundation.short },
  { id: "agent-ui", label: FAMILY_META["agent-ui"].short },
  { id: "design-system", label: FAMILY_META["design-system"].short },
];

const PRICE_FILTERS: { id: "all" | VibePrice; label: string }[] = [
  { id: "all", label: "Любая цена" },
  { id: "free", label: "Бесплатно" },
  { id: "freemium", label: "Free + Pro" },
  { id: "paid", label: "Платно" },
];

export default function VibeBlocksClient() {
  const [task, setTask] = useState("all");
  const [family, setFamily] = useState<"all" | VibeFamily>("all");
  const [price, setPrice] = useState<"all" | VibePrice>("all");
  const [q, setQ] = useState("");
  const [agentOnly, setAgentOnly] = useState(false);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeScenario = scenarioId
    ? VIBE_SCENARIOS.find((s) => s.id === scenarioId) ?? null
    : null;

  const scenarioSlugSet = useMemo(() => {
    if (!activeScenario) return null;
    return new Set([
      ...activeScenario.kitSlugs,
      ...activeScenario.easier,
      ...activeScenario.harder,
    ]);
  }, [activeScenario]);

  const filtered = useMemo(() => {
    return VIBE_KITS.filter((k) => {
      if (scenarioSlugSet && !scenarioSlugSet.has(k.slug)) return false;
      if (task !== "all" && !k.tasks.includes(task)) return false;
      if (family !== "all" && k.family !== family) return false;
      if (price !== "all" && k.price !== price) return false;
      if (agentOnly && !k.agentMode.some((m) => m === "prompt" || m === "mcp")) return false;
      if (q) {
        const hay = `${k.name} ${k.tagline} ${k.stack} ${k.examples.join(" ")}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => {
      if (activeScenario) {
        const ai = activeScenario.kitSlugs.indexOf(a.slug);
        const bi = activeScenario.kitSlugs.indexOf(b.slug);
        const aIn = ai >= 0 ? ai : 100;
        const bIn = bi >= 0 ? bi : 100;
        if (aIn !== bIn) return aIn - bIn;
      }
      return a.sortOrder - b.sortOrder;
    });
  }, [task, family, price, q, agentOnly, scenarioSlugSet, activeScenario]);

  function selectScenario(s: VibeScenario) {
    if (scenarioId === s.id) {
      setScenarioId(null);
      return;
    }
    setScenarioId(s.id);
    setTask("all");
    setFamily("all");
    setPrice("all");
    setAgentOnly(false);
    setQ("");
  }

  async function copyBrief(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div>
      <section style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Layers size={16} style={{ color: "var(--color-accent)" }} />
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
            }}
          >
            Сценарии — начни отсюда
          </div>
        </div>
        <p
          style={{
            fontSize: 13,
            color: "var(--color-text-secondary)",
            lineHeight: 1.55,
            margin: "0 0 var(--space-s)",
            maxWidth: 640,
          }}
        >
          Не листай 14 китов. Выбери задачу — получи набор ссылок и готовый бриф для агента.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: 0,
            border: "1px solid var(--color-border)",
            background: "var(--color-border)",
          }}
        >
          {VIBE_SCENARIOS.map((s) => {
            const active = scenarioId === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => selectScenario(s)}
                style={{
                  textAlign: "left",
                  padding: "var(--space-m)",
                  background: active ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                  border: "none",
                  cursor: "pointer",
                  outline: "1px solid var(--color-border)",
                  outlineOffset: -1,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "var(--text-s)",
                    marginBottom: 4,
                    color: active ? "var(--color-accent)" : "inherit",
                  }}
                >
                  {s.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>
                  {s.desc}
                </div>
                <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 600 }}>
                  {s.kitSlugs.map((slug) => getVibeKit(slug)?.name).filter(Boolean).join(" · ")}
                </div>
              </button>
            );
          })}
        </div>

        {activeScenario && (
          <div
            style={{
              border: "1px solid var(--color-border)",
              borderTop: "none",
              padding: "var(--space-l)",
              background: "var(--color-bg-secondary)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: "var(--space-m)",
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 800,
                    fontSize: "var(--text-m)",
                    marginBottom: 6,
                  }}
                >
                  {activeScenario.title}
                </div>
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 560,
                  }}
                >
                  {activeScenario.why}
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyBrief(activeScenario.agentBrief)}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  border: "1px solid var(--color-accent)",
                  background: "var(--color-accent)",
                  color: "#fff",
                  alignSelf: "flex-start",
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Скопировано" : "Копировать бриф агенту"}
              </button>
            </div>

            <div style={{ marginBottom: "var(--space-m)" }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--color-text-tertiary)",
                  marginBottom: 8,
                }}
              >
                Рекомендованный набор
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeScenario.kitSlugs.map((slug) => {
                  const k = getVibeKit(slug);
                  if (!k) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/sandbox/vibe-blocks/${slug}`}
                      style={{
                        textDecoration: "none",
                        padding: "8px 12px",
                        border: "1px solid var(--color-accent)",
                        background: "var(--color-bg-primary)",
                        color: "var(--color-accent)",
                        fontSize: 13,
                        fontWeight: 700,
                      }}
                    >
                      {k.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            {(activeScenario.easier.length > 0 || activeScenario.harder.length > 0) && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "var(--space-m)",
                  marginBottom: "var(--space-m)",
                }}
              >
                {activeScenario.easier.length > 0 && (
                  <AltBlock label="Проще / быстрее" slugs={activeScenario.easier} />
                )}
                {activeScenario.harder.length > 0 && (
                  <AltBlock label="Сильнее / глубже" slugs={activeScenario.harder} />
                )}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: 10,
                padding: "var(--space-m)",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                fontSize: 13,
                lineHeight: 1.55,
                color: "var(--color-text-secondary)",
              }}
            >
              <AlertTriangle size={16} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ color: "var(--color-text-primary)" }}>Совет:</strong> {activeScenario.tip}
              </div>
            </div>
          </div>
        )}
      </section>

      <section style={{ marginBottom: "var(--space-xl)" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "var(--color-text-tertiary)",
            marginBottom: "var(--space-s)",
          }}
        >
          Семьи китов
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 0,
            border: "1px solid var(--color-border)",
            background: "var(--color-border)",
          }}
        >
          {(Object.keys(FAMILY_META) as VibeFamily[]).map((id) => {
            const meta = FAMILY_META[id];
            const count = VIBE_KITS.filter((k) => k.family === id).length;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setFamily(family === id ? "all" : id);
                  setScenarioId(null);
                }}
                style={{
                  textAlign: "left",
                  padding: "var(--space-m)",
                  background: family === id ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                  border: "none",
                  cursor: "pointer",
                  outline: "1px solid var(--color-border)",
                  outlineOffset: -1,
                }}
              >
                <div style={{ fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: 14, marginBottom: 4 }}>
                  {meta.short} · {count}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.45 }}>{meta.desc}</div>
              </button>
            );
          })}
        </div>
      </section>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: "var(--space-m)",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: "1 1 220px",
            padding: "10px 12px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
          }}
        >
          <Search size={14} style={{ color: "var(--color-text-tertiary)" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: Origin, chat, hero…"
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: 13,
              color: "var(--color-text-primary)",
            }}
          />
        </div>
        {TASK_FILTERS.map((f) => (
          <Chip key={f.id} active={task === f.id} onClick={() => setTask(f.id)}>
            {f.label}
          </Chip>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "var(--space-l)" }}>
        {FAMILY_FILTERS.map((f) => (
          <Chip key={f.id} active={family === f.id} onClick={() => setFamily(f.id)}>
            {f.label}
          </Chip>
        ))}
        {PRICE_FILTERS.map((f) => (
          <Chip key={f.id} active={price === f.id} onClick={() => setPrice(f.id)}>
            {f.label}
          </Chip>
        ))}
        <Chip active={agentOnly} onClick={() => setAgentOnly(!agentOnly)}>
          <Zap size={12} style={{ marginRight: 4 }} />
          Prompt / MCP
        </Chip>
      </div>

      <div
        style={{
          fontSize: 12,
          color: "var(--color-text-tertiary)",
          marginBottom: 8,
        }}
      >
        Найдено: {filtered.length}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 0,
          border: "1px solid var(--color-border)",
          background: "var(--color-border)",
        }}
      >
        {filtered.map((k) => {
          const inStack = activeScenario?.kitSlugs.includes(k.slug);
          return (
            <Link
              key={k.slug}
              href={`/sandbox/vibe-blocks/${k.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: inStack
                  ? "var(--color-accent-light)"
                  : k.featured
                    ? "var(--color-bg-secondary)"
                    : "var(--color-bg-primary)",
                padding: "var(--space-l)",
                outline: "1px solid var(--color-border)",
                outlineOffset: -1,
                display: "flex",
                flexDirection: "column",
                minHeight: 230,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  {inStack ? "В сценарии" : FAMILY_META[k.family].short}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-secondary)" }}>
                  {priceLabel(k.price)}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-l)",
                  fontWeight: 800,
                  margin: "0 0 8px",
                  letterSpacing: "-0.02em",
                }}
              >
                {k.name}
                {k.featured && (
                  <span
                    style={{
                      marginLeft: 8,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "var(--color-accent)",
                      verticalAlign: "middle",
                    }}
                  >
                    <Sparkles size={12} style={{ display: "inline", verticalAlign: -1 }} /> must-have
                  </span>
                )}
              </h2>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--color-text-secondary)",
                  lineHeight: 1.55,
                  margin: "0 0 12px",
                  flex: 1,
                }}
              >
                {k.tagline}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {k.agentMode.slice(0, 3).map((m) => (
                  <span
                    key={m}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 7px",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {AGENT_MODE_LABEL[m]}
                  </span>
                ))}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 12,
                  fontWeight: 700,
                  color: "var(--color-accent)",
                }}
              >
                Открыть <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div
          style={{
            marginTop: "var(--space-l)",
            padding: "var(--space-l)",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
            fontSize: 14,
            color: "var(--color-text-secondary)",
          }}
        >
          Ничего не найдено. Сбрось фильтры или выбери другой сценарий.
        </div>
      )}

      <section
        style={{
          marginTop: "var(--space-xl)",
          padding: "var(--space-l)",
          border: "1px solid var(--color-border)",
          background: "var(--color-bg-primary)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <AlertTriangle size={16} style={{ color: "var(--color-warning)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-m)", fontWeight: 800, margin: 0 }}>
            Не смешивай всё сразу
          </h2>
        </div>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
          <li>Один фундамент (обычно shadcn) + один источник секций + максимум один «вау»-кит.</li>
          <li>Сначала структура страницы, потом анимации.</li>
          <li>
            Для «на чём анимировать» смотри{" "}
            <Link href="/sandbox/creative-library" style={{ color: "var(--color-accent)" }}>
              Креативную библиотеку
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}

function AltBlock({ label, slugs }: { label: string; slugs: string[] }) {
  return (
    <div style={{ padding: "var(--space-m)", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--color-text-tertiary)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {slugs.map((slug) => {
          const k = getVibeKit(slug);
          if (!k) return null;
          return (
            <Link
              key={slug}
              href={`/sandbox/vibe-blocks/${slug}`}
              style={{ fontSize: 13, fontWeight: 600, color: "var(--color-accent)", textDecoration: "none" }}
            >
              {k.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "7px 12px",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        border: "1px solid var(--color-border)",
        background: active ? "var(--color-accent)" : "var(--color-bg-primary)",
        color: active ? "#fff" : "var(--color-text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
