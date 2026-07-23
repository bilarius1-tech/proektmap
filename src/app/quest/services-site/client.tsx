"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import ReactFlow, { Node, Edge, Background, Controls, Handle, Position } from "reactflow";
import "reactflow/dist/style.css";
import { ArrowRight, Check, Copy, Lock, Unlock, Sparkles, X, ChevronRight, Zap, Shield, Database, Rocket, BookOpen } from "lucide-react";
import Term from "@/components/glossary/tooltip-term";
import Link from "next/link";

const STAGE_LABELS: Record<number, string> = { 1: "Ограничения", 2: "Данные", 3: "Генерация", 4: "Запуск" };
const STAGE_COLORS: Record<number, string> = { 1: "#f59e0b", 2: "#3b82f6", 3: "#8b5cf6", 4: "#22c55e" };

export default function QuestClient({ nodes: questNodes, edges: questEdges }: any) {
  const [activeNode, setActiveNode] = useState<any>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [selectedOption, setSelectedOption] = useState<Record<string, string>>({});
  const [specLocked, setSpecLocked] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Load progress from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("quest-services-site");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.completed) setCompleted(new Set(data.completed));
        if (data.selectedOption) setSelectedOption(data.selectedOption);
        if (data.specLocked) setSpecLocked(data.specLocked);
      }
    } catch {}
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem("quest-services-site", JSON.stringify({
      completed: [...completed],
      selectedOption,
      specLocked,
    }));
  }, [completed, selectedOption, specLocked]);

  const options = activeNode ? JSON.parse(activeNode.options || "[]") : [];

  function handleOptionClick(opt: any) {
    setSelectedOption(prev => ({ ...prev, [activeNode.id]: opt.id }));
    setCompleted(prev => new Set([...prev, activeNode.id]));
    setActiveNode(null);
  }

  function copyPrompt(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  }

  // React Flow nodes
  const flowNodes: Node[] = useMemo(() => questNodes.map((n: any, i: number) => {
    const isDone = completed.has(n.id);
    const isActive = activeNode?.id === n.id;
    const stageColor = STAGE_COLORS[n.stage] || "#8b5cf6";
    return {
      id: n.id,
      data: { label: "" },
      position: { x: i * 180, y: (n.stage - 1) * 140 },
      style: {
        background: isDone ? "#ecfdf5" : isActive ? `${stageColor}15` : "var(--color-bg-primary)",
        border: isDone ? "2px solid #22c55e" : isActive ? `2px solid ${stageColor}` : "1px solid var(--color-border-light)",
        borderRadius: 0, padding: "12px 16px", minWidth: 160, cursor: "pointer",
        color: "var(--color-text-primary)", fontSize: 11, fontWeight: 700,
      },
    };
  }), [questNodes, completed, activeNode]);

  const flowEdges: Edge[] = useMemo(() => questEdges.map((e: any) => ({
    id: e.id, source: e.sourceId, target: e.targetId,
    style: { stroke: "var(--color-border)", strokeWidth: 2 }, animated: false,
  })), [questEdges]);

  const onNodeClick = useCallback((_e: any, node: Node) => {
    const qn = questNodes.find((n: any) => n.id === node.id);
    if (qn) setActiveNode(qn);
  }, [questNodes]);

  const progress = completed.size;
  const total = questNodes.length;

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)" }}>
      {/* Header */}
      <div style={{ padding: "var(--space-l) var(--space-xl)", background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-light)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>
              Маршрут
            </div>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 900, fontFamily: "var(--font-heading)", letterSpacing: "-0.01em", margin: 0 }}>
              Сайт услуг: от хаоса к архитектуре
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Progress */}
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginBottom: 2 }}>Прогресс</div>
              <div style={{ display: "flex", gap: 2 }}>
                {questNodes.map((n: any) => (
                  <div key={n.id} style={{
                    width: 16, height: 4,
                    background: completed.has(n.id) ? "var(--color-accent)" : "var(--color-border-light)",
                  }} />
                ))}
              </div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{progress}/{total}</div>
            </div>
            {/* Spec Lock */}
            <button onClick={() => setSpecLocked(!specLocked)}
              title={specLocked ? "Контракт зафиксирован" : "Зафиксировать контракт"}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 0,
                border: specLocked ? "1px solid #22c55e" : "1px solid var(--color-border)",
                background: specLocked ? "#ecfdf5" : "var(--color-bg-primary)",
                color: specLocked ? "#065f46" : "var(--color-text-secondary)",
                cursor: "pointer", fontWeight: 600, fontSize: "var(--text-xs)",
              }}>
              {specLocked ? <Lock size={14} /> : <Unlock size={14} />}
              {specLocked ? "Контракт 🔒" : "Зафиксировать"}
            </button>
          </div>
        </div>
      </div>

      {/* Compact progress */}
        <div style={{ padding: "6px var(--space-m)", background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border-light)", display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>
            <Link href="/corporate-website?demo=true" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Демо-тур</Link>
            <span style={{ margin: "0 8px", color: "var(--color-text-tertiary)" }}>|</span>
            <Link href="/quest/services-site" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Маршрут «Сайт услуг»</Link>
            <span style={{ margin: "0 8px", color: "var(--color-text-tertiary)" }}>|</span>
            <Link href="/architecture" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Карта метро</Link>
            <span style={{ margin: "0 8px", color: "var(--color-text-tertiary)" }}>|</span>
            <Link href="/patterns" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Паттерны</Link>
          </div>
        </div>

      {/* React Flow */}
      <div style={{ height: 350, background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-light)" }}>
        <ReactFlow nodes={flowNodes} edges={flowEdges} onNodeClick={onNodeClick} fitView fitViewOptions={{ padding: 0.4 }}>
          <Background color="var(--color-border-light)" gap={24} />
          <Controls style={{ borderRadius: 0 }} />
        </ReactFlow>
      </div>

      {/* Stage labels */}
      <div style={{ display: "flex", justifyContent: "center", gap: 0, padding: "var(--space-s) var(--space-m)", background: "var(--color-bg-primary)" }}>
        {Object.entries(STAGE_LABELS).map(([stage, label]) => (
          <div key={stage} style={{
            padding: "6px 20px", fontSize: "var(--text-xs)", fontWeight: 600,
            color: STAGE_COLORS[Number(stage)], borderLeft: `3px solid ${STAGE_COLORS[Number(stage)]}`,
          }}>
            Этап {stage}: {label}
          </div>
        ))}
      </div>

      {/* Node list / Sidebar */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-l) var(--space-m)" }}>
        {!activeNode && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--color-text-tertiary)" }}>
            <Sparkles size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <div style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: 4 }}>
              {progress === 0 ? "Нажми на первый узел чтобы начать" : progress === total ? "Маршрут пройден! 🎉" : "Выбери следующий узел на карте"}
            </div>
            <div style={{ fontSize: "var(--text-xs)" }}>
              {progress === 0 ? "Следуй за зелёными узлами — они ведут к запуску проекта." : `${progress} из ${total} узлов пройдено`}
            </div>
          </div>
        )}

        {activeNode && (
          <div style={{
            padding: "var(--space-l)", background: "var(--color-bg-primary)",
            border: `2px solid ${STAGE_COLORS[activeNode.stage]}`,
            borderRadius: 0, animation: "slideUp 0.3s ease",
          }}>
            {/* Close + Stage */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)" }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: "var(--radius-full)", background: `${STAGE_COLORS[activeNode.stage]}15`, color: STAGE_COLORS[activeNode.stage] }}>
                Этап {activeNode.stage}: {STAGE_LABELS[activeNode.stage]}
              </span>
              <button onClick={() => setActiveNode(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)" }}>
                <X size={16} />
              </button>
            </div>

            {/* Title */}
            <h2 style={{ fontSize: "var(--text-l)", fontWeight: 800, marginBottom: 4, fontFamily: "var(--font-heading)" }}>
              {activeNode.title}
            </h2>
            <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-m)" }}>
              {activeNode.description}
            </p>

            {/* Context */}
            <div style={{
              padding: "var(--space-m)", background: "#fffbeb", borderRadius: 0,
              border: "1px solid #f59e0b", marginBottom: "var(--space-m)",
            }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#92400e", textTransform: "uppercase", marginBottom: 4 }}>
                <Shield size={12} style={{ display: "inline", marginRight: 4 }} /> Контекст
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "#92400e", lineHeight: 1.6 }}>
                {activeNode.context}
              </div>
            </div>

            {/* Question */}
            <div style={{ fontSize: "var(--text-m)", fontWeight: 700, marginBottom: "var(--space-m)", color: "var(--color-text-primary)" }}>
              {activeNode.question}
            </div>

            {/* Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
              {options.map((opt: any, i: number) => {
                const isSelected = selectedOption[activeNode.id] === opt.id;
                return (
                  <button key={opt.id}
                    onClick={() => handleOptionClick(opt)}
                    style={{
                      textAlign: "left", padding: "var(--space-m)", borderRadius: 0,
                      border: isSelected ? "2px solid var(--color-accent)" : "1px solid var(--color-border-light)",
                      background: isSelected ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
                      cursor: "pointer", transition: "all 0.15s", color: "var(--color-text-primary)",
                    }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>{["🅰️","🅱️","©️"][i] || "•"}</span>
                      <span style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{opt.text}</span>
                      {isSelected && <Check size={16} style={{ color: "var(--color-accent)", marginLeft: "auto" }} />}
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginLeft: 26 }}>
                      {opt.consequence}
                    </div>

                    {/* Prompt — show after selection */}
                    {isSelected && opt.prompt && (
                      <div style={{ marginTop: "var(--space-s)", marginLeft: 26, padding: "var(--space-s)", background: "var(--color-bg-primary)", borderRadius: 0, border: "1px solid var(--color-accent)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--color-accent)", textTransform: "uppercase" }}>
                            <Zap size={12} style={{ display: "inline", marginRight: 4 }} /> Готовый промпт
                          </span>
                          <button onClick={(e) => { e.stopPropagation(); copyPrompt(opt.prompt, opt.id); }}
                            style={{
                              display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 0,
                              border: "1px solid var(--color-accent)", background: copied === opt.id ? "var(--color-accent)" : "white",
                              color: copied === opt.id ? "white" : "var(--color-accent)", fontWeight: 600, fontSize: 10, cursor: "pointer",
                            }}>
                            {copied === opt.id ? <Check size={12} /> : <Copy size={12} />}
                            {copied === opt.id ? "Скопировано" : "Копировать"}
                          </button>
                        </div>
                        <div style={{ fontSize: 10, fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6, color: "var(--color-text-secondary)", maxHeight: 120, overflow: "auto" }}>
                          {opt.prompt}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom CTA */}
        {progress === total && (
          <div style={{ textAlign: "center", padding: "var(--space-xl)", marginTop: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: 0, border: "2px solid var(--color-accent)" }}>
            <Rocket size={24} style={{ color: "var(--color-accent)", marginBottom: 8 }} />
            <div style={{ fontWeight: 800, fontSize: "var(--text-l)", marginBottom: 4 }}>Маршрут пройден!</div>
            <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>
              Ты прошёл все 7 узлов и принял ключевые архитектурные решения. Скопируй промпты и используй их в своём ИИ-инструменте.
            </p>
            <Link href="/corporate-website" style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0,
              background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700, fontSize: "var(--text-s)",
            }}>
              Перейти в Blueprint <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
