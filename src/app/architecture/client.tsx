"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Breadcrumbs from "@/components/nav/breadcrumbs";
import { ExternalLink, Info, Train, ChevronRight, ArrowRight, X, Layers } from "lucide-react";

const LINE_COLORS: Record<string, { line: string; bg: string }> = {
  "phase-0": { line: "#22c55e", bg: "#f0fdf4" },
  "phase-1": { line: "#f59e0b", bg: "#fffbeb" },
  "phase-2": { line: "#3b82f6", bg: "#eff6ff" },
  "phase-3": { line: "#8b5cf6", bg: "#f5f3ff" },
  "phase-4": { line: "#f97316", bg: "#fff7ed" },
  "phase-5": { line: "#ef4444", bg: "#fef2f2" },
};

const PHASE_NAMES: Record<string, string> = {
  "phase-0": "🧭 Подготовка",
  "phase-1": "🏗️ Фундамент",
  "phase-2": "📐 Проектирование",
  "phase-3": "🎨 Разработка",
  "phase-4": "🔌 Интеграции",
  "phase-5": "🚀 Запуск",
};

export default function ArchitectureClient({ blueprints, componentMap }: any) {
  const [hoveredStation, setHoveredStation] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const [infoCard, setInfoCard] = useState<any | null>(null);

  const primaryBp = blueprints?.[0];
  const stages = primaryBp?.stages?.map((bs: any) => bs.stage) || [];

  const phases = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const s of stages) {
      const phasePrefix = s.slug?.split("-").slice(0, 2).join("-") || "other";
      if (!groups[phasePrefix]) groups[phasePrefix] = [];
      groups[phasePrefix].push(s);
      groups[phasePrefix].sort((a: any, b: any) => a.sortOrder - b.sortOrder);
    }
    return groups;
  }, [stages]);

  const phaseKeys = Object.keys(phases).filter(k => k.startsWith("phase-")).sort();

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      {/* Header */}
      <div style={{ marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 14px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: "var(--space-s)" }}>
          <Train size={14} /> КАРТА МЕТРО
        </div>
        <Breadcrumbs pathname="/architecture" pageTitle="Карта метро" />
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>
          🚇 Карта метро AI-инжиниринга
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          6 линий — от идеи до запуска. Наведи — увидишь название. Кликни — узнаешь подробности.
        </p>
      </div>

      {/* Metro Map */}
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: "var(--space-xl)" }}>
        {phaseKeys.map((phase, phaseIndex) => {
          const lineColor = LINE_COLORS[phase] || LINE_COLORS["phase-0"];
          const stations = phases[phase] || [];
          const components = componentMap[phase] || [];
          const isSelected = selectedPhase === phase;

          return (
            <div key={phase}>
              <div
                style={{
                  display: "flex", alignItems: "stretch", gap: 0,
                  padding: "var(--space-m)",
                  background: isSelected ? lineColor.bg : (hoveredStation?.startsWith(phase) ? lineColor.bg : "transparent"),
                  borderRadius: 0,
                  borderLeft: `4px solid ${lineColor.line}`,
                  marginBottom: 0,
                  transition: "background 0.3s",
                  cursor: "pointer",
                  minHeight: 100,
                }}
                onClick={() => setSelectedPhase(isSelected ? null : phase)}
              >
                <div style={{ width: 140, flexShrink: 0, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: lineColor.line, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 2 }}>
                    Линия {phaseIndex + 1}
                  </div>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>
                    {PHASE_NAMES[phase] || phase}
                  </div>
                  <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>
                    {stations.length} станций
                  </div>
                </div>

                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 0, overflow: "auto", position: "relative" }}>
                  <div style={{
                    position: "absolute", left: 0, right: 0, top: "50%", height: 3,
                    background: lineColor.line, borderRadius: 2, opacity: 0.4,
                  }} />

                  {stations.map((s: any, si: number) => {
                    const isHovered = hoveredStation === s.slug;
                    return (
                      <div
                        key={s.slug}
                        style={{
                          position: "relative", zIndex: 1,
                          display: "flex", flexDirection: "column", alignItems: "center",
                          marginRight: si < stations.length - 1 ? 30 : 0, flexShrink: 0,
                        }}
                        onMouseEnter={() => setHoveredStation(s.slug)}
                        onMouseLeave={() => setHoveredStation(null)}
                      >
                        {/* Click → show info card, NOT instant redirect */}
                        <div
                          onClick={(e) => { e.stopPropagation(); setInfoCard({ ...s, color: lineColor.line }); }}
                          style={{
                            width: isHovered ? 44 : 36, height: isHovered ? 44 : 36,
                            borderRadius: "50%",
                            background: isHovered ? lineColor.line : "var(--color-bg-primary)",
                            border: `3px solid ${lineColor.line}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: isHovered ? "white" : lineColor.line,
                            fontWeight: 800, fontSize: 11,
                            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            animation: "pulseStation 3s infinite",
                            animationDelay: `${si * 0.3}s`,
                            boxShadow: isHovered ? `0 0 16px ${lineColor.line}40` : "none",
                          }}
                          title={s.title}
                        >
                          {si + 1}
                        </div>
                        {isHovered && (
                          <div style={{
                            position: "absolute", top: -48, left: "50%", transform: "translateX(-50%)",
                            padding: "6px 12px", borderRadius: 0, background: lineColor.line, color: "white",
                            fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
                            zIndex: 10, boxShadow: `0 4px 12px ${lineColor.line}40`,
                            animation: "tooltipIn 0.2s ease",
                          }}>
                            {s.title}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Components (right side) */}
                {isSelected && components.length > 0 && (
                  <div style={{
                    width: 220, flexShrink: 0, marginLeft: "var(--space-l)",
                    display: "flex", flexDirection: "column", gap: 6,
                    padding: "var(--space-s)", background: "var(--color-bg-primary)",
                    borderRadius: 0, border: `1px solid ${lineColor.line}`,
                    animation: "slideIn 0.3s ease",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 2 }}>
                      Компоненты ProektMap
                    </div>
                    {components.map((c: any, ci: number) => (
                      <a key={ci} href={c.href} target={c.href.startsWith("http") ? "_blank" : "_self"} rel="noopener"
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 6, padding: "6px 8px",
                          borderRadius: 0, background: "var(--color-bg-secondary)",
                          textDecoration: "none", color: "inherit",
                          border: "1px solid var(--color-border-light)",
                        }}>
                        <span style={{ fontSize: 16 }}>{c.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 11, fontWeight: 700 }}>{c.name}</div>
                          <div style={{ fontSize: 9, color: "var(--color-text-tertiary)", lineHeight: 1.3 }}>{c.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}

                <ChevronRight size={16} style={{ opacity: 0.3, marginLeft: 4, marginTop: 4, transition: "0.2s", transform: isSelected ? "rotate(90deg)" : "" }} />
              </div>

              {phaseIndex < phaseKeys.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 4px 140px" }}>
                  <div style={{ width: 2, height: 16, background: "var(--color-border)", opacity: 0.5 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Info Card Modal */}
      {infoCard && (
        <div onClick={() => setInfoCard(null)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.3)" }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: "var(--color-bg-primary)", borderRadius: 0, maxWidth: 420, width: "90%",
            padding: "var(--space-l)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            borderTop: `4px solid ${infoCard.color}`,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-m)" }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, color: infoCard.color, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {PHASE_NAMES[infoCard.slug?.split("-").slice(0,2).join("-")] || "Этап"}
                </div>
                <div style={{ fontSize: "var(--text-l)", fontWeight: 800, marginTop: 4 }}>{infoCard.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 4 }}>
                  {infoCard.decisions?.length || 0} решений · ~{infoCard.decisions?.reduce((s: number, d: any) => s + (d.xpReward || 5), 0) || 0} XP
                </div>
              </div>
              <button onClick={() => setInfoCard(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-m)" }}>
              {infoCard.description || "Этот этап содержит решения по ключевым вопросам разработки."}
            </p>

            <div style={{ display: "flex", gap: 8 }}>
              <Link
                href={`/corporate-website?stage=${infoCard.slug}&from=architecture`}
                onClick={() => setInfoCard(null)}
                style={{
                  flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  padding: "12px 20px", borderRadius: 0, background: infoCard.color, color: "white",
                  textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)",
                }}
              >
                <Layers size={14} /> Перейти в Blueprint
              </Link>
              <button onClick={() => setInfoCard(null)}
                style={{
                  padding: "12px 20px", borderRadius: 0, border: "1px solid var(--color-border)",
                  background: "var(--color-bg-primary)", color: "var(--color-text-secondary)",
                  cursor: "pointer", fontWeight: 600, fontSize: "var(--text-s)",
                }}>
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Help */}
      <div style={{ padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: 0, border: "1px solid var(--color-accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
          <Info size={16} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>Как пользоваться картой</span>
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
          <strong>1.</strong> Шесть линий = шесть фаз. Идите слева направо.<br />
          <strong>2.</strong> Наведите на круг — увидите название этапа.<br />
          <strong>3.</strong> Кликните на круг — откроется карточка с описанием и кнопкой «Перейти в Blueprint».<br />
          <strong>4.</strong> Кликните на линию — увидите связанные компоненты ProektMap.
        </div>
      </div>

      <style>{`
        @keyframes pulseStation {
          0%, 100% { box-shadow: 0 0 0 0 currentColor; }
          50% { box-shadow: 0 0 8px 2px currentColor; }
        }
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateX(-50%) translateY(4px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
