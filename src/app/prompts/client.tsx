"use client";
import { useState } from "react";
import Link from "next/link";
import { Star, Clock, Zap, Copy, Check, ChevronDown, Layers, ExternalLink, BarChart3 } from "lucide-react";

const CATEGORIES = ["System","Агент","MCP","Cursor Rule","Windsurf Rule","Универсальный"];

export default function PromptsPageClient({ prompts, total, variables, categories, page, perPage }: any) {
  const [activeCat, setActiveCat] = useState("all");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = activeCat === "all" ? prompts : prompts.filter((p: any) => p.category === activeCat);
  const totalPages = Math.ceil(total / perPage);

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-s)" }}>
          <Zap size={14} /> {total} инженерных решений
        </div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>💬 Библиотека промптов</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          Не просто тексты — инженерные решения. System Prompt, Agent Prompt, MCP, Cursor Rules.
          Со статистикой эффективности, эволюцией и связями с паттернами.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: "var(--space-l)" }}>
        <button onClick={() => setActiveCat("all")}
          style={{ padding: "6px 16px", borderRadius: 0, border: activeCat === "all" ? "2px solid var(--color-accent)" : "1px solid var(--color-border)", background: activeCat === "all" ? "var(--color-accent-light)" : "var(--color-bg-primary)", color: activeCat === "all" ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer" }}>
          Все ({total})
        </button>
        {CATEGORIES.map(cat => {
          const count = prompts.filter((p: any) => p.category === cat).length;
          if (!count) return null;
          return (
            <button key={cat} onClick={() => setActiveCat(cat)}
              style={{ padding: "6px 16px", borderRadius: 0, border: activeCat === cat ? "2px solid var(--color-accent)" : "1px solid var(--color-border)", background: activeCat === cat ? "var(--color-accent-light)" : "var(--color-bg-primary)", color: activeCat === cat ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer" }}>
              {cat} ({count})
            </button>
          );
        })}
      </div>

      {/* Cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
        {filtered.map((p: any) => {
          const stats = JSON.parse(p.stats || "{}");
          const compatibility = JSON.parse(p.compatibility || "[]");
          const evolution = JSON.parse(p.evolution || "[]");
          const dependencies = JSON.parse(p.dependencies || "[]");
          const isOpen = expanded === p.id;

          return (
            <div key={p.id} style={{
              padding: "var(--space-l)", background: "var(--color-bg-primary)", borderRadius: 0,
              border: p.isFeatured ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
              position: "relative",
            }}>
              {p.isFeatured && <div style={{ position: "absolute", top: -1, right: 12, padding: "2px 10px", borderRadius: "0 0 0 0", background: "var(--color-accent)", color: "white", fontSize: 9, fontWeight: 700 }}>⭐ Выбор редакции</div>}

              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", fontWeight: 600 }}>{p.category}</span>
                    <span style={{ fontWeight: 800, fontSize: "var(--text-m)", color: "var(--color-text-primary)" }}>{p.title}</span>
                  </div>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 8 }}>{p.description}</p>
                </div>

                {/* RPG Stats */}
                <div style={{ display: "flex", gap: 16, alignItems: "center", flexShrink: 0 }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Сложность</div>
                    <div style={{ display: "flex", gap: 1 }}>
                      {[1,2,3,4,5].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: i <= Math.round((stats.complexity||3)/2) ? "var(--color-warning)" : "var(--color-border-light)" }} />)}
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Качество</div>
                    <div style={{ fontWeight: 800, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>{p.qualityScore || 85}/100</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Экономия</div>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
                      <Clock size={10} style={{ display: "inline" }} /> {p.timeSaved || "4ч"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Compatibility badges */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                {compatibility.map((c: string) => (
                  <span key={c} style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", fontSize: 9, color: "var(--color-text-secondary)" }}>{c}</span>
                ))}
                {dependencies.slice(0, 3).map((d: string) => (
                  <span key={d} style={{ padding: "2px 8px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", fontSize: 9, color: "var(--color-accent)", fontWeight: 600 }}>📦 {d}</span>
                ))}
              </div>

              {/* Expand button */}
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setExpanded(isOpen ? null : p.id)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", color: "var(--color-text-secondary)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer" }}>
                  <Layers size={12} /> {isOpen ? "Свернуть" : "System + User Prompt"}
                </button>
                <button onClick={() => copyToClipboard(p.systemPrompt + "\n\n" + p.userPrompt, p.id)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 14px", borderRadius: 0, border: "1px solid var(--color-accent)", background: copied === p.id ? "var(--color-accent)" : "var(--color-bg-primary)", color: copied === p.id ? "white" : "var(--color-accent)", fontWeight: 600, fontSize: "var(--text-xs)", cursor: "pointer" }}>
                  {copied === p.id ? <><Check size={12} /> Скопировано!</> : <><Copy size={12} /> Скопировать стек</>}
                </button>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ marginTop: "var(--space-m)", paddingTop: "var(--space-m)", borderTop: "1px solid var(--color-border-light)", animation: "expandIn 0.2s ease" }}>
                  <div style={{ display: "flex", gap: "var(--space-m)", flexDirection: "row", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 300px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase" }}>System Prompt</div>
                      <div style={{ padding: "var(--space-s)", background: "var(--color-bg-secondary)", borderRadius: 0, fontSize: "var(--text-xs)", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.5, maxHeight: 200, overflow: "auto" }}>
                        {p.systemPrompt}
                      </div>
                    </div>
                    <div style={{ flex: "1 1 300px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase" }}>User Prompt</div>
                      <div style={{ padding: "var(--space-s)", background: "var(--color-bg-secondary)", borderRadius: 0, fontSize: "var(--text-xs)", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.5, maxHeight: 200, overflow: "auto" }}>
                        {p.userPrompt}
                      </div>
                    </div>
                  </div>

                  {/* Evolution */}
                  {evolution.length > 0 && (
                    <div style={{ marginTop: "var(--space-m)" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase" }}>Эволюция</div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        {evolution.map((ev: any, i: number) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ textAlign: "center" }}>
                              <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--color-accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{i + 1}</div>
                              <div style={{ fontSize: 8, color: "var(--color-text-tertiary)", marginTop: 2 }}>{ev.version}</div>
                            </div>
                            {i < evolution.length - 1 && <div style={{ width: 20, height: 2, background: "var(--color-border)" }} />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* When to / Not to use */}
                  <div style={{ display: "flex", gap: "var(--space-m)", marginTop: "var(--space-m)", flexWrap: "wrap" }}>
                    <div style={{ flex: "1 1 250px", padding: "var(--space-s)", background: "#ecfdf5", borderRadius: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#065f46", marginBottom: 4 }}>✅ Когда использовать</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "#065f46", lineHeight: 1.5 }}>{p.whenToUse}</div>
                    </div>
                    <div style={{ flex: "1 1 250px", padding: "var(--space-s)", background: "#fef2f2", borderRadius: 0 }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#991b1b", marginBottom: 4 }}>❌ Когда НЕ использовать</div>
                      <div style={{ fontSize: "var(--text-xs)", color: "#991b1b", lineHeight: 1.5 }}>{p.whenNotUse}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`@keyframes expandIn { from { opacity: 0; max-height: 0 } to { opacity: 1; max-height: 500px } }`}</style>
    </div>
  );
}
