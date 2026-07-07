"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, CheckCircle, RefreshCw, Copy, ChevronDown, ChevronUp, Menu, X, Home, ArrowLeft } from "lucide-react";

const LUCIDE_ICONS: Record<string, any> = { Eye, CheckCircle, RefreshCw, Copy, ChevronDown, ChevronUp, Menu, X };

interface Decision {
  id: string; title: string; slug: string;
  problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; whenNotUse: string; mistakes: string;
  context: string; constraints: string; validation: string; iteration: string;
  xpReward: number; timeEstimate: string;
}
interface Stage {
  id: string; title: string; slug: string; icon: string; description: string | null;
  decisions: Decision[];
}
interface Blueprint {
  id: string; title: string; slug: string; description: string | null;
  totalXp: number; totalDecisions: number;
  stages: Array<{ stage: Stage; sortOrder: number }>;
}

function buildPrompt(dec: Decision, bp: Blueprint): string {
  const parts = [];
  if (dec.context) parts.push("## Контекст\n" + dec.context);
  parts.push("## Задача\n" + dec.problem);
  if (dec.why) parts.push("## Почему это важно\n" + dec.why);
  if (dec.constraints) parts.push("## Ограничения\nНЕ делай:\n" + dec.constraints);
  if (dec.recommended) parts.push("## Рекомендация\n" + dec.recommended);
  if (dec.validation) parts.push("## Как проверить\n" + dec.validation);
  if (dec.iteration) parts.push("## Как улучшить\n" + dec.iteration);
  if (dec.mistakes) parts.push("## Частые ошибки\n" + dec.mistakes);
  parts.push("---\nЯ прохожу Blueprint «" + bp.title + "» на ProektMap. Отвечай как AI-инженер: просто, без жаргона, только то что нужно на этом этапе.");
  return parts.join("\n\n");
}

