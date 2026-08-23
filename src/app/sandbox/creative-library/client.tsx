"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles, AlertTriangle, Zap, Copy, Check, Layers } from "lucide-react";
import {
  CREATIVE_TOOLS,
  PERFORMANCE_KILLERS,
  STACK_RECIPES,
  TASK_FILTERS,
  TIER_META,
  difficultyLabel,
  getCreativeTool,
  mobileLabel,
  tierLabel,
  type CreativeDifficulty,
  type CreativeTier,
  type StackRecipe,
} from "@/lib/creative-library/data";

const DIFF_FILTERS: { id: "all" | CreativeDifficulty; label: string }[] = [
  { id: "all", label: "Любая сложность" },
  { id: "easy", label: "Легко с AI" },
  { id: "medium", label: "Средне" },
  { id: "hard", label: "Тяжело" },
];

const TIER_FILTERS: { id: "all" | CreativeTier; label: string }[] = [
  { id: "all", label: "Все уровни" },
  { id: 1, label: TIER_META[1].short },
  { id: 2, label: TIER_META[2].short },
  { id: 3, label: TIER_META[3].short },
];

const NOCODE_SLUGS = new Set([
  "spline",
  "rive",
  "lottie",
  "vanta",
  "model-viewer",
  "autoanimate",
  "mesh-gradient",
  "view-transitions",
]);

