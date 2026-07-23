"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Star, ArrowUpDown, ExternalLink, X } from "lucide-react";
import Link from "next/link";

interface Tool {
  id: string; name: string; slug: string; provider: string; type: string;
  description: string; pros: string; cons: string;
  pricing: string; pricingAmount: string; url: string;
  russianUi: boolean; russianSupport: boolean;
  requiresVpn: boolean; requiresForeignCard: boolean;
  codeOwnership: boolean; rating: number; bestFor: string; sortOrder: number;
  howToStart: string; faqItems: string; detailDescription: string;
  hiddenFeatures: string; ourTake: string; detailComparison: string;
  downloadUrl: string; createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center" }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ width: 8, height: 8, borderRadius: 0, background: i <= Math.round(rating/2) ? "var(--color-accent)" : "var(--color-border-light)" }} />
      ))}
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-accent)", marginLeft: 4 }}>{rating}/10</span>
    </div>
  );
}

const typeLabels: Record<string, { icon: string; label: string }> = {
  ide: { icon: "💻", label: "IDE" },
  "no-code": { icon: "🧩", label: "No-code" },
  agent: { icon: "🤖", label: "Агент" },
  assistant: { icon: "💬", label: "Ассистент" },
};

function isNew(createdAt: string): boolean {
  if (!createdAt) return false;
  const created = new Date(createdAt);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  return created > thirtyDaysAgo;
}

function getFirstLine(text: string): string {
  if (!text) return "";
  const lines = text.split(/[.。!?\n]/);
  const first = lines.find(l => l.trim().length > 10);
  return first ? first.trim() : text.substring(0, 120);
}

