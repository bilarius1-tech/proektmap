"use client";

import { useState, useMemo } from "react";
import { Search, Filter, Star, ArrowUpDown, ExternalLink, X, Zap, Sparkles, Check, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AI_CATEGORIES, getAICategory } from "@/lib/constants/ai-categories";

interface Tool {
  id: string;
  name: string;
  slug: string;
  provider: string;
  type: string;
  category?: string;
  description: string;
  pros: string;
  cons: string;
  pricing: string;
  pricingAmount: string;
  url: string;
  russianUi: boolean;
  russianSupport: boolean;
  requiresVpn: boolean;
  requiresForeignCard: boolean;
  codeOwnership: boolean;
  rating: number;
  bestFor: string;
  sortOrder: number;
  howToStart: string;
  faqItems: string;
  detailDescription: string;
  hiddenFeatures: string;
  ourTake: string;
  detailComparison: string;
  downloadUrl: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: 1,
            background: i <= Math.round(rating / 2) ? "#0fb880" : "var(--color-border-light, #e5e7eb)",
          }}
        />
      ))}
      <span style={{ fontSize: 11, fontWeight: 700, color: "#0fb880", marginLeft: 4 }}>
        {rating}/10
      </span>
    </div>
  );
}

const typeLabels: Record<string, { icon: string; label: string }> = {
  ide: { icon: "💻", label: "IDE / Редактор" },
  "no-code": { icon: "🧩", label: "No-code" },
  agent: { icon: "🤖", label: "AI-Агент" },
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
  const first = lines.find((l) => l.trim().length > 10);
  return first ? first.trim() : text.substring(0, 120);
}