export default function BlueprintPageClient({ blueprint }: { blueprint: Blueprint }) {
  const router = useRouter();
  const stages = blueprint.stages.map(bs => bs.stage);
  const [activeStage, setActiveStage] = useState(stages[0]?.slug || "");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedDec, setExpandedDec] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<Record<string, number>>({});
  const [promptCopied, setPromptCopied] = useState<string | null>(null);
  const [totalXp, setTotalXp] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    fetch("/api/progress").then(r => r.json()).then(d => {
      setCompleted(new Set(d.completed));
      setTotalXp(d.totalXp);
    });
  }, []);

  function toggle(id: string) {
    const newStatus = completed.has(id) ? "pending" : "done";
    const next = new Set(completed);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompleted(next);
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decisionId: id, status: newStatus }) })
      .then(r => r.json()).then(d => { if (d.xpGained) setTotalXp(x => x + d.xpGained); });
  }

  function copyPrompt(dec: Decision) {
    navigator.clipboard.writeText(buildPrompt(dec, blueprint));
    setPromptCopied(dec.id);
    setTimeout(() => setPromptCopied(null), 2000);
  }

  const currentStage = stages.find(s => s.slug === activeStage) || stages[0];
  const totalDone = completed.size;
  const progress = Math.round((totalDone / blueprint.totalDecisions) * 100);

  const steps = [
    { key: 1, label: "ПОНЯТЬ" },
    { key: 2, label: "ВЫБРАТЬ" },
    { key: 3, label: "ПРОВЕРИТЬ" },
  ];

  // Common styles
  const sidebarW = isMobile ? "100%" : 280;

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100dvh" }}>
      {/* Header */}
      <header style={{
        height: 56, background: "var(--color-bg-primary)", display: "flex", alignItems: "center",
        justifyContent: "space-between", padding: "0 var(--space-m)", borderBottom: "1px solid var(--color-border-light)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
          {isMobile && (
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "var(--color-text-primary)" }}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}
          <a href="/" style={{ fontSize: 18, fontWeight: 800, textDecoration: "none", color: "inherit", whiteSpace: "nowrap" }}>
            Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
          </a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
          <span style={{ fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-accent)" }}>{totalXp} XP</span>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--color-bg-tertiary)" }} />
        </div>
      </header>

      <div style={{ display: "flex", position: "relative" }}>
        {/* Sidebar */}
        <aside style={{
          width: isMobile ? (sidebarOpen ? "100%" : 0) : sidebarW,
          minWidth: isMobile ? (sidebarOpen ? "100%" : 0) : sidebarW,
          height: isMobile ? "auto" : "calc(100dvh - 56px)",
          background: "var(--color-bg-primary)", borderRight: "1px solid var(--color-border-light)",
          overflow: "auto", transition: "width 0.2s, min-width 0.2s",
          position: isMobile ? "absolute" : "relative",
          top: isMobile ? 0 : "auto", left: 0,
          zIndex: 99, boxShadow: isMobile && sidebarOpen ? "var(--shadow-l)" : "none",
          padding: sidebarOpen || !isMobile ? "var(--space-m)" : 0,
        }}>
          {(sidebarOpen || !isMobile) && (
            <>
              <h3 style={{ marginBottom: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Путь проекта</h3>
              {stages.map((s) => {
                const done = s.decisions.filter(d => completed.has(d.id)).length;
                return (
                  <div key={s.slug} onClick={() => { setActiveStage(s.slug); if (isMobile) setSidebarOpen(false); }} style={{
                    padding: "var(--space-s)", borderRadius: "var(--radius-m)", marginBottom: 4, cursor: "pointer",
                    background: activeStage === s.slug ? "var(--color-accent-light)" : "transparent",
                    border: activeStage === s.slug ? "1px solid var(--color-accent)" : "1px solid transparent",
                  }}>
                    <div style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>{s.title}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{done}/{s.decisions.length}</div>
                  </div>
                );
              })}
              <div style={{ marginTop: "var(--space-m)", padding: "var(--space-s)", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)" }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: 4 }}>Прогресс</div>
                <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
                  <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2 }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  <span>{totalDone}/{blueprint.totalDecisions}</span><span>{progress}%</span>
                </div>
              </div>
            </>
          )}
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: isMobile ? "var(--space-m)" : "var(--space-xl)", maxWidth: 1100 }}>
          {/* Progress bar + stage title */}
          <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: "var(--space-m)" }}>
            <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2 }} />
          </div>

          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>{currentStage?.title}</h1>
          {currentStage?.description && <p style={{ color: "var(--color-text-secondary)", marginBottom: isMobile ? "var(--space-m)" : "var(--space-l)", fontSize: "var(--text-s)" }}>{currentStage?.description}</p>}

          {/* Decisions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {currentStage?.decisions.map((dec) => {
              const done = completed.has(dec.id);
              const expanded = expandedDec === dec.id;
              const curStep = activeStep[dec.id] || 1;
              const builtPrompt = buildPrompt(dec, blueprint);

              return (
                <div key={dec.id} className="card" style={{ opacity: done ? 0.6 : 1, padding: 0, overflow: "hidden" }}>
                  {/* Card header */}
                  <div onClick={() => toggle(dec.id)} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: isMobile ? "var(--space-m)" : "var(--space-m) var(--space-l)", cursor: "pointer" }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, border: done ? "2px solid var(--color-accent)" : "2px solid var(--color-border)", background: done ? "var(--color-accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700 }}>{done ? "✓" : ""}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-s)", textDecoration: done ? "line-through" : "none" }}>{dec.title}</div>
                      {!done && !isMobile && <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 2 }}>{dec.problem}</div>}
                    </div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", flexShrink: 0, fontWeight: 600 }}>+{dec.xpReward}</div>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedDec(expanded ? null : dec.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 8 }}>
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* Expanded content */}
                  {expanded && !done && (
                    <div style={{ borderTop: "1px solid var(--color-border-light)", padding: isMobile ? "var(--space-m)" : "var(--space-l)" }}>
                      {/* Step tabs */}
                      <div style={{ display: "flex", gap: 0, marginBottom: "var(--space-m)", borderBottom: "2px solid var(--color-border-light)", overflowX: "auto" }}>
                        {steps.map(s => (
                          <button key={s.key} onClick={() => setActiveStep({ ...activeStep, [dec.id]: s.key })}
                            style={{
                              display: "flex", alignItems: "center", gap: 4, padding: "8px 14px",
                              border: "none", background: "transparent", cursor: "pointer",
                              color: curStep === s.key ? "var(--color-accent)" : "var(--color-text-tertiary)",
                              borderBottom: curStep === s.key ? "2px solid var(--color-accent)" : "2px solid transparent",
                              fontWeight: curStep === s.key ? 700 : 500, fontSize: "var(--text-xs)",
                              marginBottom: -2, whiteSpace: "nowrap",
                            }}>
                            {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Step 1: ПОНЯТЬ */}
                      {curStep === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                          {dec.why && <div style={{ padding: "var(--space-m)", background: "var(--color-warning-light)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-warning)" }}>⚠️ Почему важно</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.why}</div>
                          </div>}
                          {dec.context && <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>🧠 Контекст</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.context}</div>
                          </div>}
                          {dec.mistakes && <div style={{ padding: "var(--space-m)", background: "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-error)" }}>❌ Ошибки новичков</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.mistakes}</div>
                          </div>}
                        </div>
                      )}

                      {/* Step 2: ВЫБРАТЬ */}
                      {curStep === 2 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                          <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-accent)" }}>✅ Рекомендация</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7 }}>{dec.recommended}</div>
                          </div>
                          {dec.content && <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>📋 Как сделать</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.content}</div>
                          </div>}
                          {dec.tradeoffs && <div style={{ padding: "var(--space-m)", background: "var(--color-warning-light)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-warning)" }}>⚖️ Компромиссы</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.tradeoffs}</div>
                          </div>}
                          {dec.constraints && <div style={{ padding: "var(--space-m)", background: "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-error)" }}>🛑 Ограничения</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.constraints}</div>
                          </div>}
                        </div>
                      )}

                      {/* Step 3: ПРОВЕРИТЬ */}
                      {curStep === 3 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                          {dec.validation && <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-accent)" }}>✅ Как проверить</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.validation}</div>
                          </div>}
                          {dec.iteration && <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>🔄 Как улучшить</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.iteration}</div>
                          </div>}
                          {builtPrompt && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)", flexWrap: "wrap", gap: 8 }}>
                                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>📋 Собранный промпт</div>
                                <button onClick={() => copyPrompt(dec)}
                                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)", background: "white", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
                                  <Copy size={14} /> {promptCopied === dec.id ? "Скопировано!" : "Копировать"}
                                </button>
                              </div>
                              <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 250, overflow: "auto", color: "var(--color-text-secondary)", background: "white", padding: "var(--space-s)", borderRadius: "var(--radius-s)" }}>
                                {builtPrompt}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