// Wizard
function Wizard({ tools }: { tools: Tool[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Tool[]>([]);

  const questions = [
    { key: "task", label: "🤔 Что делаешь?", options: ["сайт", "SaaS", "бот", "агент", "игра", "учёба"] },
    { key: "budget", label: "💰 Бюджет?", options: ["бесплатно", "до 0/мес", "без ограничений"] },
    { key: "russia", label: "🇷🇺 Россия?", options: ["да", "нет", "всё равно"] },
  ];

  function answer(key: string, value: string) {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // Calculate recommendations
    let scored = tools.map(t => {
      let score = 0;
      const a = newAnswers;

      // Task matching
      if (a.task === "сайт" && (t.type === "no-code" || t.name.includes("V0") || t.name.includes("Lovable") || t.name.includes("Vibecraft"))) score += 3;
      if (a.task === "SaaS" && (t.type === "ide" || t.name.includes("Bolt") || t.name.includes("V0"))) score += 3;
      if (a.task === "бот" && (t.type === "ide" || t.name.includes("Cursor") || t.name.includes("Claude"))) score += 2;
      if (a.task === "агент" && (t.name.includes("Claude") || t.name.includes("Reasonix") || t.name.includes("Cursor Agent"))) score += 3;
      if (a.task === "игра" && (t.type === "ide")) score += 2;
      if (a.task === "учёба" && (t.name.includes("Replit") || t.name.includes("Bolt") || t.name.includes("Vibecraft"))) score += 3;

      // Budget matching
      if (a.budget === "бесплатно" && (t.pricingAmount || t.pricing || "").toLowerCase().includes("бесплатн")) score += 3;
      if (a.budget === "до 0/мес" && !(t.pricingAmount || "").toLowerCase().includes("00")) score += 2;
      if (a.budget === "без ограничений") score += 2;

      // Russia matching
      if (a.russia === "да" && t.russianUi) score += 3;
      if (a.russia === "да" && t.requiresVpn) score -= 5;
      if (a.russia === "нет" && !t.russianUi) score += 1;
      if (a.russia === "всё равно") score += 1;

      // Base rating bonus
      score += t.rating / 3;

      return { tool: t, score };
    });

    scored.sort((a, b) => b.score - a.score);
    setResult(scored.slice(0, 2).map(s => s.tool));
    setStep(step + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResult([]);
  }

  if (step === questions.length) {
    return (
      <div style={{ marginBottom: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: 0, border: "1px solid var(--color-accent)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, fontFamily: "var(--font-heading)", margin: 0 }}>🎯 Рекомендуем</h2>
          <button onClick={reset} style={{ padding: "4px 12px", borderRadius: 0, border: "1px solid var(--color-border)", background: "white", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>Пройти заново</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-m)" }}>
          {result.map(t => (
            <Link key={t.id} href={"/ai-tools/" + t.slug}
              style={{
                padding: "var(--space-m)", background: "white", borderRadius: 0, border: "2px solid var(--color-accent)",
                textDecoration: "none", color: "inherit", display: "block",
              }}>
              <div style={{ fontWeight: 800, fontSize: "var(--text-m)", fontFamily: "var(--font-heading)", marginBottom: 4 }}>{t.name}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: 8 }}>{t.provider}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ padding: "2px 8px", background: "var(--color-bg-secondary)", fontSize: 10, fontWeight: 600 }}>{(typeLabels[t.type] || {}).label}</span>
                <span style={{ padding: "2px 8px", background: "var(--color-bg-secondary)", fontSize: 10, fontWeight: 600, color: "var(--color-accent)" }}>{t.pricingAmount || t.pricing}</span>
              </div>
              <StarRating rating={t.rating} />
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div style={{ marginBottom: "var(--space-xl)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: 0, border: "1px solid var(--color-border-light)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
        <h2 style={{ fontSize: "var(--text-m)", fontWeight: 700, fontFamily: "var(--font-heading)", margin: 0 }}>🔍 Подобрать инструмент</h2>
        <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{step + 1}/{questions.length}</span>
      </div>
      <div style={{ fontSize: "var(--text-m)", fontWeight: 600, marginBottom: "var(--space-m)" }}>{q.label}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {q.options.map(opt => (
          <button key={opt} onClick={() => answer(q.key, opt)}
            style={{
              padding: "10px 20px", borderRadius: 0, border: "2px solid var(--color-accent)",
              background: answers[q.key] === opt ? "var(--color-accent)" : "white",
              color: answers[q.key] === opt ? "white" : "var(--color-accent)",
              fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer",
              textTransform: "capitalize",
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AIToolsPage({ tools }: { tools: Tool[] }) {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const tabs = [
    { key: "all", label: "🌍 Все", count: tools.length },
    { key: "russian", label: "🇷🇺 Российские", count: tools.filter(t => t.russianUi).length },
    { key: "free", label: "🆓 Бесплатные", count: tools.filter(t => (t.pricingAmount || t.pricing || "").toLowerCase().includes("бесплатн") || (t.pricingAmount || t.pricing || "").toLowerCase().includes("free")).length },
    { key: "ide", label: "💻 IDE", count: tools.filter(t => t.type === "ide").length },
    { key: "no-code", label: "🧩 No-code", count: tools.filter(t => t.type === "no-code").length },
  ];

  const filtered = useMemo(() => {
    let result = tools;
    if (activeTab === "russian") result = result.filter(t => t.russianUi);
    if (activeTab === "free") result = result.filter(t => (t.pricingAmount || t.pricing || "").toLowerCase().includes("бесплатн") || (t.pricingAmount || t.pricing || "").toLowerCase().includes("free"));
    if (activeTab === "ide") result = result.filter(t => t.type === "ide");
    if (activeTab === "no-code") result = result.filter(t => t.type === "no-code");
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.provider.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    // Sort: Russian first, then by rating desc
    result = [...result].sort((a, b) => {
      if (a.russianUi && !b.russianUi) return -1;
      if (!a.russianUi && b.russianUi) return 1;
      return b.rating - a.rating;
    });
    return result;
  }, [tools, activeTab, search]);

  function toggleCompare(id: string) {
    const next = new Set(compareIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    setCompareIds(next);
  }

  const compareTools = tools.filter(t => compareIds.has(t.id));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 900, marginBottom: "var(--space-xs)", fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}>
          🛠️ AI-инструменты для разработки
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          Полный обзор {tools.length} AI-инструментов. Сравнение IDE, no-code конструкторов, CLI-агентов.
          Плюсы и минусы, цены, нужен ли VPN, поддержка русского языка.
        </p>
      </div>

      {/* Wizard */}
      <Wizard tools={tools} />

      {/* Search + Tabs */}
      <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", marginBottom: "var(--space-m)", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "7px 16px", borderRadius: 0, border: activeTab === tab.key ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                background: activeTab === tab.key ? "var(--color-accent-light)" : "var(--color-bg-primary)",
                color: activeTab === tab.key ? "var(--color-accent)" : "var(--color-text-secondary)",
                fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
              }}>
              {tab.label} <span style={{ opacity: 0.5, marginLeft: 2 }}>({tab.count})</span>
            </button>
          ))}
        </div>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "var(--color-text-tertiary)" }} />
          <input type="text" placeholder="Поиск инструментов..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding: "8px 12px 8px 32px", borderRadius: 0, border: "1px solid var(--color-border)", fontSize: "var(--text-xs)", width: 200, outline: "none" }} />
        </div>
      </div>

      {/* Compare bar */}
      {compareIds.size > 0 && (
        <div style={{ marginBottom: "var(--space-m)", padding: "var(--space-s) var(--space-m)", background: "var(--color-accent-light)", borderRadius: 0, border: "1px solid var(--color-accent)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-accent)" }}>
            Сравнение: {compareTools.map(t => t.name).join(" vs ")} ({compareIds.size}/3)
          </span>
          <button onClick={() => setCompareIds(new Set())} style={{ padding: "4px 10px", borderRadius: 0, border: "1px solid var(--color-accent)", background: "transparent", color: "var(--color-accent)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
            Сбросить
          </button>
        </div>
      )}

      {/* Compare table */}
      {compareTools.length >= 2 && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: 0, border: "1px solid var(--color-accent)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>📊 Сравнение</h2>
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
                  ["Тип", (t: Tool) => (typeLabels[t.type] || {}).icon + " " + t.type],
                  ["Рейтинг", (t: Tool) => t.rating + "/10"],
                  ["Цена", (t: Tool) => t.pricingAmount || t.pricing],
                  ["VPN", (t: Tool) => t.requiresVpn ? "🔐 Нужен" : "🌍 Не нужен"],
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

      {/* Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "var(--space-m)" }}>
        {filtered.map((t: Tool) => {
          const isCompared = compareIds.has(t.id);
          const editorChoice = t.rating >= 9;
          const newBadge = isNew(t.createdAt);
          const quickDesc = getFirstLine(t.description);
          return (
            <Link key={t.id} href={"/ai-tools/" + t.slug}
              style={{
                padding: "var(--space-l)", background: "var(--color-bg-primary)", borderRadius: 0,
                border: isCompared ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
                display: "flex", flexDirection: "column", textDecoration: "none", color: "inherit",
                transition: "border-color 0.15s, box-shadow 0.15s",
                position: "relative",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--color-accent)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = isCompared ? "var(--color-accent)" : "var(--color-border-light)"; e.currentTarget.style.boxShadow = "none"; }}
            >
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "var(--text-m)", fontFamily: "var(--font-heading)", display: "flex", alignItems: "center", gap: 6 }}>
                    {t.name}
                    {editorChoice && <span style={{ fontSize: 10 }} title="Выбор редакции">⭐</span>}
                    {newBadge && <span style={{ fontSize: 10 }} title="Новинка">🆕</span>}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{t.provider}</div>
                </div>
                <StarRating rating={t.rating} />
              </div>

              {/* Type + price */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)" }}>
                <span style={{ padding: "2px 8px", borderRadius: 0, background: "var(--color-bg-secondary)", fontSize: 10, fontWeight: 600, color: "var(--color-text-secondary)" }}>
                  {(typeLabels[t.type] || {}).icon} {(typeLabels[t.type] || {}).label || t.type}
                </span>
                <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>{t.pricingAmount || t.pricing}</span>
              </div>

              {/* Badges */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-s)" }}>
                {t.russianUi ? (
                  <span style={{ padding: "2px 8px", borderRadius: 0, background: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 600 }}>🇷🇺 Русский</span>
                ) : (
                  <span style={{ padding: "2px 8px", borderRadius: 0, background: "#eff6ff", color: "#1e40af", fontSize: 10, fontWeight: 600 }}>🌍 Международный</span>
                )}
                {!t.requiresVpn && <span style={{ padding: "2px 8px", borderRadius: 0, background: "#ecfdf5", color: "#065f46", fontSize: 10, fontWeight: 600 }}>🌍 Без VPN</span>}
                {t.requiresVpn && <span style={{ padding: "2px 8px", borderRadius: 0, background: "#fef2f2", color: "#991b1b", fontSize: 10, fontWeight: 600 }}>🔐 VPN</span>}
                {t.requiresForeignCard && <span style={{ padding: "2px 8px", borderRadius: 0, background: "#fffbeb", color: "#92400e", fontSize: 10, fontWeight: 600 }}>💳 Карта</span>}
              </div>

              {/* Quick description — 1-line "Суть" */}
              {quickDesc && (
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: "var(--space-s)", flex: 1 }}>
                  💡 {quickDesc}{quickDesc.length > 100 ? "..." : ""}
                </div>
              )}

              {/* Best for hint */}
              {t.bestFor && (
                <div style={{ fontSize: 10, color: "var(--color-accent)", fontWeight: 600, marginBottom: "var(--space-s)" }}>
                  🎯 {t.bestFor?.substring(0, 80)}
                </div>
              )}

              {/* Bottom actions */}
              <div style={{ marginTop: "auto", paddingTop: "var(--space-s)", borderTop: "1px solid var(--color-border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 600 }}>Подробнее →</span>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleCompare(t.id); }}
                  style={{ padding: "4px 10px", borderRadius: 0, border: isCompared ? "1px solid var(--color-accent)" : "1px solid var(--color-border)", background: isCompared ? "var(--color-accent)" : "white", color: isCompared ? "white" : "var(--color-text-secondary)", fontSize: 10, cursor: "pointer", fontWeight: 600 }}>
                  <ArrowUpDown size={10} style={{ display: "inline", marginRight: 2 }} />
                  {isCompared ? "В сравнении" : "Сравнить"}
                </button>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          Инструменты не найдены. Попробуйте изменить фильтры.
        </div>
      )}

      {/* Summary table */}
      <div style={{ marginTop: "var(--space-xl)" }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 700, marginBottom: "var(--space-m)", fontFamily: "var(--font-heading)" }}>📊 Сводная таблица</h2>
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
              {filtered.map((t: Tool) => (
                <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "10px 12px", fontWeight: 700 }}>
                    <Link href={"/ai-tools/" + t.slug} style={{ color: "var(--color-accent)", textDecoration: "none" }}>
                      {t.name}
                      {t.rating >= 9 && <span style={{ marginLeft: 4 }}>⭐</span>}
                      {isNew(t.createdAt) && <span style={{ marginLeft: 4 }}>🆕</span>}
                    </Link>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{t.provider}</div>
                  </td>
                  <td style={{ padding: "10px 12px", color: "var(--color-text-secondary)" }}>{(typeLabels[t.type] || {}).icon} {(typeLabels[t.type] || {}).label || t.type}</td>
                  <td style={{ padding: "10px 12px" }}><StarRating rating={t.rating} /></td>
                  <td style={{ padding: "10px 12px" }}>{t.russianUi ? "✅" : "—"}</td>
                  <td style={{ padding: "10px 12px" }}>{t.requiresVpn ? "⚠️ Нужен" : "✅ Нет"}</td>
                  <td style={{ padding: "10px 12px", fontWeight: 700, color: "var(--color-accent)" }}>{t.pricingAmount || t.pricing}</td>
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
