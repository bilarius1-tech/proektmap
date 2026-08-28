"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  Zap,
  Palette,
  Cpu,
  Smile,
  BookOpen,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Quote,
  ShieldCheck,
  Share2,
  Check,
  Send,
} from "lucide-react";

interface GlossaryTermItem {
  id: string;
  term: string;
  slug: string;
  definition: string;
  simpleExplanation: string;
  example: string;
  vibeUsage: string;
  devSay: string;
  level: string;
  category: string;
  relatedTerms: string;
  sortOrder: number;
}

const CATEGORIES = [
  { id: "all", label: "Все термины", icon: BookOpen, count: 0 },
  { id: "vibe-process", label: "⚡ Вайбкодинг & Процесс", icon: Zap, matchLevels: ["vibe", "vibe-process"] },
  { id: "vibe-design", label: "🎨 Дизайн & UI-слоп", icon: Palette, matchLevels: ["design", "vibe-design"] },
  { id: "vibe-arch", label: "🤖 Архитектура & Агенты", icon: Cpu, matchLevels: ["modern", "vibe-arch", "senior"] },
  { id: "vibe-slang", label: "🧠 Жаргон & Мемы", icon: Smile, matchLevels: ["jargon", "vibe-slang", "translate"] },
  { id: "dev-classic", label: "🛠 Инженерный стек", icon: ShieldCheck, matchLevels: ["stack", "git", "db", "deploy", "coding", "survival", "saas", "seo"] },
];

