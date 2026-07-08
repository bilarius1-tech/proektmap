"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Link from "next/link";

const LEVELS: Record<string, { label: string; color: string; bg: string }> = {
  survival: { label: "Выживание", color: "#e53e3e", bg: "#fff5f5" },
  vibe: { label: "Вайбкодинг", color: "#0fb880", bg: "#f0fff4" },
  modern: { label: "AI", color: "#6c63ff", bg: "#f5f0ff" },
  senior: { label: "Старший", color: "#ed8936", bg: "#fffaf0" },
  jargon: { label: "Жаргон", color: "#d53f8c", bg: "#fff0f7" },
};

export default function GlossaryBlock({ terms }: { terms: any[] }) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? terms.filter((t: any) => t.term.toLowerCase().includes(search.toLowerCase()))
    : terms.slice(0, 6);

  return (
    <div style={{ marginTop: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)", flexWrap: "wrap", gap: 8 }}>
        <h3 style={{ fontSize: "var(--text-l)", fontWeight: 800, margin: 0 }}>📖 Глоссарий вайбкодера</h3>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
            style={{ padding: "6px 6px 6px 30px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", outline: "none", width: 160 }} />
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "var(--space-s)", marginBottom: "var(--space-s)" }}>
        {filtered.map((t: any) => {
          const info = LEVELS[t.level] || { label: "", color: "#999", bg: "#f5f5f5" };
          return (
            <Link key={t.id} href={`/glossary/${t.slug}`} style={{
              padding: "10px 14px", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)",
              textDecoration: "none", color: "inherit",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                <span style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>{t.term}</span>
                <span style={{ fontSize: 8, padding: "1px 6px", borderRadius: 99, background: info.bg, color: info.color }}>{info.label}</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-secondary)", lineHeight: 1.4 }}>{t.simpleExplanation}</div>
            </Link>
          );
        })}
      </div>

      <Link href="/glossary" style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", fontWeight: 600, textDecoration: "none" }}>
        Все 40 терминов →
      </Link>
    </div>
  );
}
