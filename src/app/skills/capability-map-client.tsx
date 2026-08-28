"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  CheckCircle2,
  Zap,
  Compass,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Layers,
  Cpu,
  Database,
  Layout,
  Rocket,
  Filter,
  ExternalLink,
  ChevronRight,
  Target,
  CircleDot,
  Wrench,
} from "lucide-react";
import {
  CAPABILITY_DOMAINS,
  CAPABILITY_SKILLS,
  CapabilityDomainId,
  CapabilitySkill,
} from "./skills-data";

const DOMAIN_ICONS: Record<CapabilityDomainId, any> = {
  product: Compass,
  ai: Cpu,
  arch: Database,
  ui: Layout,
  ship: Rocket,
};

export default function CapabilityMapClient() {
  const [activeDomain, setActiveDomain] = useState<CapabilityDomainId | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "mastered" | "in_focus" | "recommended">("all");
  const [selectedSkill, setSelectedSkill] = useState<CapabilitySkill | null>(null);

  // Stats calculation
  const totalSkills = CAPABILITY_SKILLS.length;
  const masteredSkills = CAPABILITY_SKILLS.filter((s) => s.status === "mastered").length;
  const inFocusSkills = CAPABILITY_SKILLS.filter((s) => s.status === "in_focus").length;
  const recommendedSkills = CAPABILITY_SKILLS.filter((s) => s.status === "recommended").length;

  const currentFocusSkill = useMemo(
    () => CAPABILITY_SKILLS.find((s) => s.status === "in_focus") || CAPABILITY_SKILLS[1],
    []
  );

  const filteredSkills = useMemo(() => {
    return CAPABILITY_SKILLS.filter((s) => {
      if (activeDomain !== "all" && s.domainId !== activeDomain) return false;
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      return true;
    });
  }, [activeDomain, statusFilter]);

  // Radar points computation
  // 5 domains ordered clockwise: product (top), ui (top-right), ship (bottom-right), arch (bottom-left), ai (top-left)
  const radarDomainOrder: CapabilityDomainId[] = ["product", "ui", "ship", "arch", "ai"];
  const centerX = 160;
  const centerY = 160;
  const maxRadius = 110;

  const radarPoints = useMemo(() => {
    return radarDomainOrder.map((domainId, index) => {
      const angle = (index * 72 - 90) * (Math.PI / 180);
      const score = CAPABILITY_DOMAINS[domainId].score / 100;
      const r = maxRadius * score;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      const labelX = centerX + (maxRadius + 28) * Math.cos(angle);
      const labelY = centerY + (maxRadius + 28) * Math.sin(angle);
      return {
        domainId,
        score: CAPABILITY_DOMAINS[domainId].score,
        name: CAPABILITY_DOMAINS[domainId].nameEn,
        color: CAPABILITY_DOMAINS[domainId].color,
        x,
        y,
        labelX,
        labelY,
      };
    });
  }, []);

  const polygonPath = useMemo(() => {
    return radarPoints.map((p) => `${p.x},${p.y}`).join(" ");
  }, [radarPoints]);

  return (
    <div className="capability-container">
      {/* ═══ 1. TOP EDITORIAL HERO ═══ */}
      <header className="capability-header">
        <div className="capability-eyebrow">
          <span className="eyebrow-pill">PROEKTMAP 2026</span>
          <span className="eyebrow-divider">/</span>
          <span className="eyebrow-sub">CAPABILITY PROFILE</span>
        </div>

        <h1 className="capability-title">
          Карта способностей создателя
        </h1>

        <p className="capability-subtitle">
          Не школьный дневник с процентами, а доказанный инженерный контур.
          Здесь отражаются способности, подтверждённые работающим кодом, схемой БД и деплоем в готовых решениях ProektMap.
        </p>

        {/* Macro Summary Stats */}
        <div className="capability-metrics-bar">
          <div className="metric-item">
            <span className="metric-val text-emerald">{masteredSkills}</span>
            <span className="metric-label">освоено через артефакты</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-val text-amber">{inFocusSkills}</span>
            <span className="metric-label">в фокусе проекта</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-val text-blue">{recommendedSkills}</span>
            <span className="metric-label">рекомендовано к шагу</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-val">{totalSkills}</span>
            <span className="metric-label">всего в контуре</span>
          </div>
        </div>
      </header>

      {/* ═══ 2. VISUAL RADAR & CURRENT FOCUS ROW ═══ */}
      <section className="capability-stage">
        {/* Left: The Radar Pentagon */}
        <div className="radar-card">
          <div className="radar-card-header">
            <div className="radar-tag">
              <Sparkles size={14} className="text-emerald" /> Контур силы (5 доменов)
            </div>
            <div className="radar-hint">Нажмите на вершину для фильтра</div>
          </div>

          <div className="radar-svg-wrap">
            <svg viewBox="0 0 320 320" className="radar-svg">
              {/* Concentric Guide Pentagons */}
              {[0.25, 0.5, 0.75, 1.0].map((level) => {
                const guidePoints = radarDomainOrder
                  .map((_, i) => {
                    const angle = (i * 72 - 90) * (Math.PI / 180);
                    const r = maxRadius * level;
                    return `${centerX + r * Math.cos(angle)},${centerY + r * Math.sin(angle)}`;
                  })
                  .join(" ");
                return (
                  <polygon
                    key={level}
                    points={guidePoints}
                    className="radar-guide-line"
                    strokeDasharray={level === 1 ? "none" : "3,3"}
                  />
                );
              })}

              {/* Axis rays */}
              {radarDomainOrder.map((_, i) => {
                const angle = (i * 72 - 90) * (Math.PI / 180);
                const x = centerX + maxRadius * Math.cos(angle);
                const y = centerY + maxRadius * Math.sin(angle);
                return (
                  <line
                    key={i}
                    x1={centerX}
                    y1={centerY}
                    x2={x}
                    y2={y}
                    className="radar-ray"
                  />
                );
              })}

              {/* Active filled polygon */}
              <polygon
                points={polygonPath}
                className="radar-active-polygon"
              />

              {/* Data points (dots) & vertex labels */}
              {radarPoints.map((p) => {
                const isSelected = activeDomain === p.domainId;
                return (
                  <g
                    key={p.domainId}
                    onClick={() => setActiveDomain(activeDomain === p.domainId ? "all" : p.domainId)}
                    className={`radar-vertex-group ${isSelected ? "is-selected" : ""}`}
                  >
                    {/* Circle dot on polygon */}
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isSelected ? 7 : 5}
                      fill={p.color}
                      stroke="#fff"
                      strokeWidth={2}
                      className="radar-dot"
                    />

                    {/* Outer Clickable Vertex Label */}
                    <text
                      x={p.labelX}
                      y={p.labelY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="radar-label"
                      fill={isSelected ? p.color : "currentColor"}
                      fontWeight={isSelected ? 700 : 600}
                    >
                      {p.name}
                    </text>
                    <text
                      x={p.labelX}
                      y={p.labelY + 12}
                      textAnchor="middle"
                      dominantBaseline="central"
                      className="radar-score-badge"
                      fill={p.color}
                    >
                      {p.score}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Quick Domain Indicator Selector below radar */}
          <div className="radar-chips">
            <button
              onClick={() => setActiveDomain("all")}
              className={`chip-btn ${activeDomain === "all" ? "active" : ""}`}
            >
              Все домены
            </button>
            {Object.values(CAPABILITY_DOMAINS).map((d) => {
              const Icon = DOMAIN_ICONS[d.id];
              return (
                <button
                  key={d.id}
                  onClick={() => setActiveDomain(activeDomain === d.id ? "all" : d.id)}
                  className={`chip-btn ${activeDomain === d.id ? "active" : ""}`}
                  style={{
                    borderColor: activeDomain === d.id ? d.color : undefined,
                  }}
                >
                  <Icon size={13} style={{ color: d.color }} />
                  <span>{d.name}</span>
                  <span className="chip-score" style={{ color: d.color }}>
                    {d.score}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Current Focus + Next Step Blueprint */}
        <div className="capability-sidebar">
          {/* 1. CURRENT FOCUS CARD */}
          <div className="focus-card">
            <div className="focus-card-badge">
              <span className="pulse-dot" /> ТЕКУЩИЙ ФОКУС СОЗДАТЕЛЯ
            </div>

            <div className="focus-domain-tag">
              <Rocket size={14} className="text-amber" />
              <span>{currentFocusSkill.domainName}</span>
              <span className="pill-level">{currentFocusSkill.level} · {currentFocusSkill.levelName}</span>
            </div>

            <Link href={`/skills/${currentFocusSkill.slug}`} className="focus-skill-link">
              <h3 className="focus-skill-title">{currentFocusSkill.title}</h3>
            </Link>

            <p className="focus-skill-power">{currentFocusSkill.power}</p>

            {currentFocusSkill.neededFor && (
              <div className="focus-reason-box">
                <div className="reason-label">ЗАЧЕМ ЭТО ВАМ СЕЙЧАС</div>
                <div className="reason-project">
                  → <strong>{currentFocusSkill.neededFor.solutionName}</strong>
                </div>
                <div className="reason-desc">{currentFocusSkill.neededFor.reason}</div>
              </div>
            )}

            <div className="focus-card-actions">
              <Link
                href={currentFocusSkill.neededFor?.solutionUrl || "/resheniya/saas-product"}
                className="btn-primary-focus"
              >
                <span>Освоить в готовом решении</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* 2. THREE NEXT HORIZONS (Векторы расширения) */}
          <div className="horizons-card">
            <div className="horizons-header">
              <Target size={15} className="text-blue" />
              <span>Ближайшие векторы роста</span>
            </div>

            <div className="horizons-list">
              {CAPABILITY_SKILLS.filter((s) => s.status === "recommended").slice(0, 3).map((item) => (
                <Link
                  key={item.id}
                  href={`/skills/${item.slug}`}
                  className="horizon-item"
                >
                  <div className="horizon-top">
                    <span className="horizon-name">{item.title}</span>
                    <span className="horizon-domain">{item.domainName}</span>
                  </div>
                  <div className="horizon-tools">
                    {item.tools.slice(0, 3).map((t) => (
                      <span key={t} className="tool-tag">{t}</span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 3. DOMAIN & STATUS FILTER MATRIX ═══ */}
      <section className="matrix-section">
        <div className="matrix-toolbar">
          <div className="matrix-title-group">
            <h2 className="matrix-heading">Реестр способностей и артефактов</h2>
            <span className="matrix-count">({filteredSkills.length} из {totalSkills})</span>
          </div>

          {/* Status Segmented Filter */}
          <div className="status-segmented">
            <button
              onClick={() => setStatusFilter("all")}
              className={`seg-btn ${statusFilter === "all" ? "active" : ""}`}
            >
              Все
            </button>
            <button
              onClick={() => setStatusFilter("mastered")}
              className={`seg-btn ${statusFilter === "mastered" ? "active" : ""}`}
            >
              ✓ Освоено ({masteredSkills})
            </button>
            <button
              onClick={() => setStatusFilter("in_focus")}
              className={`seg-btn ${statusFilter === "in_focus" ? "active" : ""}`}
            >
              ⚡ В фокусе ({inFocusSkills})
            </button>
            <button
              onClick={() => setStatusFilter("recommended")}
              className={`seg-btn ${statusFilter === "recommended" ? "active" : ""}`}
            >
              ○ К освоению ({recommendedSkills})
            </button>
          </div>
        </div>

        {/* ═══ 4. EDITORIAL SKILLS GRID ═══ */}
        <div className="skills-grid">
          {filteredSkills.map((skill) => {
            const DomainIcon = DOMAIN_ICONS[skill.domainId];
            const domainColor = CAPABILITY_DOMAINS[skill.domainId].color;

            return (
              <article key={skill.id} className={`skill-card status-${skill.status}`}>
                <div className="skill-card-top">
                  <div className="skill-domain-badge" style={{ color: domainColor }}>
                    <DomainIcon size={14} />
                    <span>{skill.domainName}</span>
                  </div>

                  <div className="skill-status-tag">
                    {skill.status === "mastered" && (
                      <span className="status-tag mastered">
                        <CheckCircle2 size={13} /> Освоено на практике
                      </span>
                    )}
                    {skill.status === "in_focus" && (
                      <span className="status-tag in-focus">
                        <Zap size={13} /> В фокусе
                      </span>
                    )}
                    {skill.status === "recommended" && (
                      <span className="status-tag recommended">
                        <CircleDot size={13} /> Рекомендовано
                      </span>
                    )}
                    {skill.status === "base" && (
                      <span className="status-tag base">
                        Базовый
                      </span>
                    )}
                  </div>
                </div>

                <Link href={`/skills/${skill.slug}`} className="skill-title-link">
                  <h3 className="skill-title">{skill.title}</h3>
                </Link>

                <p className="skill-power">{skill.power}</p>

                {/* Proof of Work or Needed For Box */}
                {skill.proofOfWork && (
                  <div className="skill-proof-box">
                    <div className="proof-label">
                      <ShieldCheck size={13} className="text-emerald" />
                      <span>Подтверждено в решении:</span>
                    </div>
                    <div className="proof-project">
                      <Link href={skill.proofOfWork.projectUrl} className="proof-link">
                        {skill.proofOfWork.projectName}
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="proof-artifact">{skill.proofOfWork.artifact}</div>
                  </div>
                )}

                {skill.neededFor && (
                  <div className="skill-needed-box">
                    <div className="needed-label">
                      <Zap size={13} className="text-amber" />
                      <span>Требуется для маршрута:</span>
                    </div>
                    <div className="needed-project">
                      <Link href={skill.neededFor.solutionUrl} className="needed-link">
                        {skill.neededFor.solutionName}
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                    <div className="needed-reason">{skill.neededFor.reason}</div>
                  </div>
                )}

                {/* Footer Tools & Details Link */}
                <div className="skill-card-footer">
                  <div className="skill-tools-list">
                    {skill.tools.slice(0, 3).map((t) => (
                      <span key={t} className="tool-chip">{t}</span>
                    ))}
                  </div>
                  <Link href={`/skills/${skill.slug}`} className="skill-detail-link">
                    <span>Паспорт</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ═══ 5. PROOF OF WORK PHILOSOPHY FOOTER ═══ */}
      <footer className="capability-manifesto">
        <div className="manifesto-card">
          <div className="manifesto-icon">
            <ShieldCheck size={28} className="text-emerald" />
          </div>
          <div className="manifesto-content">
            <h3 className="manifesto-title">Принцип Proof of Work в ProektMap</h3>
            <p className="manifesto-text">
              Навык не начисляется за чтение статьи или просмотр видео. Каждый узел на вашей карте
              загорается зелёным только тогда, когда вы собрали проверяемый артефакт:
              создали схему базы данных, настроили OAuth-авторизацию, подняли Nginx на боевом VPS или подключили платежи.
            </p>
            <div className="manifesto-links">
              <Link href="/resheniya" className="manifesto-action-btn">
                <span>Перейти в каталог готовых решений</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ CSS MODULE INLINED ═══ */}
      <style jsx>{`
        .capability-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          font-family: var(--font-body, "Inter", sans-serif);
          color: var(--color-text-primary, #111);
        }

        /* ─── Header ─── */
        .capability-header {
          margin-bottom: 36px;
        }
        .capability-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-tertiary, #888);
          letter-spacing: 0.06em;
          margin-bottom: 12px;
        }
        .eyebrow-pill {
          color: var(--color-accent, #0fb880);
          background: rgba(15, 184, 128, 0.1);
          padding: 2px 8px;
          border-radius: 4px;
        }
        .capability-title {
          font-family: var(--font-heading, "Onest", "Inter", sans-serif);
          font-size: clamp(28px, 4vw, 42px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
          margin-bottom: 14px;
          color: var(--color-text-primary, #111);
        }
        .capability-subtitle {
          font-size: 16px;
          line-height: 1.6;
          color: var(--color-text-secondary, #555);
          max-width: 780px;
          margin-bottom: 24px;
        }
        .capability-metrics-bar {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 14px 20px;
          width: fit-content;
          flex-wrap: wrap;
        }
        .metric-item {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }
        .metric-val {
          font-family: var(--font-heading, sans-serif);
          font-size: 20px;
          font-weight: 800;
        }
        .metric-label {
          font-size: 13px;
          color: var(--color-text-tertiary, #777);
        }
        .metric-divider {
          width: 1px;
          height: 20px;
          background: var(--color-border-light, #eaeaea);
        }

        /* ─── Stage (Radar + Focus) ─── */
        .capability-stage {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 24px;
          margin-bottom: 48px;
        }
        @media (max-width: 900px) {
          .capability-stage {
            grid-template-columns: 1fr;
          }
        }

        .radar-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 16px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .radar-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }
        .radar-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-primary, #111);
        }
        .radar-hint {
          font-size: 12px;
          color: var(--color-text-tertiary, #888);
        }
        .radar-svg-wrap {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 10px 0;
        }
        .radar-svg {
          width: 100%;
          max-width: 320px;
          height: auto;
          overflow: visible;
        }
        .radar-guide-line {
          fill: none;
          stroke: var(--color-border, #e5e5e5);
          stroke-width: 1;
        }
        .radar-ray {
          stroke: var(--color-border-light, #f0f0f0);
          stroke-width: 1;
        }
        .radar-active-polygon {
          fill: rgba(15, 184, 128, 0.16);
          stroke: #0fb880;
          stroke-width: 2.5;
          stroke-linejoin: round;
        }
        .radar-vertex-group {
          cursor: pointer;
          transition: transform 0.15s ease;
        }
        .radar-vertex-group:hover .radar-dot {
          r: 8;
        }
        .radar-label {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.05em;
          user-select: none;
        }
        .radar-score-badge {
          font-family: var(--font-heading, sans-serif);
          font-size: 10px;
          font-weight: 800;
          user-select: none;
        }

        .radar-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--color-border-light, #f0f0f0);
        }
        .chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          border: 1px solid var(--color-border-light, #eaeaea);
          background: var(--color-bg-secondary, #fafafa);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-text-secondary, #555);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .chip-btn:hover {
          background: #f0f0f0;
          color: #111;
        }
        .chip-btn.active {
          background: #111;
          color: #fff;
          border-color: #111;
        }
        .chip-score {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
        }

        /* ─── Sidebar ─── */
        .capability-sidebar {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .focus-card {
          background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
          color: #fff;
          border-radius: 16px;
          padding: 24px;
          position: relative;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        .focus-card-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: #f59e0b;
          margin-bottom: 14px;
        }
        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f59e0b;
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3);
          display: inline-block;
        }
        .focus-domain-tag {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }
        .pill-level {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          background: rgba(255, 255, 255, 0.12);
          padding: 2px 6px;
          border-radius: 4px;
        }
        .focus-skill-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 20px;
          font-weight: 800;
          color: #fff;
          margin-bottom: 8px;
          line-height: 1.2;
        }
        .focus-skill-power {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 16px;
        }
        .focus-reason-box {
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 12px;
          margin-bottom: 18px;
        }
        .reason-label {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          letter-spacing: 0.06em;
          color: #f59e0b;
          margin-bottom: 4px;
          font-weight: 700;
        }
        .reason-project {
          font-size: 13px;
          color: #fff;
          margin-bottom: 2px;
        }
        .reason-desc {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.65);
          line-height: 1.4;
        }
        .btn-primary-focus {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 12px 16px;
          border-radius: 8px;
          background: #0fb880 !important;
          color: #ffffff !important;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none !important;
          transition: background 0.15s ease, transform 0.1s ease;
          box-shadow: 0 2px 8px rgba(15, 184, 128, 0.3);
        }
        .btn-primary-focus:hover {
          background: #0ca36e !important;
          color: #ffffff !important;
          transform: translateY(-1px);
        }

        .horizons-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 16px;
          padding: 20px;
        }
        .horizons-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-primary, #111);
          margin-bottom: 14px;
        }
        .horizons-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .horizon-item {
          padding: 10px 12px;
          border-radius: 8px;
          background: var(--color-bg-secondary, #fafafa);
          border: 1px solid var(--color-border-light, #f0f0f0);
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .horizon-item:hover {
          border-color: #3b82f6;
          background: #fff;
        }
        .horizon-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }
        .horizon-name {
          font-size: 13px;
          font-weight: 700;
          color: var(--color-text-primary, #111);
        }
        .horizon-domain {
          font-size: 11px;
          color: var(--color-text-tertiary, #888);
        }
        .horizon-tools {
          display: flex;
          gap: 6px;
          flex-wrap: wrap;
        }
        .tool-tag {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          background: rgba(0, 0, 0, 0.05);
          padding: 2px 6px;
          border-radius: 3px;
          color: var(--color-text-secondary, #555);
        }

        /* ─── Matrix Section ─── */
        .matrix-section {
          margin-bottom: 48px;
        }
        .matrix-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .matrix-title-group {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .matrix-heading {
          font-family: var(--font-heading, sans-serif);
          font-size: 22px;
          font-weight: 800;
          color: var(--color-text-primary, #111);
        }
        .matrix-count {
          font-size: 14px;
          color: var(--color-text-tertiary, #888);
        }
        .status-segmented {
          display: flex;
          background: var(--color-bg-secondary, #f0f0f0);
          padding: 4px;
          border-radius: 8px;
          gap: 4px;
        }
        .seg-btn {
          border: none;
          background: none;
          padding: 6px 12px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-text-secondary, #555);
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .seg-btn.active {
          background: var(--color-surface, #fff);
          color: var(--color-text-primary, #111);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
        }

        /* ─── Skills Grid ─── */
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 18px;
        }
        .skill-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .skill-card:hover {
          border-color: #ccc;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        }
        .skill-card.status-in_focus {
          border-color: #f59e0b;
          box-shadow: 0 0 0 1px #f59e0b;
        }
        .skill-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }
        .skill-domain-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
        }
        .status-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 12px;
        }
        .status-tag.mastered {
          background: rgba(15, 184, 128, 0.1);
          color: #0fb880;
        }
        .status-tag.in-focus {
          background: rgba(245, 158, 11, 0.12);
          color: #d97706;
        }
        .status-tag.recommended {
          background: rgba(59, 130, 246, 0.1);
          color: #2563eb;
        }
        .status-tag.base {
          background: #f0f0f0;
          color: #666;
        }

        .skill-title-link {
          text-decoration: none;
          color: inherit;
        }
        .skill-title-link:hover .skill-title {
          color: var(--color-accent, #0fb880);
        }
        .skill-detail-link {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 11px;
          font-weight: 700;
          color: #2563eb;
          text-decoration: none;
          padding: 3px 6px;
          border-radius: 4px;
          background: rgba(37, 99, 235, 0.08);
          transition: background 0.15s ease;
        }
        .skill-detail-link:hover {
          background: rgba(37, 99, 235, 0.16);
          color: #1d4ed8;
        }
        .skill-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 17px;
          font-weight: 800;
          color: var(--color-text-primary, #111);
          margin-bottom: 8px;
          line-height: 1.25;
          transition: color 0.15s ease;
        }
        .skill-power {
          font-size: 13px;
          line-height: 1.55;
          color: var(--color-text-secondary, #555);
          margin-bottom: 16px;
        }

        .skill-proof-box {
          background: rgba(15, 184, 128, 0.05);
          border: 1px solid rgba(15, 184, 128, 0.2);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }
        .proof-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #0fb880;
          margin-bottom: 4px;
        }
        .proof-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #111;
          text-decoration: underline;
          margin-bottom: 4px;
        }
        .proof-link:hover {
          color: #0fb880;
        }
        .proof-artifact {
          font-size: 12px;
          color: #444;
          line-height: 1.4;
        }

        .skill-needed-box {
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.25);
          border-radius: 8px;
          padding: 10px 12px;
          margin-bottom: 16px;
        }
        .needed-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: #d97706;
          margin-bottom: 4px;
        }
        .needed-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 13px;
          font-weight: 700;
          color: #111;
          text-decoration: underline;
          margin-bottom: 4px;
        }
        .needed-link:hover {
          color: #d97706;
        }
        .needed-reason {
          font-size: 12px;
          color: #555;
          line-height: 1.4;
        }

        .skill-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid var(--color-border-light, #f0f0f0);
          margin-top: auto;
        }
        .skill-tools-list {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .tool-chip {
          font-family: var(--font-mono, monospace);
          font-size: 10px;
          background: var(--color-bg-secondary, #fafafa);
          border: 1px solid var(--color-border-light, #e5e5e5);
          padding: 2px 6px;
          border-radius: 4px;
          color: var(--color-text-secondary, #555);
        }
        .skill-level-pill {
          font-family: var(--font-mono, monospace);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-text-tertiary, #888);
          background: #f0f0f0;
          padding: 2px 6px;
          border-radius: 4px;
        }

        /* ─── Manifesto Footer ─── */
        .capability-manifesto {
          margin-top: 48px;
        }
        .manifesto-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border-light, #eaeaea);
          border-radius: 16px;
          padding: 32px;
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        @media (max-width: 650px) {
          .manifesto-card {
            flex-direction: column;
          }
        }
        .manifesto-title {
          font-family: var(--font-heading, sans-serif);
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 8px;
          color: var(--color-text-primary, #111);
        }
        .manifesto-text {
          font-size: 14px;
          line-height: 1.6;
          color: var(--color-text-secondary, #555);
          max-width: 720px;
          margin-bottom: 20px;
        }
        .manifesto-action-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 8px;
          background: #111;
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.15s ease;
        }
        .manifesto-action-btn:hover {
          background: #333;
          color: #fff;
        }

        /* Utility colors */
        .text-emerald { color: #0fb880; }
        .text-amber { color: #f59e0b; }
        .text-blue { color: #3b82f6; }
      `}</style>
    </div>
  );
}