export default function CreativeLibraryClient() {
  const [task, setTask] = useState("all");
  const [diff, setDiff] = useState<"all" | CreativeDifficulty>("all");
  const [tier, setTier] = useState<"all" | CreativeTier>("all");
  const [q, setQ] = useState("");
  const [entry, setEntry] = useState<"all" | "code" | "nocode">("all");
  const [recipeId, setRecipeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const activeRecipe = recipeId ? STACK_RECIPES.find((r) => r.id === recipeId) ?? null : null;

  const recipeSlugSet = useMemo(() => {
    if (!activeRecipe) return null;
    return new Set([...activeRecipe.stack, ...activeRecipe.easier.slugs, ...activeRecipe.harder.slugs]);
  }, [activeRecipe]);

  const filtered = useMemo(() => {
    return CREATIVE_TOOLS.filter((t) => {
      if (recipeSlugSet && !recipeSlugSet.has(t.slug)) return false;
      if (task !== "all" && !t.tasks.includes(task)) return false;
      if (diff !== "all" && t.difficulty !== diff) return false;
      if (tier !== "all" && t.tier !== tier) return false;
      if (entry === "nocode" && !NOCODE_SLUGS.has(t.slug)) return false;
      if (entry === "code" && NOCODE_SLUGS.has(t.slug) && t.slug !== "rive") return false;
      if (q) {
        const hay = `${t.name} ${t.tagline} ${t.category} ${t.designDNA}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => {
      if (activeRecipe) {
        const ai = activeRecipe.stack.indexOf(a.slug);
        const bi = activeRecipe.stack.indexOf(b.slug);
        const aIn = ai >= 0 ? ai : 100;
        const bIn = bi >= 0 ? bi : 100;
        if (aIn !== bIn) return aIn - bIn;
      }
      return a.tier - b.tier || a.sortOrder - b.sortOrder;
    });
  }, [task, diff, tier, q, entry, recipeSlugSet, activeRecipe]);

  function selectRecipe(r: StackRecipe) {
    if (recipeId === r.id) {
      setRecipeId(null);
      setTask("all");
      setTier("all");
      return;
    }
    setRecipeId(r.id);
    setTask("all");
    setDiff("all");
    setTier("all");
    setEntry("all");
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
      {/* Stack recipes — главный вход */}
      <section style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Layers size={16} style={{ color: "var(--color-accent)" }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
            Стеки-рецепты — начни отсюда
          </div>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55, margin: "0 0 var(--space-s)", maxWidth: 640 }}>
          Не выбирай из 32 библиотек. Выбери задачу — получи один рекомендованный стек, проще и сложнее альтернативы.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 0, border: "1px solid var(--color-border)", background: "var(--color-border)" }}>
          {STACK_RECIPES.map((r) => {
            const active = recipeId === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => selectRecipe(r)}
                style={{
                  textAlign: "left",
                  padding: "var(--space-m)",
                  background: active ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                  border: "none",
                  cursor: "pointer",
                  outline: "1px solid var(--color-border)",
                  outlineOffset: -1,
                }}
                className="cl-scenario"
              >
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-s)", marginBottom: 4, color: active ? "var(--color-accent)" : "inherit" }}>
                  {r.title}
                </div>
                <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>{r.desc}</div>
                <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 600 }}>
                  {r.stack.map((slug) => getCreativeTool(slug)?.name).filter(Boolean).join(" + ")}
                </div>
              </button>
            );
          })}
        </div>

        {activeRecipe && (
          <div
            style={{
              marginTop: 0,
              border: "1px solid var(--color-border)",
              borderTop: "none",
              padding: "var(--space-l)",
              background: "var(--color-bg-secondary)",
            }}
          >
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 12, marginBottom: "var(--space-m)" }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-m)", marginBottom: 6 }}>{activeRecipe.title}</div>
                <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0, maxWidth: 560 }}>{activeRecipe.why}</p>
              </div>
              <button
                type="button"
                onClick={() => copyBrief(activeRecipe.agentBrief)}
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
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 8 }}>
                Рекомендованный стек
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {activeRecipe.stack.map((slug) => {
                  const t = getCreativeTool(slug);
                  if (!t) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/sandbox/creative-library/${slug}`}
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
                      {t.name} · {tierLabel(t.tier)}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
              <AltBlock label={activeRecipe.easier.label} slugs={activeRecipe.easier.slugs} />
              <AltBlock label={activeRecipe.harder.label} slugs={activeRecipe.harder.slugs} />
            </div>

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
                <strong style={{ color: "var(--color-text-primary)" }}>FPS / мобилка:</strong> {activeRecipe.fpsNote}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tiers explainer */}
      <section style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)" }}>
          Уровни — если листаешь каталог
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 0, border: "1px solid var(--color-border)", background: "var(--color-border)" }}>
          {([1, 2, 3] as CreativeTier[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setRecipeId(null);
                setTier(tier === t ? "all" : t);
              }}
              style={{
                textAlign: "left",
                padding: "var(--space-m)",
                background: tier === t && !recipeId ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                border: "none",
                cursor: "pointer",
                outline: "1px solid var(--color-border)",
                outlineOffset: -1,
              }}
            >
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-s)", marginBottom: 4, color: tier === t && !recipeId ? "var(--color-accent)" : "inherit" }}>
                {TIER_META[t].label}
              </div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>{TIER_META[t].desc}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 8 }}>
                {CREATIVE_TOOLS.filter((x) => x.tier === t).length} инструментов
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "var(--space-m)", alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Поиск: GSAP, шейдеры, AR…"
            style={{
              width: "100%",
              padding: "10px 12px 10px 32px",
              fontSize: 13,
              border: "1px solid var(--color-border)",
              background: "var(--color-bg-primary)",
              color: "var(--color-text-primary)",
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
          {filtered.length} из {CREATIVE_TOOLS.length}
          {activeRecipe ? ` · рецепт «${activeRecipe.title}»` : ""}
        </span>
        {recipeId && (
          <button
            type="button"
            onClick={() => setRecipeId(null)}
            style={{ fontSize: 11, fontWeight: 600, padding: "6px 10px", cursor: "pointer", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", color: "var(--color-text-secondary)" }}
          >
            Сбросить рецепт
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {TIER_FILTERS.map((f) => (
          <Chip
            key={String(f.id)}
            active={tier === f.id && !recipeId}
            onClick={() => {
              setRecipeId(null);
              setTier(f.id);
            }}
          >
            {f.label}
          </Chip>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {TASK_FILTERS.map((f) => (
          <Chip
            key={f.id}
            active={task === f.id}
            onClick={() => {
              setRecipeId(null);
              setTask(f.id);
            }}
          >
            {f.label}
          </Chip>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "var(--space-l)" }}>
        {DIFF_FILTERS.map((f) => (
          <Chip key={f.id} active={diff === f.id} onClick={() => setDiff(f.id)}>
            {f.label}
          </Chip>
        ))}
        <Chip active={entry === "all"} onClick={() => setEntry("all")}>
          Любой вход
        </Chip>
        <Chip active={entry === "nocode"} onClick={() => setEntry("nocode")}>
          Low-code вход
        </Chip>
        <Chip active={entry === "code"} onClick={() => setEntry("code")}>
          Код + агент
        </Chip>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 0, border: "1px solid var(--color-border)", background: "var(--color-border)" }}>
        {filtered.map((t) => {
          const inStack = activeRecipe?.stack.includes(t.slug);
          return (
            <Link
              key={t.slug}
              href={`/sandbox/creative-library/${t.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: inStack ? "var(--color-accent-light)" : t.featured ? "var(--color-bg-secondary)" : "var(--color-bg-primary)",
                padding: "var(--space-l)",
                outline: "1px solid var(--color-border)",
                outlineOffset: -1,
                display: "flex",
                flexDirection: "column",
                minHeight: 230,
              }}
              className="cl-card"
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
                  {inStack ? "В стеке рецепта" : t.category}
                </span>
                <span style={{ fontSize: 10, fontWeight: 700, color: t.tier === 3 ? "var(--color-warning)" : t.tier === 1 ? "var(--color-accent)" : "var(--color-text-secondary)" }}>
                  {tierLabel(t.tier)}
                </span>
              </div>
              <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                {t.name}
                {t.featured && (
                  <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, color: "var(--color-accent)", verticalAlign: "middle" }}>
                    <Sparkles size={12} style={{ display: "inline", verticalAlign: -1 }} /> эталон
                  </span>
                )}
              </h2>
              <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55, margin: "0 0 auto", flex: 1 }}>{t.tagline}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
                <Tag>{difficultyLabel(t.difficulty)}</Tag>
                <Tag>{mobileLabel(t.mobile)}</Tag>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 12, fontWeight: 700, color: "var(--color-accent)" }}>
                Открыть карточку <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", borderTop: "none" }}>
          Ничего не найдено. Сбрось фильтры или измени запрос.
        </div>
      )}

      {/* Performance / FPS Killers */}
      <section style={{ marginTop: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
          <AlertTriangle size={18} style={{ color: "var(--color-warning)" }} />
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 800, margin: 0, letterSpacing: "-0.01em" }}>
            Performance / FPS Killers
          </h2>
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 var(--space-m)", maxWidth: 640 }}>
          Вайб умирает, если телефон греется и скролл лагает. Прочитай до того, как повесишь Three.js на весь сайт.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, border: "1px solid var(--color-border)" }}>
          {PERFORMANCE_KILLERS.map((item) => (
            <div
              key={item.title}
              style={{
                padding: "var(--space-m)",
                background: "var(--color-bg-primary)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
                <Zap size={16} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 2 }} />
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-s)" }}>{item.title}</div>
              </div>
              <div style={{ fontSize: 13, color: "var(--color-error)", lineHeight: 1.55, marginBottom: 6, paddingLeft: 26 }}>
                <strong>Опасно:</strong> {item.danger}
              </div>
              <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55, paddingLeft: 26 }}>
                <strong style={{ color: "var(--color-accent)" }}>Делай так:</strong> {item.doInstead}
              </div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .cl-card:hover, .cl-scenario:hover { background: var(--color-bg-tertiary) !important; }
      `}</style>
    </div>
  );
}

function AltBlock({ label, slugs }: { label: string; slugs: string[] }) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 8 }}>{label}</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {slugs.map((slug) => {
          const t = getCreativeTool(slug);
          if (!t) return null;
          return (
            <Link
              key={slug}
              href={`/sandbox/creative-library/${slug}`}
              style={{
                textDecoration: "none",
                padding: "6px 10px",
                border: "1px solid var(--color-border)",
                background: "var(--color-bg-primary)",
                color: "var(--color-text-secondary)",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {t.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "6px 12px",
        fontSize: 11,
        fontWeight: 600,
        cursor: "pointer",
        border: active ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
        background: active ? "var(--color-accent-light)" : "var(--color-bg-primary)",
        color: active ? "var(--color-accent)" : "var(--color-text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>
      {children}
    </span>
  );
}
