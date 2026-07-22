"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ExternalLink, Info, Train, ChevronRight } from "lucide-react";

// Color scheme for metro lines
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

  // Get the first (primary) blueprint's stages
  const primaryBp = blueprints?.[0];
  const stages = primaryBp?.stages?.map((bs: any) => bs.stage) || [];

  // Group stages by phase
  const phases = useMemo(() => {
    const groups: Record<string, any[]> = {};
    for (const s of stages) {
      const phasePrefix = s.slug?.split("-").slice(0, 2).join("-") || "other";
      if (!groups[phasePrefix]) groups[phasePrefix] = [];
      groups[phasePrefix].push(s);
    }
    // Sort by sortOrder
    for (const key of Object.keys(groups)) {
      groups[key].sort((a: any, b: any) => a.sortOrder - b.sortOrder);
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
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>
          🚇 Карта метро AI-инжиниринга
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.7, maxWidth: 700 }}>
          6 линий — от идеи до запуска. Каждая станция = этап Blueprint'а.
          Справа — компоненты ProektMap, которые помогут на этом этапе.
          Наведи на станцию — узнай что внутри.
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
              {/* Line + Stations */}
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
                  position: "relative",
                  minHeight: 100,
                }}
                onClick={() => setSelectedPhase(isSelected ? null : phase)}
              >
                {/* Phase label */}
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

                {/* Stations (circles connected by line) */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 0, overflow: "auto", position: "relative" }}>
                  {/* Horizontal line */}
                  <div style={{
                    position: "absolute", left: 0, right: 0, top: "50%", height: 3,
                    background: lineColor.line, borderRadius: 2, opacity: 0.4,
                  }} />

                  {stations.map((s: any, si: number) => {
                    const isHovered = hoveredStation === s.slug;
                    const hasDecisions = s.decisions?.length > 0;

                    return (
                      <div
                        key={s.slug}
                        style={{
                          position: "relative", zIndex: 1,
                          display: "flex", flexDirection: "column", alignItems: "center",
                          marginRight: si < stations.length - 1 ? 30 : 0,
                          flexShrink: 0,
                        }}
                        onMouseEnter={() => setHoveredStation(s.slug)}
                        onMouseLeave={() => setHoveredStation(null)}
                      >
                        {/* Station circle */}
                        <Link
                          href={`/corporate-website?stage=${s.slug}`}
                          style={{
                            width: isHovered ? 44 : 36,
                            height: isHovered ? 44 : 36,
                            borderRadius: "50%",
                            background: isHovered ? lineColor.line : "var(--color-bg-primary)",
                            border: `3px solid ${lineColor.line}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            color: isHovered ? "white" : lineColor.line,
                            fontWeight: 800, fontSize: 11,
                            transition: "all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                            animation: "pulseStation 3s infinite",
                            animationDelay: `${si * 0.3}s`,
                            textDecoration: "none",
                            boxShadow: isHovered ? `0 0 16px ${lineColor.line}40` : "none",
                          }}
                          title={`${s.title} — ${hasDecisions ? s.decisions.length + " решений" : "пересадка"}`}
                        >
                          {si + 1}
                        </Link>
                        {/* Station label */}
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

                {/* Components (right side) — shown when phase selected */}
                {isSelected && components.length > 0 && (
                  <div style={{
                    width: 200, flexShrink: 0, marginLeft: "var(--space-l)",
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
                        <ExternalLink size={10} style={{ opacity: 0.3, flexShrink: 0, marginTop: 2 }} />
                      </a>
                    ))}
                  </div>
                )}

                {/* Expand indicator */}
                <div style={{ display: "flex", alignItems: "center", marginLeft: 8, color: lineColor.line, opacity: 0.5 }}>
                  <ChevronRight size={16} style={{ transform: isSelected ? "rotate(90deg)" : "", transition: "0.2s" }} />
                </div>
              </div>

              {/* Vertical transfer line between phases */}
              {phaseIndex < phaseKeys.length - 1 && (
                <div style={{ display: "flex", justifyContent: "center", padding: "4px 0 4px 140px" }}>
                  <div style={{ width: 2, height: 16, background: "var(--color-border)", opacity: 0.5 }} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Help for beginners */}
      <div style={{ padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: 0, border: "1px solid var(--color-accent)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
          <Info size={16} style={{ color: "var(--color-accent)" }} />
          <span style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>Как пользоваться картой</span>
        </div>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.8 }}>
          <strong>1.</strong> Шесть линий = шесть фаз разработки. Идите слева направо.<br />
          <strong>2.</strong> Кликните по линии — увидите компоненты ProektMap для этой фазы.<br />
          <strong>3.</strong> Наведите курсор на станцию — откроется название этапа.<br />
          <strong>4.</strong> Кликните по станции — перейдёте к этапу в Blueprint'е.
        </div>
      </div>

      {/* Animations */}
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