const LEVEL_BADGES: Record<string, { label: string; color: string; bg: string }> = {
  vibe: { label: "Вайбкодинг", color: "#0fb880", bg: "rgba(15, 184, 128, 0.1)" },
  "vibe-process": { label: "Процесс", color: "#0fb880", bg: "rgba(15, 184, 128, 0.1)" },
  "vibe-design": { label: "UI / Дизайн", color: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" },
  design: { label: "Дизайн", color: "#ec4899", bg: "rgba(236, 72, 153, 0.1)" },
  "vibe-arch": { label: "Архитектура", color: "#3b82f6", bg: "rgba(59, 130, 246, 0.1)" },
  modern: { label: "AI / Агенты", color: "#8b5cf6", bg: "rgba(139, 92, 246, 0.1)" },
  "vibe-slang": { label: "Жаргон", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
  jargon: { label: "Жаргон", color: "#f59e0b", bg: "rgba(245, 158, 11, 0.12)" },
  senior: { label: "Senior", color: "#6366f1", bg: "rgba(99, 102, 241, 0.1)" },
  git: { label: "Git", color: "#ea580c", bg: "rgba(234, 88, 12, 0.1)" },
  db: { label: "Базы данных", color: "#059669", bg: "rgba(5, 150, 105, 0.1)" },
  deploy: { label: "Деплой", color: "#0284c7", bg: "rgba(2, 132, 199, 0.1)" },
  survival: { label: "База", color: "#dc2626", bg: "rgba(220, 38, 38, 0.1)" },
};

export default function GlossaryClient({ terms }: { terms: GlossaryTermItem[] }) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyTermLink = async (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${typeof window !== "undefined" ? window.location.origin : "https://proektmap.ru"}/glossary/${slug}`;
    try {
      if (typeof window !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopiedSlug(slug);
        setTimeout(() => setCopiedSlug(null), 2000);
      }
    } catch {}
  };

  const filtered = useMemo(() => {
    return terms.filter((t) => {
      // Category filter
      if (activeTab !== "all") {
        const cat = CATEGORIES.find((c) => c.id === activeTab);
        if (cat?.matchLevels) {
          const matchesCategory =
            cat.matchLevels.includes(t.category) || cat.matchLevels.includes(t.level);
          if (!matchesCategory) return false;
        }
      }

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const inTerm = t.term.toLowerCase().includes(q);
        const inDef = t.definition.toLowerCase().includes(q);
        const inSimple = (t.simpleExplanation || "").toLowerCase().includes(q);
        const inUsage = (t.vibeUsage || "").toLowerCase().includes(q);
        if (!inTerm && !inDef && !inSimple && !inUsage) return false;
      }

      return true;
    });
  }, [terms, activeTab, search]);

  return (
    <div className="glossary-shell">
      {/* ═══ 1. EDITORIAL HEADER ═══ */}
      <header className="glossary-header">
        <div className="glossary-eyebrow">
          <span className="eyebrow-pill">PROEKTMAP 2026</span>
          <span className="eyebrow-sep">/</span>
          <span className="eyebrow-sub">VIBE CODING & AI DICTIONARY</span>
        </div>

        <h1 className="glossary-title">Глоссарий вайбкодинга и ИИ-разработки</h1>

        <p className="glossary-subtitle">
          Переводчик с «птичьего языка» вайбкодеров на человеческий инженерный.
          От «ИИ-слопа» и «Войны Z-индексов» до «RAG», «MCP» и «Роя агентов».
        </p>

        {/* Search Input */}
        <div className="glossary-search-wrap">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по термину, фразе или сленгу (например: слоп, дрейф, z-index, петля, rag)..."
            className="glossary-search-input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="search-clear-btn"
            >
              Сбросить
            </button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="category-tabs-row">
          {CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`category-tab ${isActive ? "active" : ""}`}
              >
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ═══ 2. QUICK STATS BAR ═══ */}
      <div className="glossary-stats-bar">
        <span>Показано: <strong>{filtered.length}</strong> из {terms.length} понятий</span>
        {search && <span className="search-query-badge">По запросу: «{search}»</span>}
      </div>

      {/* ═══ 3. TERMS EDITORIAL GRID ═══ */}
      <section className="glossary-grid">
        {filtered.map((item) => {
          const badge =
            LEVEL_BADGES[item.category] ||
            LEVEL_BADGES[item.level] || {
              label: item.level || "Термин",
              color: "#555",
              bg: "#f0f0f0",
            };

          return (
            <article key={item.id} className="glossary-card">
              <div className="card-top">
                <span
                  className="card-category-badge"
                  style={{ color: badge.color, background: badge.bg }}
                >
                  {badge.label}
                </span>

                <Link href={`/glossary/${item.slug}`} className="card-open-link">
                  <span>Паспорт термина</span>
                  <ArrowRight size={12} />
                </Link>
              </div>

              <Link href={`/glossary/${item.slug}`} className="term-link-title">
                <h3 className="card-term-title">{item.term}</h3>
              </Link>

              {item.simpleExplanation && (
                <div className="card-simple-box">
                  <span className="simple-icon">💡</span>
                  <p className="simple-text">{item.simpleExplanation}</p>
                </div>
              )}

              <p className="card-definition">{item.definition}</p>

              {item.vibeUsage && (
                <div className="card-quote-box">
                  <div className="quote-header">
                    <Quote size={12} className="quote-icon" />
                    <span>Как это звучит в чатах:</span>
                  </div>
                  <div className="quote-text">{item.vibeUsage}</div>
                </div>
              )}

              <div className="card-footer">
                <Link href={`/glossary/${item.slug}`} className="card-detail-btn">
                  <span>Читать пример и решение</span>
                  <ArrowRight size={13} />
                </Link>

                <div className="card-quick-share">
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(`https://proektmap.ru/glossary/${item.slug}`)}&text=${encodeURIComponent(`${item.term} — ${item.simpleExplanation || item.definition}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-share-icon-btn tg-icon"
                    title="Поделиться в Telegram"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Send size={13} />
                  </a>
                  <button
                    onClick={(e) => handleCopyTermLink(item.slug, e)}
                    className={`card-share-icon-btn copy-icon ${copiedSlug === item.slug ? "copied" : ""}`}
                    title="Скопировать ссылку на термин"
                  >
                    {copiedSlug === item.slug ? <Check size={13} /> : <Share2 size={13} />}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      {filtered.length === 0 && (
        <div className="empty-state">
          <HelpCircle size={36} className="empty-icon" />
          <h3>Термины не найдены</h3>
          <p>Попробуйте изменить запрос или переключить категорию.</p>
          <button
            onClick={() => {
              setSearch("");
              setActiveTab("all");
            }}
            className="btn-reset-filters"
          >
            Сбросить все фильтры
          </button>
        </div>
      )}

      {/* ═══ 4. FOOTER CROSS-LINK TO SKILLS ═══ */}
      <footer className="glossary-crosslink-footer">
        <div className="crosslink-card">
          <div className="crosslink-left">
            <Sparkles size={24} className="text-emerald" />
            <div>
              <h3 className="crosslink-title">Связка с Картой способностей ProektMap</h3>
              <p className="crosslink-text">
                Каждый термин глоссария интерактивно подсвечивается в паспортах навыков создателя на <code>/skills</code>.
                Осваивайте понятия прямо во время запуска проектов.
              </p>
            </div>
          </div>
          <Link href="/skills" className="btn-to-skills">
            <span>Открыть Карту способностей</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </footer>

      {/* ═══ INLINED STYLES ═══ */}
      <style jsx>{`
        .glossary-shell {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          font-family: var(--font-body, "Inter", sans-serif);
          color: var(--color-text-primary, #111);
        }

        /* ─── Header ─── */
        .glossary-header {
          margin-bottom: 32px;
        }
        .glossary-eyebrow {
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
        .glossary-title {
          font-family: var(--font-heading, "Onest", "Inter", sans-serif);
          font-size: clamp(28px, 4.5vw, 42px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 12px;
        }
        .glossary-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: var(--color-text-secondary, #555);
          max-width: 760px;
          margin-bottom: 24px;
        }

        /* ─── Search ─── */
        .glossary-search-wrap {
          position: relative;
          max-width: 760px;
          margin-bottom: 20px;
        }
        .search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-tertiary, #888);
        }
        .glossary-search-input {
          width: 100%;
          padding: 14px 100px 14px 44px;
          border-radius: 10px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-surface, #fff);
          font-size: 15px;
          font-family: inherit;
          color: inherit;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .glossary-search-input:focus {
          border-color: #0fb880;
          box-shadow: 0 0 0 3px rgba(15, 184, 128, 0.15);
        }
        .search-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: #f0f0f0;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #555;
          cursor: pointer;
        }

        /* ─── Category Tabs ─── */
        .category-tabs-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .category-tab {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 20px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-surface, #fff);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-secondary, #555);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .category-tab:hover {
          background: #f8fafc;
          border-color: #ccc;
          color: #111;
        }
        .category-tab.active {
          background: #111827;
          border-color: #111827;
          color: #ffffff;
        }

        /* ─── Stats Bar ─── */
        .glossary-stats-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
          color: var(--color-text-tertiary, #777);
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-border-light, #eaeaea);
        }
        .search-query-badge {
          background: rgba(15, 184, 128, 0.1);
          color: #0fb880;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
        }

        /* ─── Grid ─── */
        .glossary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 18px;
          margin-bottom: 48px;
        }
        .glossary-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 14px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .glossary-card:hover {
          border-color: #bbb;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
          transform: translateY(-2px);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .card-category-badge {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .card-open-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-tertiary, #888);
          text-decoration: none;
        }
        .card-open-link:hover {
          color: #0fb880;
        }

        .term-link-title {
          text-decoration: none;
          color: inherit;
        }
        .card-term-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 18px;
          font-weight: 800;
          line-height: 1.25;
          margin: 0 0 10px 0;
          color: var(--color-text-primary, #111);
          transition: color 0.15s ease;
        }
        .term-link-title:hover .card-term-title {
          color: #0fb880;
        }

        .card-simple-box {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: rgba(15, 184, 128, 0.06);
          border-radius: 8px;
          padding: 8px 10px;
          margin-bottom: 12px;
        }
        .simple-icon {
          font-size: 13px;
          line-height: 1.4;
        }
        .simple-text {
          font-size: 13px;
          font-weight: 600;
          color: #111;
          margin: 0;
          line-height: 1.4;
        }

        .card-definition {
          font-size: 13px;
          line-height: 1.55;
          color: var(--color-text-secondary, #555);
          margin-bottom: 14px;
        }

        .card-quote-box {
          background: #fffbeb;
          border: 1px solid #fef3c7;
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }
        .quote-header {
          display: flex;
          align-items: center;
          gap: 4px;
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          color: #b45309;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .quote-icon {
          color: #f59e0b;
        }
        .quote-text {
          font-size: 12px;
          line-height: 1.45;
          color: #78350f;
          font-style: italic;
        }

        .card-footer {
          margin-top: auto;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-light, #f0f0f0);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .card-detail-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
        }
        .card-detail-btn:hover {
          color: #1d4ed8;
          text-decoration: underline;
        }
        .card-quick-share {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .card-share-icon-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 26px;
          border-radius: 6px;
          border: 1px solid var(--color-border-light, #e5e7eb);
          background: var(--color-bg-secondary, #f9fafb);
          color: var(--color-text-tertiary, #6b7280);
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
        }
        .card-share-icon-btn:hover {
          transform: translateY(-1px);
        }
        .card-share-icon-btn.tg-icon:hover {
          background: #229ed9;
          border-color: #229ed9;
          color: #fff;
        }
        .card-share-icon-btn.copy-icon:hover {
          background: #f3f4f6;
          color: #111;
        }
        .card-share-icon-btn.copy-icon.copied {
          background: rgba(15, 184, 128, 0.15);
          border-color: #0fb880;
          color: #0fb880;
        }

        /* ─── Empty State ─── */
        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 16px;
          margin-bottom: 48px;
        }
        .empty-icon {
          color: #888;
          margin-bottom: 12px;
        }
        .btn-reset-filters {
          background: #111;
          color: #fff;
          border: none;
          padding: 10px 18px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          margin-top: 12px;
        }

        /* ─── Crosslink Footer ─── */
        .glossary-crosslink-footer {
          margin-top: 24px;
        }
        .crosslink-card {
          background: #111827;
          color: #fff;
          border-radius: 16px;
          padding: 28px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        .crosslink-left {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          max-width: 700px;
        }
        .crosslink-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 18px;
          font-weight: 800;
          color: #fff;
          margin: 0 0 6px 0;
        }
        .crosslink-text {
          font-size: 13px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.75);
          margin: 0;
        }
        .crosslink-text code {
          font-family: var(--font-mono, monospace);
          color: #38bdf8;
          background: rgba(255, 255, 255, 0.1);
          padding: 2px 5px;
          border-radius: 4px;
        }
        .btn-to-skills {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 20px;
          border-radius: 8px;
          background: #0fb880;
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none !important;
          white-space: nowrap;
          transition: background 0.15s ease;
        }
        .btn-to-skills:hover {
          background: #0ca36e;
        }

        .text-emerald { color: #0fb880; }
      `}</style>
    </div>
  );
}
