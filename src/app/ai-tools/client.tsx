"use client";

import { useState } from "react";
import { Check, X, ExternalLink, Filter, ArrowUpDown, Eye, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string; name: string; provider: string; type: string;
  description: string; pros: string; cons: string;
  pricing: string; url: string;
  russianUi: boolean; russianSupport: boolean;
  requiresVpn: boolean; codeOwnership: boolean;
  rating: number; bestFor: string; sortOrder: number;
  howToStart: string; faqItems: string; detailDescription: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= Math.round(rating/2) ? "var(--color-accent)" : "var(--color-border-light)" }} />
      ))}
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", marginLeft: 4 }}>{rating}/10</span>
    </div>
  );
}

export default function AIToolsPage({ tools }: { tools: Tool[] }) {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterVpn, setFilterVpn] = useState<string>("all");
  const [filterRussian, setFilterRussian] = useState<string>("all");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const filtered = tools.filter(t => {
    if (filterType !== "all" && t.type !== filterType) return false;
    if (filterVpn === "no" && t.requiresVpn) return false;
    if (filterVpn === "yes" && !t.requiresVpn) return false;
    if (filterRussian === "yes" && !t.russianUi) return false;
    return true;
  });

  const compareTools = tools.filter(t => compareIds.has(t.id));

  function toggleCompare(id: string) {
    const next = new Set(compareIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    setCompareIds(next);
  }

  const types = [
    { key: "ide", label: "💻 IDE / Редакторы", count: tools.filter(t=>t.type==="ide").length },
    { key: "no-code", label: "🧩 No-code конструкторы", count: tools.filter(t=>t.type==="no-code").length },
  ];

  // Sorting: Russian-first, then by rating descending
  const sorted = [...filtered].sort((a, b) => {
    if (a.russianUi && !b.russianUi) return -1;
    if (!a.russianUi && b.russianUi) return 1;
    return b.rating - a.rating;
  });

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>
          🛠️ AI-инструменты для разработки
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          Полный обзор {tools.length} AI-инструментов. Сравнение IDE, no-code конструкторов, CLI-агентов.
          Плюсы и минусы, цены, нужен ли VPN, поддержка русского языка.
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginBottom: "var(--space-l)", alignItems: "center" }}>
        <Filter size={14} style={{ color: "var(--color-text-tertiary)" }} />
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          style={{ padding: "6px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
          <option value="all">Все типы ({tools.length})</option>
          <option value="ide">💻 IDE / Редакторы</option>
          <option value="no-code">🧩 No-code конструкторы</option>
        </select>
        <select value={filterVpn} onChange={e => setFilterVpn(e.target.value)}
          style={{ padding: "6px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
          <option value="all">VPN: не важно</option>
          <option value="no">🌐 Без VPN</option>
          <option value="yes">🔐 Нужен VPN</option>
        </select>
        <select value={filterRussian} onChange={e => setFilterRussian(e.target.value)}
          style={{ padding: "6px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
          <option value="all">Язык: любой</option>
          <option value="yes">🇷🇺 Русский интерфейс</option>
        </select>
        {compareIds.size > 0 && (
          <button onClick={() => setCompareIds(new Set())} style={{ padding: "6px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600, cursor: "pointer" }}>
            Сбросить сравнение ({compareIds.size})
          </button>
        )}
      </div>

      {/* Compare panel */}
      {compareTools.length >= 2 && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📊 Сравнение: {compareTools.map(t=>t.name).join(" vs ")}</h2>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                  <th style={{ textAlign: "left", padding: "8px 12px" }}>Критерий</th>
                  {compareTools.map(t => (
                    <th key={t.id} style={{ textAlign: "left", padding: "8px 12px", fontWeight: 700 }}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {([
                  ["Тип", (t: Tool) => t.type === "ide" ? "💻 IDE" : "🧩 No-code"],
                  ["Рейтинг", (t: Tool) => t.rating + "/10"],
                  ["Цена", (t: Tool) => t.pricing],
                  ["VPN", (t: Tool) => t.requiresVpn ? "🔐 Нужен" : "🌐 Не нужен"],
                  ["Русский UI", (t: Tool) => t.russianUi ? "✅ Да" : "❌ Нет"],
                  ["Код ваш", (t: Tool) => t.codeOwnership ? "✅ Да" : "❌ Нет"],
                  ["Для кого", (t: Tool) => t.bestFor],
                ] as [string, (t: Tool) => string][]).map(([label, fn]) => (
                  <tr key={label as string} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                    <td style={{ padding: "8px 12px", fontWeight: 600, color: "var(--color-text-secondary)" }}>{label}</td>
                    {compareTools.map(t => (
                      <td key={t.id} style={{ padding: "8px 12px" }}>{(fn as any)(t)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tool cards */}
      {types.map(tp => {
        const groupTools = sorted.filter(t => t.type === tp.key);
        if (!groupTools.length) return null;
        return (
          <div key={tp.key} style={{ marginBottom: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>
              {tp.label} <span style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)", fontWeight: 400 }}>({groupTools.length})</span>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-m)" }}>
              {groupTools.map((t: Tool) => {
                const prosArr = JSON.parse(t.pros || "[]");
                const consArr = JSON.parse(t.cons || "[]");
                const isCompared = compareIds.has(t.id);
                return (
                  <div key={t.id} style={{
                    padding: "var(--space-l)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)",
                    border: isCompared ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
                    display: "flex", flexDirection: "column",
                    position: "relative",
                  }}>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: "var(--text-m)" }}>{t.name}</div>
                        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{t.provider}</div>
                      </div>
                      <StarRating rating={t.rating} />
                    </div>

                    <div style={{ fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-accent)", marginBottom: "var(--space-s)" }}>
                      {t.bestFor}
                    </div>

                    {/* Badges */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                      {t.russianUi && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "var(--color-accent)", fontSize: 10, fontWeight: 600 }}>🇷🇺 UI</span>}
                      {!t.requiresVpn && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "var(--color-accent)", fontSize: 10, fontWeight: 600 }}>🌐 Без VPN</span>}
                      {t.requiresVpn && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#fef2f2", color: "var(--color-error)", fontSize: 10, fontWeight: 600 }}>🔐 VPN</span>}
                    </div>

                    {/* Pros/Cons */}
                    <div style={{ display: "flex", gap: "var(--space-m)", marginBottom: "var(--space-s)" }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", marginBottom: 4 }}>✅ Плюсы</div>
                        {prosArr.slice(0, 3).map((p: string, i: number) => (
                          <div key={i} style={{ display: "flex", gap: 4, fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 2, lineHeight: 1.4 }}>
                            <Check size={10} style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }} /> {p}
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-error)", marginBottom: 4 }}>❌ Минусы</div>
                        {consArr.slice(0, 3).map((c: string, i: number) => (
                          <div key={i} style={{ display: "flex", gap: 4, fontSize: 10, color: "var(--color-text-secondary)", marginBottom: 2, lineHeight: 1.4 }}>
                            <X size={10} style={{ color: "#ef4444", marginTop: 2, flexShrink: 0 }} /> {c}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bottom */}
                    <div style={{ marginTop: "auto", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>{t.pricing}</span>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <button onClick={() => toggleCompare(t.id)}
                          style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", border: isCompared ? "1px solid var(--color-accent)" : "1px solid var(--color-border)", background: isCompared ? "var(--color-accent)" : "white", color: isCompared ? "white" : "var(--color-text-secondary)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                          <ArrowUpDown size={10} style={{ display: "inline", marginRight: 2 }} />
                          {isCompared ? "В сравнении" : "Сравнить"}
                        </button>
                        <a href={t.url} target="_blank" rel="noopener" style={{ color: "var(--color-text-secondary)", display: "flex", alignItems: "center" }}>
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Summary table */}
      <div style={{ marginTop: "var(--space-xl)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📊 Сводная таблица</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
                {["Инструмент","Тип","Рейтинг","Русский","VPN","Цена","Лучше всего для"].map(h => (
                  <th key={h} style={{ textAlign: "left", padding: "10px 12px", color: "var(--color-text-tertiary)", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((t: Tool) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                    {t.name}
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{t.provider}</div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{t.type === "ide" ? "💻 IDE" : "🧩 No-code"}</td>
                  <td style={{ padding: "10px 12px" }}><StarRating rating={t.rating} /></td>
                  <td style={{ padding: "10px 12px" }}>{t.russianUi ? "✅" : "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{t.requiresVpn ? "⚠️ Нужен" : "✅ Нет"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "var(--color-accent)" }}>{t.pricing}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)", fontSize: 10 }}>{t.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
