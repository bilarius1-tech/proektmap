"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles } from "lucide-react";
import {
  CREATIVE_TOOLS,
  SCENARIOS,
  TASK_FILTERS,
  difficultyLabel,
  mobileLabel,
  type CreativeDifficulty,
} from "@/lib/creative-library/data";

const DIFF_FILTERS: { id: "all" | CreativeDifficulty; label: string }[] = [
  { id: "all", label: "Любая сложность" },
  { id: "easy", label: "Легко с AI" },
  { id: "medium", label: "Средне" },
  { id: "hard", label: "Тяжело" },
];

export default function CreativeLibraryClient() {
  const [task, setTask] = useState("all");
  const [diff, setDiff] = useState<"all" | CreativeDifficulty>("all");
  const [q, setQ] = useState("");
  const [entry, setEntry] = useState<"all" | "code" | "nocode">("all");

  const filtered = useMemo(() => {
    return CREATIVE_TOOLS.filter((t) => {
      if (task !== "all" && !t.tasks.includes(task)) return false;
      if (diff !== "all" && t.difficulty !== diff) return false;
      if (entry === "nocode" && !["spline", "rive", "lottie"].includes(t.slug)) return false;
      if (entry === "code" && ["spline", "rive"].includes(t.slug)) return false;
      if (q) {
        const hay = `${t.name} ${t.tagline} ${t.category} ${t.designDNA}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => a.sortOrder - b.sortOrder);
  }, [task, diff, q, entry]);

  return (
    <div>
      {/* Scenarios */}
      <section style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)" }}>
          Мне нужно…
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 0, border: "1px solid var(--color-border)", background: "var(--color-border)" }}>
          {SCENARIOS.map((s) => (
            <button
              key={s.title}
              type="button"
              onClick={() => {
                const first = s.recommend[0];
                const tool = CREATIVE_TOOLS.find((t) => t.slug === first);
                if (tool?.tasks[0]) setTask(tool.tasks[0]);
                setDiff("all");
              }}
              style={{
                textAlign: "left",
                padding: "var(--space-m)",
                background: "var(--color-bg-primary)",
                border: "none",
                cursor: "pointer",
                outline: "1px solid var(--color-border)",
                outlineOffset: -1,
              }}
              className="cl-scenario"
            >
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-s)", marginBottom: 4 }}>{s.title}</div>
              <div style={{ fontSize: 12, color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>{s.desc}</div>
              <div style={{ fontSize: 11, color: "var(--color-accent)", fontWeight: 600 }}>
                {s.recommend.map((slug) => CREATIVE_TOOLS.find((t) => t.slug === slug)?.name).filter(Boolean).join(" · ")}
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
            placeholder="Поиск: GSAP, 3D, игра…"
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
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>{filtered.length} из {CREATIVE_TOOLS.length}</span>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {TASK_FILTERS.map((f) => (
          <Chip key={f.id} active={task === f.id} onClick={() => setTask(f.id)}>{f.label}</Chip>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "var(--space-l)" }}>
        {DIFF_FILTERS.map((f) => (
          <Chip key={f.id} active={diff === f.id} onClick={() => setDiff(f.id)}>{f.label}</Chip>
        ))}
        <Chip active={entry === "all"} onClick={() => setEntry("all")}>Любой вход</Chip>
        <Chip active={entry === "nocode"} onClick={() => setEntry("nocode")}>No-code вход</Chip>
        <Chip active={entry === "code"} onClick={() => setEntry("code")}>Код + агент</Chip>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 0, border: "1px solid var(--color-border)", background: "var(--color-border)" }}>
        {filtered.map((t) => (
          <Link
            key={t.slug}
            href={`/sandbox/creative-library/${t.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              background: t.featured ? "var(--color-bg-secondary)" : "var(--color-bg-primary)",
              padding: "var(--space-l)",
              outline: "1px solid var(--color-border)",
              outlineOffset: -1,
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
            className="cl-card"
          >
            <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-tertiary)" }}>
                {t.category}
              </span>
              {t.featured && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, fontWeight: 700, color: "var(--color-accent)" }}>
                  <Sparkles size={12} /> Эталон
                </span>
              )}
            </div>
            <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 800, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
              {t.name}
            </h2>
            <p style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.55, margin: "0 0 auto", flex: 1 }}>
              {t.tagline}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 14 }}>
              <Tag>{difficultyLabel(t.difficulty)}</Tag>
              <Tag>{mobileLabel(t.mobile)}</Tag>
              <Tag>{t.price}</Tag>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 14, fontSize: 12, fontWeight: 700, color: "var(--color-accent)" }}>
              Открыть карточку <ArrowRight size={14} />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ padding: "var(--space-xl)", textAlign: "center", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", borderTop: "none" }}>
          Ничего не найдено. Сбрось фильтры или измени запрос.
        </div>
      )}

      <style>{`
        .cl-card:hover, .cl-scenario:hover { background: var(--color-bg-tertiary) !important; }
      `}</style>
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
