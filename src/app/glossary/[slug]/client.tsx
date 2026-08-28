"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Quote,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";

const LEVEL_LABELS: Record<string, { label: string; color: string; bg: string }> = {
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

export default function TermClient({ term, related }: { term: any; related: any[] }) {
  const badge =
    LEVEL_LABELS[term.category] ||
    LEVEL_LABELS[term.level] || {
      label: term.level || "Термин",
      color: "#555",
      bg: "#f0f0f0",
    };

  return (
    <div className="term-page-container">
      {/* Breadcrumb */}
      <nav className="term-breadcrumb">
        <Link href="/glossary" className="breadcrumb-back">
          <ArrowLeft size={14} />
          <span>Глоссарий вайбкодера</span>
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{term.term}</span>
      </nav>

      {/* Hero Header */}
      <header className="term-hero">
        <div className="term-hero-top">
          <span
            className="term-badge"
            style={{ color: badge.color, background: badge.bg }}
          >
            {badge.label}
          </span>
        </div>

        <h1 className="term-title">{term.term}</h1>

        {term.simpleExplanation && (
          <div className="term-simple-card">
            <span className="simple-icon">💡</span>
            <div className="simple-content">
              <span className="simple-label">Суть в одном предложении:</span>
              <p className="simple-text">{term.simpleExplanation}</p>
            </div>
          </div>
        )}
      </header>

      {/* Main Content Blocks */}
      <div className="term-body-grid">
        <div className="term-main-col">
          {/* 1. Definition */}
          <section className="term-card">
            <h2 className="term-card-heading">Развернутое определение</h2>
            <div className="term-definition-text">{term.definition}</div>
          </section>

          {/* 2. Example */}
          {term.example && (
            <section className="term-card">
              <h2 className="term-card-heading">Пример из практики</h2>
              <div className="term-example-text">{term.example}</div>
            </section>
          )}

          {/* 3. Vibe Usage / How devs say */}
          {term.vibeUsage && (
            <section className="term-card quote-card-vibe">
              <div className="quote-badge">
                <Quote size={13} className="text-amber" />
                <span>Как говорят в чатах вайбкодеров</span>
              </div>
              <div className="quote-body">{term.vibeUsage}</div>
            </section>
          )}

          {term.devSay && (
            <section className="term-card quote-card-dev">
              <div className="quote-badge">
                <ShieldCheck size={13} className="text-emerald" />
                <span>Как говорит классический инженер</span>
              </div>
              <div className="quote-body">«{term.devSay}»</div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="term-sidebar">
          {/* Related Terms */}
          {related && related.length > 0 && (
            <div className="sidebar-box">
              <h3 className="sidebar-heading">Связанные термины</h3>
              <div className="related-links-stack">
                {related.map((r: any) => (
                  <Link
                    key={r.slug}
                    href={`/glossary/${r.slug}`}
                    className="related-term-chip"
                  >
                    <span>{r.term}</span>
                    <ArrowRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Crosslink to Skills */}
          <div className="sidebar-box skills-promo-box">
            <div className="promo-top">
              <Zap size={16} className="text-emerald" />
              <span className="promo-tag">Карта способностей</span>
            </div>
            <h4 className="promo-title">Хотите освоить это на практике?</h4>
            <p className="promo-text">
              В ProektMap каждый термин привязан к готовым шагам в маршрутах решений.
            </p>
            <Link href="/skills" className="btn-sidebar-skills">
              <span>Открыть Skills</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Styles */}
      <style jsx>{`
        .term-page-container {
          max-width: 960px;
          margin: 0 auto;
          padding: 36px 20px 80px;
          font-family: var(--font-body, "Inter", sans-serif);
          color: var(--color-text-primary, #111);
        }

        .term-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 24px;
        }
        .breadcrumb-back {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--color-text-secondary, #555);
          text-decoration: none;
          font-weight: 600;
        }
        .breadcrumb-back:hover {
          color: #111;
        }
        .breadcrumb-sep {
          color: #aaa;
        }
        .breadcrumb-current {
          color: #777;
        }

        .term-hero {
          margin-bottom: 32px;
        }
        .term-hero-top {
          margin-bottom: 12px;
        }
        .term-badge {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .term-title {
          font-family: var(--font-heading, "Onest", "Inter", sans-serif);
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 800;
          letter-spacing: -0.02em;
          margin: 0 0 16px 0;
          color: #111;
          line-height: 1.2;
        }

        .term-simple-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(15, 184, 128, 0.08);
          border: 1px solid rgba(15, 184, 128, 0.25);
          border-radius: 12px;
          padding: 16px 20px;
        }
        .simple-icon {
          font-size: 20px;
          line-height: 1.2;
        }
        .simple-content {
          flex: 1;
        }
        .simple-label {
          display: block;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          color: #0fb880;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 4px;
        }
        .simple-text {
          font-size: 16px;
          font-weight: 700;
          line-height: 1.45;
          color: #111;
          margin: 0;
        }

        .term-body-grid {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 24px;
        }
        @media (max-width: 800px) {
          .term-body-grid {
            grid-template-columns: 1fr;
          }
        }

        .term-main-col {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .term-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 20px;
        }
        .term-card-heading {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-tertiary, #888);
          text-transform: uppercase;
          letter-spacing: 0.06em;
          margin: 0 0 10px 0;
        }
        .term-definition-text {
          font-size: 15px;
          line-height: 1.65;
          color: var(--color-text-secondary, #333);
        }
        .term-example-text {
          font-size: 14px;
          line-height: 1.6;
          color: #444;
          background: #f8fafc;
          padding: 12px;
          border-radius: 8px;
          border-left: 3px solid #3b82f6;
        }

        .quote-card-vibe {
          background: #fffbeb;
          border-color: #fef3c7;
        }
        .quote-card-dev {
          background: #f0fdf4;
          border-color: #dcfce7;
        }
        .quote-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .quote-body {
          font-size: 14px;
          line-height: 1.55;
          font-style: italic;
          color: #333;
        }

        .term-sidebar {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }
        .sidebar-box {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 18px;
        }
        .sidebar-heading {
          font-family: var(--font-heading, sans-serif);
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 12px 0;
        }
        .related-links-stack {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .related-term-chip {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          border-radius: 6px;
          background: var(--color-bg-secondary, #fafafa);
          font-size: 13px;
          font-weight: 600;
          color: #111;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .related-term-chip:hover {
          background: rgba(15, 184, 128, 0.1);
          color: #0fb880;
        }

        .skills-promo-box {
          background: #111827;
          color: #fff;
          border: none;
        }
        .promo-top {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 8px;
        }
        .promo-tag {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          font-weight: 700;
          color: #0fb880;
          text-transform: uppercase;
        }
        .promo-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 15px;
          font-weight: 800;
          margin: 0 0 6px 0;
          color: #fff;
        }
        .promo-text {
          font-size: 12px;
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 14px 0;
        }
        .btn-sidebar-skills {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 9px;
          border-radius: 6px;
          background: #0fb880;
          color: #fff !important;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none !important;
        }
        .btn-sidebar-skills:hover {
          background: #0ca36e;
        }

        .text-emerald { color: #0fb880; }
        .text-amber { color: #f59e0b; }
      `}</style>
    </div>
  );
}
