"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Clock, DollarSign, Wrench, ArrowRight } from "lucide-react";

export default function PatternsPageClient({ patterns }: any) {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? patterns : patterns.filter((p: any) => p.difficulty === filter);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-s)" }}>🆕 Новый раздел</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📦 Паттерны сборки</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          Готовые схемы для запуска AI-бизнесов. Выбери паттерн, изучи стек и сущности, нажми «Собрать» — и Blueprint проведёт тебя по шагам.
        </p>
      </div>

      {/* Comparison table */}
      <div style={{ marginBottom: "var(--space-xl)", overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead><tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            {["","Паттерн","Сложность","Запуск","Доход",""].map(h => <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "var(--color-text-tertiary)", fontWeight: 600 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((p: any) => {
              const outcome = JSON.parse(p.outcome || "{}");
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "10px 4px", fontSize: 20 }}>{p.difficulty === "beginner" ? "🟢" : p.difficulty === "intermediate" ? "🟡" : "🔴"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                    <Link href={`/patterns/${p.slug}`} style={{ color: "var(--color-accent)", textDecoration: "none" }}>{p.title}</Link>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{p.description?.substring(0, 80)}</div>
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: i <= outcome.complexity ? "var(--color-accent)" : "var(--color-border-light)" }} />)}</div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>
                    <Clock size={12} style={{ display: "inline", marginRight: 4 }} />{outcome.launchTime || p.timeToBuild}
                  </td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "var(--color-accent)" }}>
                    <DollarSign size={12} style={{ display: "inline" }} />{outcome.revenuePotential}/мес
                  </td>
                  <td style={{ padding: "10px 12px" }}>
                    <Link href={`/patterns/${p.slug}`} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600, whiteSpace: "nowrap" }}>
                      Собрать <ArrowRight size={12} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-l)" }}>
        {["all","beginner","intermediate","advanced"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: "6px 16px", borderRadius: 0, border: filter === f ? "2px solid var(--color-accent)" : "1px solid var(--color-border)", background: filter === f ? "var(--color-accent-light)" : "var(--color-bg-primary)", color: filter === f ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer" }}>
            {f === "all" ? "Все" : f === "beginner" ? "🟢 Новичок" : f === "intermediate" ? "🟡 Практик" : "🔴 Профи"}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-m)" }}>
        {filtered.map((p: any) => {
          const outcome = JSON.parse(p.outcome || "{}");
          const stack = JSON.parse(p.stack || "[]");
          return (
            <Link key={p.id} href={`/patterns/${p.slug}`} style={{ display: "flex", flexDirection: "column", padding: "var(--space-l)", background: "var(--color-bg-primary)", borderRadius: 0, border: "1px solid var(--color-border-light)", textDecoration: "none", color: "inherit" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
                <div style={{ fontWeight: 800, fontSize: "var(--text-m)" }}>{p.title}</div>
                <div style={{ display: "flex", gap: 1 }}>{[1,2,3,4,5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= Math.round(outcome.complexity/2) ? "var(--color-accent)" : "var(--color-border-light)" }} />)}</div>
              </div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-m)", flex: 1 }}>{p.description}</p>

              <div style={{ display: "flex", gap: 12, marginBottom: "var(--space-m)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  <Clock size={12} /> {outcome.launchTime || p.timeToBuild}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>
                  <DollarSign size={12} /> {outcome.revenuePotential}/мес
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                  <Wrench size={12} /> {outcome.maintenance || "—"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {stack.slice(0, 5).map((s: any, i: number) => (
                  <span key={i} style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", fontSize: 10, fontWeight: 600 }}>{s.tool}</span>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