// Wizard for quick recommendation
function Wizard({ tools }: { tools: Tool[] }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<Tool[]>([]);

  const questions = [
    { key: "task", label: "🤔 Какая задача в приоритете?", options: ["код / сайт", "агенты & скиллы", "текст & ресёрч", "локальный запуск", "учёба & вайб"] },
    { key: "budget", label: "💰 Какой бюджет?", options: ["бесплатно", "до 2000₽/мес", "без ограничений"] },
    { key: "russia", label: "🇷🇺 Доступность в России?", options: ["строго без VPN", "желательно с картой РФ", "всё равно"] },
  ];

  function answer(key: string, value: string) {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
      return;
    }

    // Calculate recommendations
    let scored = tools.map((t) => {
      let score = 0;
      const a = newAnswers;

      if (a.task === "код / сайт" && (t.type === "ide" || t.type === "no-code" || t.category === "coding-dev")) score += 3;
      if (a.task === "агенты & скиллы" && (t.type === "agent" || t.category === "agents-skills")) score += 4;
      if (a.task === "локальный запуск" && (t.category === "local-models" || t.name.toLowerCase().includes("desktop"))) score += 4;
      if (a.task === "текст & ресёрч" && (t.category === "search-research" || t.category === "llm-assistants")) score += 3;
      if (a.task === "учёба & вайб" && (t.name.includes("Vibecraft") || t.name.includes("Bolt") || t.name.includes("Replit"))) score += 3;

      if (a.budget === "бесплатно" && (t.pricingAmount || t.pricing || "").toLowerCase().includes("бесплатн")) score += 3;
      if (a.budget === "до 2000₽/мес" && !(t.pricingAmount || "").toLowerCase().includes("00$")) score += 2;

      if (a.russia === "строго без VPN") {
        if (!t.requiresVpn) score += 4;
        else score -= 6;
      }
      if (a.russia === "желательно с картой РФ" && !t.requiresForeignCard) score += 2;

      score += t.rating / 2;
      return { tool: t, score };
    });

    scored.sort((a, b) => b.score - a.score);
    setResult(scored.slice(0, 3).map((s) => s.tool));
    setStep(step + 1);
  }

  function reset() {
    setStep(0);
    setAnswers({});
    setResult([]);
  }

  if (step === questions.length) {
    return (
      <div className="wizard-box result-state">
        <div className="wizard-header">
          <div className="wizard-title-group">
            <span className="wizard-badge">🎯 Персональная рекомендация</span>
            <h3 className="wizard-heading">Оптимальные инструменты под ваши критерии</h3>
          </div>
          <button onClick={reset} className="wizard-reset-btn">
            Пройти заново
          </button>
        </div>
        <div className="wizard-results-grid">
          {result.map((t) => {
            const cat = getAICategory(t.category);
            return (
              <Link key={t.id} href={"/ai-tools/" + t.slug} className="wizard-card">
                <div className="wizard-card-top">
                  <span className="wizard-cat-tag" style={{ background: cat.bg, color: cat.color }}>
                    {cat.emoji} {cat.shortLabel}
                  </span>
                  <span className="wizard-price-tag">{t.pricingAmount || t.pricing}</span>
                </div>
                <div className="wizard-card-name">{t.name}</div>
                <div className="wizard-card-provider">{t.provider}</div>
                <p className="wizard-card-desc">{getFirstLine(t.description)}</p>
                <div className="wizard-card-foot">
                  <StarRating rating={t.rating} />
                  <span className="wizard-open-link">Открыть паспорт →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  const q = questions[step];
  return (
    <div className="wizard-box">
      <div className="wizard-header">
        <div className="wizard-title-group">
          <span className="wizard-badge">🔍 Интерактивный подборщик</span>
          <h3 className="wizard-heading">{q.label}</h3>
        </div>
        <span className="wizard-step-count">Шаг {step + 1} из {questions.length}</span>
      </div>
      <div className="wizard-options-row">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(q.key, opt)}
            className={`wizard-opt-btn ${answers[q.key] === opt ? "active" : ""}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AIToolsPage({ tools }: { tools: Tool[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [quickFilter, setQuickFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [compareIds, setCompareIds] = useState<Set<string>>(new Set());

  const activeCategoryObj = useMemo(() => {
    return selectedCategory === "all" ? null : getAICategory(selectedCategory);
  }, [selectedCategory]);

  const filtered = useMemo(() => {
    let result = tools;

    // 1. 14 Directions filter
    if (selectedCategory !== "all") {
      result = result.filter((t) => (t.category || "coding-dev") === selectedCategory);
    }

    // 2. Quick filters
    if (quickFilter === "novpn") {
      result = result.filter((t) => !t.requiresVpn);
    } else if (quickFilter === "free") {
      result = result.filter(
        (t) =>
          (t.pricingAmount || t.pricing || "").toLowerCase().includes("бесплатн") ||
          (t.pricingAmount || t.pricing || "").toLowerCase().includes("free") ||
          (t.pricingAmount || t.pricing || "").toLowerCase().includes("0$")
      );
    } else if (quickFilter === "russian") {
      result = result.filter((t) => t.russianUi);
    } else if (quickFilter === "top") {
      result = result.filter((t) => t.rating >= 9);
    }

    // 3. Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.provider.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.bestFor.toLowerCase().includes(q)
      );
    }

    // Sort: Russian first, then by rating desc
    result = [...result].sort((a, b) => {
      if (a.russianUi && !b.russianUi) return -1;
      if (!a.russianUi && b.russianUi) return 1;
      return b.rating - a.rating;
    });

    return result;
  }, [tools, selectedCategory, quickFilter, search]);

  function toggleCompare(id: string) {
    const next = new Set(compareIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    setCompareIds(next);
  }

  const compareTools = tools.filter((t) => compareIds.has(t.id));

  return (
    <div className="ai-tools-container">
      {/* ═══ 1. HERO SECTION ═══ */}
      <header className="tools-hero">
        <div className="hero-eyebrow">
          <span className="eyebrow-pill">Каталог решений & стека</span>
          <span>14 ключевых направлений AI-экосистемы</span>
        </div>
        <h1 className="hero-title">AI-инструменты для создателей</h1>
        <p className="hero-desc">
          Справочник и навигатор по 14 инженерным и продуктовым направлениям: от LLM и AI-агентов до локальных моделей, вайбкодинга и медиагенерации. Проверено в боевых проектах.
        </p>
      </header>

      {/* ═══ 2. WIZARD RECOMMENDER ═══ */}
      <Wizard tools={tools} />

      {/* ═══ 3. 14 DIRECTIONS ATLAS NAVIGATOR ═══ */}
      <section className="directions-section">
        <div className="directions-header">
          <div className="directions-title-group">
            <span className="directions-label">Направления</span>
            <span className="directions-hint">Выберите раздел для фильтрации:</span>
          </div>
          {selectedCategory !== "all" && (
            <button onClick={() => setSelectedCategory("all")} className="btn-reset-cat">
              Показать все направления ({tools.length})
            </button>
          )}
        </div>

        <div className="directions-grid">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`direction-chip ${selectedCategory === "all" ? "active-all" : ""}`}
          >
            <span className="dir-icon">🌍</span>
            <div className="dir-info">
              <span className="dir-name">Все инструменты</span>
              <span className="dir-count">{tools.length} софта</span>
            </div>
          </button>

          {AI_CATEGORIES.map((cat) => {
            const count = tools.filter((t) => (t.category || "coding-dev") === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`direction-chip ${isSelected ? "active" : ""}`}
                style={
                  isSelected
                    ? { borderColor: cat.color, background: cat.bg }
                    : undefined
                }
              >
                <span className="dir-icon">{cat.emoji}</span>
                <div className="dir-info">
                  <span className="dir-name">{cat.shortLabel}</span>
                  <span className="dir-count">{count} проверено</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected category overview banner */}
        {activeCategoryObj && (
          <div
            className="category-banner"
            style={{
              background: activeCategoryObj.bg,
              borderColor: activeCategoryObj.border,
            }}
          >
            <div className="cat-banner-icon">{activeCategoryObj.emoji}</div>
            <div className="cat-banner-content">
              <h3 className="cat-banner-title" style={{ color: activeCategoryObj.color }}>
                {activeCategoryObj.label}
              </h3>
              <p className="cat-banner-desc">{activeCategoryObj.description}</p>
            </div>
            <button onClick={() => setSelectedCategory("all")} className="cat-banner-close">
              <X size={16} />
            </button>
          </div>
        )}
      </section>

      {/* ═══ 4. SEARCH & SUB-FILTERS BAR ═══ */}
      <div className="filter-controls-bar">
        {/* Quick filters */}
        <div className="sub-filters-group">
          <button
            onClick={() => setQuickFilter("all")}
            className={`sub-filter-btn ${quickFilter === "all" ? "active" : ""}`}
          >
            Все ({filtered.length})
          </button>
          <button
            onClick={() => setQuickFilter("novpn")}
            className={`sub-filter-btn ${quickFilter === "novpn" ? "active" : ""}`}
          >
            🌐 Без VPN
          </button>
          <button
            onClick={() => setQuickFilter("russian")}
            className={`sub-filter-btn ${quickFilter === "russian" ? "active" : ""}`}
          >
            🇷🇺 Русский UI
          </button>
          <button
            onClick={() => setQuickFilter("free")}
            className={`sub-filter-btn ${quickFilter === "free" ? "active" : ""}`}
          >
            🆓 Бесплатные
          </button>
          <button
            onClick={() => setQuickFilter("top")}
            className={`sub-filter-btn ${quickFilter === "top" ? "active" : ""}`}
          >
            ⭐ Топ 9+
          </button>
        </div>

        {/* Search input */}
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Поиск по названию или задаче..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          {search && (
            <button onClick={() => setSearch("")} className="search-clear-btn">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* ═══ 5. COMPARISON BAR ═══ */}
      {compareIds.size > 0 && (
        <div className="compare-bar">
          <div className="compare-bar-left">
            <ArrowUpDown size={15} />
            <span>
              В сравнении: <strong>{compareTools.map((t) => t.name).join(" vs ")}</strong> ({compareIds.size}/3)
            </span>
          </div>
          <button onClick={() => setCompareIds(new Set())} className="btn-clear-compare">
            Сбросить
          </button>
        </div>
      )}

      {/* ═══ 6. COMPARISON TABLE ═══ */}
      {compareTools.length >= 2 && (
        <div className="compare-table-card">
          <h3 className="compare-table-heading">📊 Детальное сравнение выбранных инструментов</h3>
          <div className="table-overflow">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Критерий</th>
                  {compareTools.map((t) => (
                    <th key={t.id}>{t.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Направление", (t: Tool) => `${getAICategory(t.category).emoji} ${getAICategory(t.category).shortLabel}`],
                  ["Тип", (t: Tool) => `${(typeLabels[t.type] || {}).icon || "🛠"} ${(typeLabels[t.type] || {}).label || t.type}`],
                  ["Рейтинг", (t: Tool) => `${t.rating}/10`],
                  ["Цена", (t: Tool) => t.pricingAmount || t.pricing],
                  ["Доступность VPN", (t: Tool) => (t.requiresVpn ? "🔐 Нужен VPN" : "🌐 Работает без VPN")],
                  ["Русский язык", (t: Tool) => (t.russianUi ? "✅ Да" : "❌ Нет")],
                  ["Код в собственности", (t: Tool) => (t.codeOwnership ? "✅ Да" : "❌ Нет")],
                  ["Для кого подходит", (t: Tool) => t.bestFor],
                ].map(([label, fn]) => (
                  <tr key={label as string}>
                    <td className="crit-label">{label as string}</td>
                    {compareTools.map((t) => (
                      <td key={t.id}>{(fn as any)(t)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ 7. TOOLS CARDS GRID ═══ */}
      <section className="tools-cards-grid">
        {filtered.map((t: Tool) => {
          const isCompared = compareIds.has(t.id);
          const editorChoice = t.rating >= 9;
          const newBadge = isNew(t.createdAt);
          const quickDesc = getFirstLine(t.description);
          const cat = getAICategory(t.category);

          return (
            <article key={t.id} className={`tool-card ${isCompared ? "compared" : ""}`}>
              {/* Category & Badge Top Header */}
              <div className="card-top-header">
                <span className="card-cat-badge" style={{ color: cat.color, background: cat.bg, borderColor: cat.border }}>
                  {cat.emoji} {cat.shortLabel}
                </span>

                <div className="card-rating-wrap">
                  <StarRating rating={t.rating} />
                </div>
              </div>

              {/* Title & Provider */}
              <Link href={"/ai-tools/" + t.slug} className="card-title-link">
                <h3 className="card-title">
                  {t.name}
                  {editorChoice && <span className="star-badge" title="Выбор редакции">⭐</span>}
                  {newBadge && <span className="new-badge">NEW</span>}
                </h3>
              </Link>
              <span className="card-provider">{t.provider}</span>

              {/* Badges row */}
              <div className="card-badges-row">
                <span className="card-price-pill">{t.pricingAmount || t.pricing}</span>
                {t.russianUi ? (
                  <span className="pill-ru">🇷🇺 RU</span>
                ) : (
                  <span className="pill-global">🌍 Global</span>
                )}
                {!t.requiresVpn ? (
                  <span className="pill-novpn">🌐 Без VPN</span>
                ) : (
                  <span className="pill-vpn">🔐 VPN</span>
                )}
              </div>

              {/* Description */}
              {quickDesc && (
                <p className="card-summary">
                  💡 {quickDesc}{quickDesc.length > 95 ? "..." : ""}
                </p>
              )}

              {/* Best for */}
              {t.bestFor && (
                <div className="card-bestfor">
                  🎯 <span>{t.bestFor.substring(0, 75)}</span>
                </div>
              )}

              {/* Card Footer Actions */}
              <div className="card-footer">
                <Link href={"/ai-tools/" + t.slug} className="btn-tool-passport">
                  <span>Паспорт инструмента</span>
                  <ArrowRight size={13} />
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleCompare(t.id);
                  }}
                  className={`btn-compare-toggle ${isCompared ? "active" : ""}`}
                  title="Сравнить с другим софтом"
                >
                  <ArrowUpDown size={12} />
                  <span>{isCompared ? "В сравнении" : "Сравнить"}</span>
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="empty-tools-state">
          <h3>Инструменты не найдены</h3>
          <p>Попробуйте сбросить фильтры или выбрать другое направление.</p>
          <button
            onClick={() => {
              setSelectedCategory("all");
              setQuickFilter("all");
              setSearch("");
            }}
            className="btn-reset-all"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

      {/* ═══ 8. SUMMARY TABLE ═══ */}
      <section className="summary-section">
        <h2 className="summary-heading">📊 Сводная таблица инструментов ({filtered.length})</h2>
        <div className="table-overflow">
          <table className="summary-table">
            <thead>
              <tr>
                <th>Инструмент</th>
                <th>Направление</th>
                <th>Тип</th>
                <th>Рейтинг</th>
                <th>VPN</th>
                <th>Язык</th>
                <th>Цена</th>
                <th>Лучше всего для</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t: Tool) => {
                const cat = getAICategory(t.category);
                return (
                  <tr key={t.id}>
                    <td className="cell-tool-name">
                      <Link href={"/ai-tools/" + t.slug} className="table-tool-link">
                        {t.name}
                        {t.rating >= 9 && <span style={{ marginLeft: 4 }}>⭐</span>}
                      </Link>
                      <div className="table-provider">{t.provider}</div>
                    </td>
                    <td>
                      <span className="table-cat-chip" style={{ color: cat.color, background: cat.bg }}>
                        {cat.emoji} {cat.shortLabel}
                      </span>
                    </td>
                    <td>{(typeLabels[t.type] || {}).icon || "🛠"} {(typeLabels[t.type] || {}).label || t.type}</td>
                    <td><StarRating rating={t.rating} /></td>
                    <td>{t.requiresVpn ? "⚠️ Нужен VPN" : "✅ Без VPN"}</td>
                    <td>{t.russianUi ? "🇷🇺 Русский" : "🌍 English"}</td>
                    <td className="cell-price">{t.pricingAmount || t.pricing}</td>
                    <td className="cell-bestfor">{t.bestFor}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ═══ INLINED STYLES ═══ */}
      <style jsx>{`
        .ai-tools-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 36px 20px 80px;
          font-family: var(--font-body, "Inter", sans-serif);
          color: var(--color-text-primary, #111);
        }

        /* ─── Hero ─── */
        .tools-hero {
          margin-bottom: 32px;
        }
        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-tertiary, #888);
          margin-bottom: 12px;
        }
        .eyebrow-pill {
          color: #0fb880;
          background: rgba(15, 184, 128, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .hero-title {
          font-family: var(--font-heading, "Onest", "Inter", sans-serif);
          font-size: clamp(28px, 4.5vw, 40px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 12px 0;
          line-height: 1.15;
        }
        .hero-desc {
          font-size: 15px;
          line-height: 1.6;
          color: var(--color-text-secondary, #555);
          max-width: 780px;
          margin: 0;
        }

        /* ─── Wizard ─── */
        .wizard-box {
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 14px;
          padding: 22px 24px;
          margin-bottom: 32px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        }
        .wizard-box.result-state {
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
          border-color: rgba(15, 184, 128, 0.3);
        }
        .wizard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }
        .wizard-badge {
          display: block;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          color: #0fb880;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-bottom: 4px;
        }
        .wizard-heading {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          color: #111;
        }
        .wizard-step-count {
          font-size: 12px;
          font-family: var(--font-mono, monospace);
          color: var(--color-text-tertiary, #888);
        }
        .wizard-reset-btn {
          padding: 6px 12px;
          border-radius: 6px;
          border: 1px solid var(--color-border-light, #e5e7eb);
          background: #fff;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          color: #444;
        }
        .wizard-options-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .wizard-opt-btn {
          padding: 9px 16px;
          border-radius: 8px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-bg-secondary, #fafafa);
          color: #222;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .wizard-opt-btn:hover {
          border-color: #0fb880;
          background: rgba(15, 184, 128, 0.05);
        }
        .wizard-opt-btn.active {
          background: #0fb880;
          color: #fff;
          border-color: #0fb880;
        }

        .wizard-results-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 14px;
        }
        .wizard-card {
          background: #fff;
          border: 1px solid rgba(15, 184, 128, 0.25);
          border-radius: 10px;
          padding: 16px;
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .wizard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(15, 184, 128, 0.1);
        }
        .wizard-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .wizard-cat-tag {
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .wizard-price-tag {
          font-size: 11px;
          font-weight: 700;
          color: #0fb880;
        }
        .wizard-card-name {
          font-size: 15px;
          font-weight: 800;
          color: #111;
        }
        .wizard-card-provider {
          font-size: 11px;
          color: #888;
          margin-bottom: 6px;
        }
        .wizard-card-desc {
          font-size: 12px;
          color: #555;
          line-height: 1.4;
          margin: 0 0 12px 0;
          flex: 1;
        }
        .wizard-card-foot {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 8px;
          border-top: 1px solid #f0f0f0;
        }
        .wizard-open-link {
          font-size: 11px;
          font-weight: 700;
          color: #0fb880;
        }

        /* ─── Directions Section ─── */
        .directions-section {
          margin-bottom: 28px;
        }
        .directions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }
        .directions-title-group {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .directions-label {
          font-family: var(--font-heading, sans-serif);
          font-size: 16px;
          font-weight: 800;
        }
        .directions-hint {
          font-size: 13px;
          color: var(--color-text-secondary, #666);
        }
        .btn-reset-cat {
          background: none;
          border: none;
          color: #0fb880;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }
        .directions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
          gap: 8px;
          margin-bottom: 14px;
        }
        .direction-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-surface, #fff);
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
          font-family: inherit;
        }
        .direction-chip:hover {
          border-color: #0fb880;
          transform: translateY(-1px);
        }
        .direction-chip.active-all {
          border-color: #111;
          background: #111;
          color: #fff;
        }
        .direction-chip.active-all .dir-count {
          color: rgba(255, 255, 255, 0.7);
        }
        .direction-chip.active {
          border-width: 1px;
          font-weight: 700;
        }
        .dir-icon {
          font-size: 18px;
          line-height: 1;
        }
        .dir-info {
          display: flex;
          flex-direction: column;
          gap: 1px;
          overflow: hidden;
        }
        .dir-name {
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dir-count {
          font-size: 10px;
          color: var(--color-text-tertiary, #888);
        }

        .category-banner {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 10px;
          border: 1px solid;
          margin-top: 10px;
          position: relative;
        }
        .cat-banner-icon {
          font-size: 24px;
          line-height: 1;
        }
        .cat-banner-content {
          flex: 1;
        }
        .cat-banner-title {
          font-size: 14px;
          font-weight: 800;
          margin: 0 0 4px 0;
        }
        .cat-banner-desc {
          font-size: 12px;
          line-height: 1.45;
          color: #333;
          margin: 0;
        }
        .cat-banner-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
          padding: 2px;
        }

        /* ─── Controls Bar ─── */
        .filter-controls-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 24px;
        }
        .sub-filters-group {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .sub-filter-btn {
          padding: 7px 12px;
          border-radius: 8px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-surface, #fff);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary, #555);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .sub-filter-btn:hover {
          border-color: #0fb880;
        }
        .sub-filter-btn.active {
          background: rgba(15, 184, 128, 0.1);
          border-color: #0fb880;
          color: #0fb880;
        }

        .search-input-wrap {
          position: relative;
          min-width: 260px;
        }
        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }
        .search-input {
          width: 100%;
          padding: 9px 32px 9px 34px;
          border-radius: 8px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-surface, #fff);
          font-size: 13px;
          font-family: inherit;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.15s ease;
        }
        .search-input:focus {
          border-color: #0fb880;
        }
        .search-clear-btn {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #888;
        }

        /* ─── Compare Bar & Table ─── */
        .compare-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          border-radius: 8px;
          background: rgba(15, 184, 128, 0.1);
          border: 1px solid rgba(15, 184, 128, 0.3);
          margin-bottom: 20px;
          font-size: 12px;
          color: #0fb880;
        }
        .compare-bar-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .btn-clear-compare {
          background: none;
          border: 1px solid #0fb880;
          color: #0fb880;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
        }

        .compare-table-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 28px;
        }
        .compare-table-heading {
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 14px 0;
        }
        .table-overflow {
          overflow-x: auto;
        }
        .compare-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
        }
        .compare-table th {
          text-align: left;
          padding: 8px 12px;
          border-bottom: 2px solid var(--color-border-light, #eaeaea);
          font-weight: 700;
        }
        .compare-table td {
          padding: 8px 12px;
          border-bottom: 1px solid var(--color-border-light, #eaeaea);
        }
        .crit-label {
          font-weight: 700;
          color: var(--color-text-secondary, #666);
          white-space: nowrap;
        }

        /* ─── Cards Grid ─── */
        .tools-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 16px;
          margin-bottom: 40px;
        }
        .tool-card {
          background: var(--color-surface, #ffffff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
          transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
        }
        .tool-card:hover {
          border-color: #0fb880;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }
        .tool-card.compared {
          border-color: #0fb880;
          background: #fcfdfc;
        }

        .card-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .card-cat-badge {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid;
        }
        .card-title-link {
          text-decoration: none;
          color: inherit;
        }
        .card-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 17px;
          font-weight: 800;
          margin: 0 0 2px 0;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #111;
        }
        .card-title-link:hover .card-title {
          color: #0fb880;
        }
        .star-badge {
          font-size: 12px;
        }
        .new-badge {
          font-family: var(--font-mono, monospace);
          font-size: 9px;
          font-weight: 800;
          background: #ef4444;
          color: #fff;
          padding: 1px 5px;
          border-radius: 4px;
        }
        .card-provider {
          font-size: 11px;
          color: var(--color-text-tertiary, #888);
          margin-bottom: 12px;
          display: block;
        }

        .card-badges-row {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .card-price-pill {
          font-size: 11px;
          font-weight: 700;
          color: #0fb880;
          background: rgba(15, 184, 128, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .pill-ru {
          font-size: 11px;
          font-weight: 600;
          color: #065f46;
          background: #ecfdf5;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .pill-global {
          font-size: 11px;
          font-weight: 600;
          color: #1e40af;
          background: #eff6ff;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .pill-novpn {
          font-size: 11px;
          font-weight: 600;
          color: #065f46;
          background: #ecfdf5;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .pill-vpn {
          font-size: 11px;
          font-weight: 600;
          color: #991b1b;
          background: #fef2f2;
          padding: 2px 6px;
          border-radius: 4px;
        }

        .card-summary {
          font-size: 13px;
          line-height: 1.5;
          color: var(--color-text-secondary, #444);
          margin: 0 0 10px 0;
          flex: 1;
        }
        .card-bestfor {
          font-size: 11px;
          font-weight: 600;
          color: #4b5563;
          margin-bottom: 14px;
        }

        .card-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-light, #f0f0f0);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .btn-tool-passport {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }
        .btn-tool-passport:hover {
          text-decoration: underline;
        }
        .btn-compare-toggle {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 6px;
          border: 1px solid var(--color-border-light, #e5e7eb);
          background: var(--color-bg-secondary, #fafafa);
          font-size: 11px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
          font-family: inherit;
        }
        .btn-compare-toggle:hover {
          background: #f3f4f6;
          color: #111;
        }
        .btn-compare-toggle.active {
          background: #0fb880;
          color: #fff;
          border-color: #0fb880;
        }

        .empty-tools-state {
          text-align: center;
          padding: 48px 20px;
          color: var(--color-text-tertiary, #888);
        }
        .btn-reset-all {
          margin-top: 12px;
          padding: 8px 16px;
          border-radius: 8px;
          background: #0fb880;
          color: #fff;
          border: none;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
        }

        /* ─── Summary Table ─── */
        .summary-section {
          margin-top: 48px;
          padding-top: 28px;
          border-top: 1px solid var(--color-border-light, #eaeaea);
        }
        .summary-heading {
          font-family: var(--font-heading, sans-serif);
          font-size: 18px;
          font-weight: 800;
          margin: 0 0 16px 0;
        }
        .summary-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 12px;
          background: var(--color-surface, #fff);
          border-radius: 8px;
          overflow: hidden;
        }
        .summary-table th {
          text-align: left;
          padding: 10px 12px;
          border-bottom: 2px solid var(--color-border-light, #eaeaea);
          font-weight: 700;
          color: var(--color-text-tertiary, #888);
          white-space: nowrap;
        }
        .summary-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--color-border-light, #eaeaea);
        }
        .cell-tool-name {
          font-weight: 700;
        }
        .table-tool-link {
          color: #111;
          text-decoration: none;
          font-weight: 700;
        }
        .table-tool-link:hover {
          color: #0fb880;
          text-decoration: underline;
        }
        .table-provider {
          font-size: 10px;
          color: var(--color-text-tertiary, #888);
        }
        .table-cat-chip {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          white-space: nowrap;
        }
        .cell-price {
          font-weight: 700;
          color: #0fb880;
        }
        .cell-bestfor {
          color: var(--color-text-secondary, #555);
          font-size: 11px;
        }
      `}</style>
    </div>
  );
}
