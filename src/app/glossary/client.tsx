"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

const LEVELS: Record<string, { label: string; color: string; bg: string }> = {
  survival: { label: "Выживание", color: "#e53e3e", bg: "#fff5f5" },
  vibe: { label: "Вайбкодинг", color: "#0fb880", bg: "#f0fff4" },
  modern: { label: "AI", color: "#6c63ff", bg: "#f5f0ff" },
  senior: { label: "Старший", color: "#ed8936", bg: "#fffaf0" },
  jargon: { label: "Жаргон", color: "#d53f8c", bg: "#fff0f7" },
  coding: { label: "Программирование", color: "#2b6cb0", bg: "#ebf8ff" },
  stack: { label: "Стек", color: "#2d3748", bg: "#f7fafc" },
  db: { label: "БД", color: "#744210", bg: "#fffff0" },
  git: { label: "Git", color: "#c05621", bg: "#fffaf0" },
  deploy: { label: "Деплой", color: "#2f855a", bg: "#f0fff4" },
  saas: { label: "SaaS", color: "#6b46c1", bg: "#faf5ff" },
  seo: { label: "SEO", color: "#c53030", bg: "#fff5f5" },
  translate: { label: "Переводчик", color: "#d69e2e", bg: "#fffff0" },
};

export default function GlossaryClient({ terms }: { terms: any[] }) {
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("all");

  const levelNames = ["all", ...Array.from(new Set(terms.map((t: any) => t.level)))];
  const filtered = terms.filter((t: any) => {
    if (level !== "all" && t.level !== level) return false;
    if (search && !t.term.toLowerCase().includes(search.toLowerCase()) && !t.definition.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📖 Глоссарий вайбкодера</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          94 терминов, которые встречаются каждый день. От «Prompt» до «прокачать контекст».
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-l)", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 200 }}>
          <Search size={16} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по терминам..."
            style={{ width: "100%", padding: "10px 10px 10px 38px", fontSize: "var(--text-s)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {levelNames.map(l => {
            const info = LEVELS[l];
            const active = level === l;
            return (
              <button key={l} onClick={() => setLevel(l)} style={{
                padding: "6px 14px", borderRadius: "var(--radius-full)", border: active ? "2px solid " + (info?.color || "#999") : "1px solid var(--color-border)",
                background: active ? (info?.bg || "#fff") : "white", color: active ? (info?.color || "#333") : "var(--color-text-secondary)",
                fontSize: "var(--text-xs)", cursor: "pointer", fontWeight: active ? 700 : 500,
              }}>{l === "all" ? "Все" : info?.label || l}</button>
            );
          })}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "var(--space-s)" }}>
        {filtered.map((t: any) => {
          const info = LEVELS[t.level] || { label: t.level, color: "#999", bg: "#f5f5f5" };
          return (
            <Link key={t.id} href={`/glossary/${t.slug}`} style={{
              display: "flex", flexDirection: "column", padding: "var(--space-m)", background: "white",
              borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontWeight: 700, fontSize: "var(--text-s)", fontFamily: "var(--font-heading)", color: "var(--color-accent)" }}>{t.term}</span>
                <span style={{ fontSize: 9, padding: "1px 7px", borderRadius: 99, background: info.bg, color: info.color, fontWeight: 600 }}>{info.label}</span>
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                {t.simpleExplanation || t.definition.slice(0, 100)}
              </div>
            </Link>
          );
        })}
      </div>
      <div style={{ marginTop: "var(--space-m)", textAlign: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{filtered.length} из {terms.length} терминов</div>
    </div>
  );
}
