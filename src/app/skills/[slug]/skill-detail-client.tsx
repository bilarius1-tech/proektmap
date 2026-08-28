"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Zap,
  Terminal,
  ShieldCheck,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Wrench,
  Code2,
  Compass,
  Cpu,
  Database,
  Layout,
  Rocket,
} from "lucide-react";
import {
  CapabilitySkill,
  CAPABILITY_DOMAINS,
  CapabilityDomainId,
} from "../skills-data";
import GlossaryTermBadge from "@/components/skills/glossary-term-badge";

const DOMAIN_ICONS: Record<CapabilityDomainId, any> = {
  product: Compass,
  ai: Cpu,
  arch: Database,
  ui: Layout,
  ship: Rocket,
};

export default function SkillDetailClient({ skill }: { skill: CapabilitySkill }) {
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);
  const [copiedCommandIndex, setCopiedCommandIndex] = useState<number | null>(null);

  const domain = CAPABILITY_DOMAINS[skill.domainId];
  const DomainIcon = DOMAIN_ICONS[skill.domainId];

  const handleCopyPrompt = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 2000);
  };

  const handleCopyCommand = (cmd: string, index: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCommandIndex(index);
    setTimeout(() => setCopiedCommandIndex(null), 2000);
  };

  return (
    <div className="skill-detail-container">
      {/* ─── Breadcrumbs ─── */}
      <nav className="detail-breadcrumbs">
        <Link href="/skills" className="bc-link">
          <ArrowLeft size={14} />
          <span>Карта способностей</span>
        </Link>
        <span className="bc-sep">/</span>
        <span className="bc-domain" style={{ color: domain.color }}>
          {domain.name}
        </span>
        <span className="bc-sep">/</span>
        <span className="bc-current">{skill.title}</span>
      </nav>

      {/* ─── HERO HEADER ─── */}
      <header className="detail-hero">
        <div className="detail-hero-top">
          <div className="domain-pill" style={{ color: domain.color, background: `${domain.color}15` }}>
            <DomainIcon size={14} />
            <span>{domain.name}</span>
          </div>

          <div className="level-pill">
            <span className="level-code">{skill.level}</span>
            <span className="level-name">{skill.levelName}</span>
          </div>

          {skill.status === "mastered" && (
            <span className="status-badge mastered">
              <CheckCircle2 size={13} /> Подтверждено артефактом
            </span>
          )}
          {skill.status === "in_focus" && (
            <span className="status-badge in-focus">
              <Zap size={13} /> В фокусе текущего проекта
            </span>
          )}
          {skill.status === "recommended" && (
            <span className="status-badge recommended">
              Рекомендовано к освоению
            </span>
          )}
        </div>

        <h1 className="detail-title">{skill.title}</h1>

        <div className="detail-power-card">
          <div className="power-header">
            <Sparkles size={16} className="text-emerald" />
            <span>В чём суперсила создателя</span>
          </div>
          <p className="power-text">{skill.power}</p>
        </div>

        <p className="detail-full-desc">{skill.fullDescription}</p>
      </header>

      {/* ─── MAIN 2-COLUMN GRID ─── */}
      <div className="detail-grid">
        {/* Left Column: Levels + Glossary Terms */}
        <div className="detail-main-col">
          {/* 1. GLOSSARY TERMS ROW */}
          {skill.glossaryTerms && skill.glossaryTerms.length > 0 && (
            <section className="detail-section glossary-section">
              <div className="section-header">
                <div className="section-title-wrap">
                  <BookOpen size={16} className="text-blue" />
                  <h2 className="section-title">Термины и понятия (Глоссарий)</h2>
                </div>
                <span className="section-hint">Нажмите на термин для объяснения</span>
              </div>

              <div className="glossary-badges-row">
                {skill.glossaryTerms.map((item, idx) => (
                  <GlossaryTermBadge key={idx} item={item} />
                ))}
              </div>
            </section>
          )}

          {/* 2. THREE MASTERY LEVELS */}
          <section className="detail-section">
            <div className="section-header">
              <div className="section-title-wrap">
                <Layers size={16} className="text-emerald" />
                <h2 className="section-title">Ступени мастерства (L1 → L2 → L3)</h2>
              </div>
              <span className="section-hint">Наблюдаемые возможности создателя</span>
            </div>

            <div className="levels-stack">
              {skill.levels.map((lvl) => (
                <div
                  key={lvl.level}
                  className={`level-card ${skill.level === lvl.level ? "current-level" : ""}`}
                >
                  <div className="level-card-header">
                    <div className="level-card-title-row">
                      <span className="level-badge">{lvl.level}</span>
                      <h3 className="level-card-name">{lvl.name}</h3>
                    </div>
                    <span className="level-summary">{lvl.summary}</span>
                  </div>

                  <ul className="level-criteria-list">
                    {lvl.criteria.map((crit, cIdx) => (
                      <li key={cIdx} className="criterion-item">
                        <Check size={14} className="criterion-icon" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 3. PROMPTS & COMMANDS (IF ANY) */}
          {((skill.prompts && skill.prompts.length > 0) || (skill.commands && skill.commands.length > 0)) && (
            <section className="detail-section">
              <div className="section-header">
                <div className="section-title-wrap">
                  <Code2 size={16} className="text-amber" />
                  <h2 className="section-title">Готовые промпты и команды для Cursor</h2>
                </div>
              </div>

              {skill.prompts && skill.prompts.map((p, pIdx) => (
                <div key={pIdx} className="prompt-block">
                  <div className="prompt-top">
                    <div>
                      <div className="prompt-title">{p.title}</div>
                      <div className="prompt-desc">{p.description}</div>
                    </div>
                    <button
                      onClick={() => handleCopyPrompt(p.prompt, pIdx)}
                      className="btn-copy"
                      title="Скопировать промпт"
                    >
                      {copiedPromptIndex === pIdx ? (
                        <>
                          <Check size={13} className="text-emerald" />
                          <span>Скопировано</span>
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          <span>Копировать</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="prompt-content"><code>{p.prompt}</code></pre>
                </div>
              ))}

              {skill.commands && skill.commands.length > 0 && (
                <div className="commands-block">
                  <div className="commands-title">
                    <Terminal size={14} />
                    <span>Быстрые команды в терминале:</span>
                  </div>
                  <div className="commands-list">
                    {skill.commands.map((cmd, cIdx) => (
                      <div key={cIdx} className="command-row">
                        <code>{cmd}</code>
                        <button
                          onClick={() => handleCopyCommand(cmd, cIdx)}
                          className="btn-cmd-copy"
                          title="Скопировать команду"
                        >
                          {copiedCommandIndex === cIdx ? <Check size={12} className="text-emerald" /> : <Copy size={12} />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Right Sidebar: Tools + Proof of Work / Where to master */}
        <aside className="detail-sidebar-col">
          {/* 1. PROOF OF WORK / WHERE TO MASTER */}
          {skill.proofOfWork ? (
            <div className="sidebar-widget proof-widget">
              <div className="widget-header">
                <ShieldCheck size={16} className="text-emerald" />
                <span>Доказательство на практике</span>
              </div>
              <div className="widget-project-title">
                {skill.proofOfWork.projectName}
              </div>
              <p className="widget-artifact">{skill.proofOfWork.artifact}</p>
              <div className="widget-date">Подтверждено: {skill.proofOfWork.verifiedAt}</div>

              <Link href={skill.proofOfWork.projectUrl} className="btn-widget-action">
                <span>Открыть проект в решениях</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : skill.neededFor ? (
            <div className="sidebar-widget needed-widget">
              <div className="widget-header">
                <Zap size={16} className="text-amber" />
                <span>Где освоить этот навык</span>
              </div>
              <div className="widget-project-title">
                {skill.neededFor.solutionName}
              </div>
              <p className="widget-artifact">{skill.neededFor.reason}</p>

              <Link href={skill.neededFor.solutionUrl} className="btn-widget-action-amber">
                <span>Начать маршрут решения</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="sidebar-widget explore-widget">
              <div className="widget-header">
                <Compass size={16} className="text-blue" />
                <span>Практика в ProektMap</span>
              </div>
              <p className="widget-artifact">
                Освойте этот навык на реальном артефакте в каталоге готовых AI-решений.
              </p>
              <Link href="/resheniya" className="btn-widget-action">
                <span>Выбрать маршрут решения</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* 2. TOOLS CHIPS */}
          <div className="sidebar-widget tools-widget">
            <div className="widget-header">
              <Wrench size={15} />
              <span>Стек и инструменты</span>
            </div>
            <div className="tools-chips-wrap">
              {skill.tools.map((t) => (
                <span key={t} className="tool-chip-big">{t}</span>
              ))}
            </div>
          </div>

          {/* 3. RETURN TO MATRIX */}
          <div className="sidebar-widget back-widget">
            <Link href="/skills" className="back-to-matrix-btn">
              <ArrowLeft size={14} />
              <span>Вернуться ко всей карте</span>
            </Link>
          </div>
        </aside>
      </div>

      {/* ─── CSS INLINED ─── */}
      <style jsx>{`
        .skill-detail-container {
          max-width: 1100px;
          margin: 0 auto;
          padding: 32px 20px 80px;
          font-family: var(--font-body, "Inter", sans-serif);
          color: var(--color-text-primary, #111);
        }

        /* ─── Breadcrumbs ─── */
        .detail-breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .bc-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: var(--color-text-secondary, #555);
          text-decoration: none;
          font-weight: 600;
        }
        .bc-link:hover {
          color: #111;
        }
        .bc-sep {
          color: var(--color-text-tertiary, #aaa);
        }
        .bc-domain {
          font-weight: 700;
        }
        .bc-current {
          color: var(--color-text-tertiary, #777);
        }

        /* ─── Hero ─── */
        .detail-hero {
          margin-bottom: 36px;
        }
        .detail-hero-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .domain-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .level-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #f0f0f0;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
        }
        .level-code {
          font-family: var(--font-mono, monospace);
          color: #111;
        }
        .level-name {
          color: #666;
        }
        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
        }
        .status-badge.mastered {
          background: rgba(15, 184, 128, 0.1);
          color: #0fb880;
        }
        .status-badge.in-focus {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
        }
        .status-badge.recommended {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }

        .detail-title {
          font-family: var(--font-heading, "Onest", "Inter", sans-serif);
          font-size: clamp(28px, 4.5vw, 40px);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
          margin-bottom: 18px;
        }

        .detail-power-card {
          background: rgba(15, 184, 128, 0.06);
          border: 1px solid rgba(15, 184, 128, 0.25);
          border-radius: 12px;
          padding: 16px 20px;
          margin-bottom: 18px;
        }
        .power-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #0fb880;
          margin-bottom: 6px;
        }
        .power-text {
          font-size: 15px;
          line-height: 1.5;
          font-weight: 600;
          color: #111;
          margin: 0;
        }

        .detail-full-desc {
          font-size: 15px;
          line-height: 1.65;
          color: var(--color-text-secondary, #555);
          max-width: 820px;
        }

        /* ─── Grid ─── */
        .detail-grid {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 32px;
        }
        @media (max-width: 880px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }

        .detail-section {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 24px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .section-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .section-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 18px;
          font-weight: 800;
          margin: 0;
          color: #111;
        }
        .section-hint {
          font-size: 12px;
          color: var(--color-text-tertiary, #888);
        }

        .glossary-badges-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* ─── Levels Stack ─── */
        .levels-stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .level-card {
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 10px;
          padding: 16px;
          background: var(--color-bg-secondary, #fafafa);
          transition: border-color 0.15s ease;
        }
        .level-card.current-level {
          border-color: #0fb880;
          background: #ffffff;
          box-shadow: 0 2px 10px rgba(15, 184, 128, 0.08);
        }
        .level-card-header {
          margin-bottom: 12px;
        }
        .level-card-title-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }
        .level-badge {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 800;
          background: #111;
          color: #fff;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .level-card-name {
          font-family: var(--font-heading, sans-serif);
          font-size: 15px;
          font-weight: 800;
          margin: 0;
          color: #111;
        }
        .level-summary {
          font-size: 13px;
          color: var(--color-text-secondary, #666);
        }
        .level-criteria-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .criterion-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13px;
          line-height: 1.45;
          color: #333;
        }
        .criterion-icon {
          color: #0fb880;
          flex-shrink: 0;
          margin-top: 2px;
        }

        /* ─── Prompts & Commands ─── */
        .prompt-block {
          background: #1e293b;
          color: #fff;
          border-radius: 10px;
          padding: 16px;
          margin-bottom: 14px;
        }
        .prompt-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 10px;
          gap: 12px;
        }
        .prompt-title {
          font-size: 14px;
          font-weight: 700;
          color: #f8fafc;
        }
        .prompt-desc {
          font-size: 12px;
          color: #94a3b8;
        }
        .btn-copy {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.12);
          border: none;
          color: #fff;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.15s ease;
        }
        .btn-copy:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        .prompt-content {
          margin: 0;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          line-height: 1.5;
          color: #38bdf8;
          white-space: pre-wrap;
          word-break: break-word;
          background: rgba(0, 0, 0, 0.25);
          padding: 10px;
          border-radius: 6px;
        }

        .commands-block {
          margin-top: 14px;
        }
        .commands-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #555;
          margin-bottom: 8px;
        }
        .commands-list {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .command-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          padding: 8px 12px;
          border-radius: 6px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
        }
        .btn-cmd-copy {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 2px;
        }
        .btn-cmd-copy:hover {
          color: #111;
        }

        /* ─── Sidebar ─── */
        .detail-sidebar-col {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .sidebar-widget {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 14px;
          padding: 20px;
        }
        .widget-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: #111;
          margin-bottom: 12px;
        }
        .proof-widget {
          border-color: rgba(15, 184, 128, 0.4);
          background: rgba(15, 184, 128, 0.03);
        }
        .needed-widget {
          border-color: rgba(245, 158, 11, 0.4);
          background: rgba(245, 158, 11, 0.03);
        }
        .widget-project-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 16px;
          font-weight: 800;
          color: #111;
          margin-bottom: 6px;
        }
        .widget-artifact {
          font-size: 13px;
          line-height: 1.5;
          color: #555;
          margin-bottom: 12px;
        }
        .widget-date {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          color: #0fb880;
          font-weight: 700;
          margin-bottom: 16px;
        }
        .btn-widget-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: #111;
          color: #fff !important;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none !important;
        }
        .btn-widget-action:hover {
          background: #333;
        }
        .btn-widget-action-amber {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          width: 100%;
          padding: 10px;
          border-radius: 8px;
          background: #f59e0b;
          color: #fff !important;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none !important;
        }
        .btn-widget-action-amber:hover {
          background: #d97706;
        }

        .tools-chips-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .tool-chip-big {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 600;
          background: #f3f4f6;
          border: 1px solid #e5e7eb;
          padding: 4px 8px;
          border-radius: 5px;
          color: #374151;
        }

        .back-to-matrix-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: #555;
          text-decoration: none;
        }
        .back-to-matrix-btn:hover {
          color: #111;
        }

        .text-emerald { color: #0fb880; }
        .text-amber { color: #f59e0b; }
        .text-blue { color: #3b82f6; }
      `}</style>
    </div>
  );
}
