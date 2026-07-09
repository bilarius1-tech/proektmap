"use client";

import { Zap, Check, X, Globe, Shield, Wifi, WifiOff, ExternalLink } from "lucide-react";

interface Tool {
  id: string; name: string; provider: string; type: string;
  description: string; pros: string; cons: string;
  pricing: string; url: string;
  russianUi: boolean; russianSupport: boolean;
  requiresVpn: boolean; codeOwnership: boolean;
  rating: number; bestFor: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2 }}>
      {[1,2,3,4,5,6,7,8,9,10].map(i => (
        <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: i <= rating ? "var(--color-accent)" : "var(--color-border-light)" }} />
      ))}
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", marginLeft: 6 }}>{rating}/10</span>
    </div>
  );
}

export default function AIToolsPage({ tools }: { tools: Tool[] }) {
  const types = [
    { key: "ide", label: "💻 IDE / Редакторы" },
    { key: "no-code", label: "🧩 No-code конструкторы" },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>
          🛠️ AI-инструменты для разработки
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          Сравнение всех популярных AI-инструментов: IDE, no-code конструкторы, AI-агенты.
          Плюсы, минусы, цены, поддержка русского языка, нужен ли VPN.
        </p>
      </div>

      {types.map(tp => {
        const groupTools = tools.filter((t: Tool) => t.type === tp.key);
        if (!groupTools.length) return null;
        return (
          <div key={tp.key} style={{ marginBottom: "var(--space-xl)" }}>
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-m)" }}>{tp.label}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "var(--space-m)" }}>
              {groupTools.map((t: Tool) => {
                const prosArr = JSON.parse(t.pros || "[]");
                const consArr = JSON.parse(t.cons || "[]");
                return (
                  <div key={t.id} style={{
                    padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-s)",
                    border: "1px solid var(--color-border-light)", display: "flex", flexDirection: "column",
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

                    {/* Pros */}
                    <div style={{ marginBottom: "var(--space-s)" }}>
                      <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "#065f46", marginBottom: 4 }}>✅ Плюсы</div>
                      {prosArr.map((p: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 2, lineHeight: 1.5 }}>
                          <Check size={12} style={{ color: "#22c55e", marginTop: 2, flexShrink: 0 }} /> {p}
                        </div>
                      ))}
                    </div>

                    {/* Cons */}
                    <div style={{ marginBottom: "var(--space-s)" }}>
                      <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>❌ Минусы</div>
                      {consArr.map((c: string, i: number) => (
                        <div key={i} style={{ display: "flex", gap: 6, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 2, lineHeight: 1.5 }}>
                          <X size={12} style={{ color: "#ef4444", marginTop: 2, flexShrink: 0 }} /> {c}
                        </div>
                      ))}
                    </div>

                    {/* Badges */}
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                      {t.russianUi && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 600 }}>🇷🇺 Русский UI</span>}
                      {t.russianSupport && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#eff6ff", color: "#1e40af", fontSize: 10, fontWeight: 600 }}>💬 Русская поддержка</span>}
                      {t.requiresVpn && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#fef2f2", color: "#991b1b", fontSize: 10, fontWeight: 600 }}>🔐 Нужен VPN</span>}
                      {!t.requiresVpn && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 600 }}>🌐 Без VPN</span>}
                      {t.codeOwnership && <span style={{ padding: "2px 8px", borderRadius: "var(--radius-s)", background: "#f5f5f3", color: "var(--color-text-secondary)", fontSize: 10, fontWeight: 600 }}>📦 Код ваш</span>}
                    </div>

                    {/* Pricing + Link */}
                    <div style={{ marginTop: "auto", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>{t.pricing}</span>
                      <a href={t.url} target="_blank" rel="noopener" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none" }}>
                        <ExternalLink size={12} /> Сайт
                      </a>
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
              {tools.map((t: Tool) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>{t.name}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{t.type === "ide" ? "💻 IDE" : "🧩 No-code"}</td>
                  <td style={{ padding: "10px 12px" }}><StarRating rating={t.rating} /></td>
                  <td style={{ padding: "10px 12px" }}>{t.russianUi ? "✅" : "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{t.requiresVpn ? "⚠️ Нужен" : "✅ Нет"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "var(--color-accent)" }}>{t.pricing}</td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)", fontSize: "var(--text-xs)" }}>{t.bestFor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
