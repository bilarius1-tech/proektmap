"use client";

import { useState, useEffect } from "react";
import { Eye, CheckCircle, RefreshCw, Copy, ChevronDown, ChevronUp } from "lucide-react";

interface Decision {
  id: string; title: string; slug: string;
  problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; whenNotUse: string; mistakes: string;
  context: string; constraints: string; validation: string; iteration: string;
  xpReward: number; timeEstimate: string;
  promptTitle: string | null; promptTemplate: string | null;
}
interface Stage {
  id: string; title: string; slug: string; icon: string; description: string | null;
  decisions: Decision[];
}
interface Blueprint {
  id: string; title: string; slug: string; description: string | null;
  icon: string; totalXp: number; totalDecisions: number;
  stages: Array<{ stage: Stage; sortOrder: number }>;
}

function buildPrompt(dec: Decision, bp: Blueprint): string {
  const parts = [];
  
  // Контекст
  if (dec.context) parts.push(`## Контекст\n${dec.context}`);
  
  // Задача
  parts.push(`## Задача\n${dec.problem}`);
  
  // Почему важно
  if (dec.why) parts.push(`## Почему это важно\n${dec.why}`);
  
  // Ограничения
  if (dec.constraints) parts.push(`## Ограничения\n❌ НЕ делай:\n${dec.constraints}`);
  
  // Рекомендация
  if (dec.recommended) parts.push(`## Рекомендация\n${dec.recommended}`);
  
  // Проверка
  if (dec.validation) parts.push(`## Как проверить\n${dec.validation}`);
  
  // Итерация
  if (dec.iteration) parts.push(`## Как улучшить\n${dec.iteration}`);
  
  // Ошибки
  if (dec.mistakes) parts.push(`## Частые ошибки\n${dec.mistakes}`);
  
  // Проект
  parts.push(`---\nЯ прохожу Blueprint «${bp.title}» на ProektMap. Отвечай как AI-инженер: просто, без жаргона, только то что нужно на этом этапе.`);
  
  return parts.join("\n\n");
}

export default function BlueprintPageClient({ blueprint }: { blueprint: Blueprint }) {
  const stages = blueprint.stages.map(bs => bs.stage);
  const [activeStage, setActiveStage] = useState(stages[0]?.slug || "");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedDec, setExpandedDec] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<Record<string, number>>({});
  const [promptCopied, setPromptCopied] = useState<string | null>(null);
  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
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
  const totalDecs = blueprint.totalDecisions;
  const progress = Math.round((totalDone / totalDecs) * 100);

  const steps = [
    { key: 1, icon: <Eye size={14} />, label: "ПОНЯТЬ", desc: "Пойми проблему и контекст" },
    { key: 2, icon: <CheckCircle size={14} />, label: "ВЫБРАТЬ", desc: "Сравни варианты и выбери" },
    { key: 3, icon: <RefreshCw size={14} />, label: "ПРОВЕРИТЬ", desc: "Убедись что всё правильно" },
  ];

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100vh" }}>
      <header style={{ height: 72, background: "var(--color-bg-primary)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid var(--color-border-light)", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: "none", color: "inherit" }}>
          Proekt<span style={{ color: "var(--color-accent)" }}>Map</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
          <span style={{ fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-accent)" }}>{totalXp} XP</span>
          <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--color-bg-tertiary)" }} />
        </div>
      </header>

      <div style={{ display: "flex" }}>
        <aside style={{ width: 280, background: "var(--color-bg-primary)", borderRight: "1px solid var(--color-border-light)", minHeight: "calc(100vh - 72px)", padding: "var(--space-l)" }}>
          <h3 style={{ marginBottom: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Путь проекта</h3>
          {stages.map((s) => {
            const done = s.decisions.filter(d => completed.has(d.id)).length;
            return (
              <div key={s.slug} onClick={() => setActiveStage(s.slug)} style={{
                padding: "var(--space-s)", borderRadius: "var(--radius-m)", marginBottom: "var(--space-xs)", cursor: "pointer",
                background: activeStage === s.slug ? "var(--color-accent-light)" : "transparent",
                border: activeStage === s.slug ? "1px solid var(--color-accent)" : "1px solid transparent", transition: ".2s",
              }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-s)", marginBottom: "var(--space-2xs)" }}>{s.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{done}/{s.decisions.length}</div>
              </div>
            );
          })}
          <div style={{ marginTop: "var(--space-l)", padding: "var(--space-m)", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)" }}>
            <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: "var(--space-xs)" }}>Прогресс</div>
            <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: "var(--space-xs)" }}>
              <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2 }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
              <span>{totalDone} / {totalDecs}</span><span>{progress}%</span>
            </div>
          </div>
        </aside>

        <main style={{ flex: 1, padding: "var(--space-xl)", maxWidth: 1100 }}>
          <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: "var(--space-l)" }}>
            <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2 }} />
          </div>

          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>{currentStage?.title}</h1>
          {currentStage?.description && <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)", fontSize: "var(--text-m)" }}>{currentStage?.description}</p>}

          {/* Decisions */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {currentStage?.decisions.map((dec) => {
              const done = completed.has(dec.id);
              const expanded = expandedDec === dec.id;
              const curStep = activeStep[dec.id] || 1;
              const builtPrompt = buildPrompt(dec, blueprint);

              return (
                <div key={dec.id} className="card" style={{ opacity: done ? 0.6 : 1, padding: 0, overflow: "hidden" }}>
                  {/* Header */}
                  <div onClick={() => toggle(dec.id)} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m) var(--space-l)", cursor: "pointer" }}>
                    <div style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, border: done ? "2px solid var(--color-accent)" : "2px solid var(--color-border)", background: done ? "var(--color-accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700 }}>{done ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: "var(--text-m)", textDecoration: done ? "line-through" : "none" }}>{dec.title}</div>
                      {!done && <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginTop: 2 }}>{dec.problem}</div>}
                    </div>
                    <div style={{ display: "flex", gap: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", flexShrink: 0 }}>
                      <span>+{dec.xpReward} XP</span>
                      <span>{dec.timeEstimate}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setExpandedDec(expanded ? null : dec.id); }}
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4 }}>
                      {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>

                  {/* 3-step methodology */}
                  {expanded && !done && (
                    <div style={{ borderTop: "1px solid var(--color-border-light)", padding: "var(--space-l)" }}>
                      {/* Step tabs */}
                      <div style={{ display: "flex", gap: 2, marginBottom: "var(--space-l)", borderBottom: "2px solid var(--color-border-light)" }}>
                        {steps.map(s => (
                          <button key={s.key} onClick={() => setActiveStep({ ...activeStep, [dec.id]: s.key })}
                            style={{
                              display: "flex", alignItems: "center", gap: "var(--space-xs)", padding: "var(--space-s) var(--space-m)",
                              border: "none", background: "transparent", cursor: "pointer",
                              color: curStep === s.key ? "var(--color-accent)" : "var(--color-text-tertiary)",
                              borderBottom: curStep === s.key ? "2px solid var(--color-accent)" : "2px solid transparent",
                              fontWeight: curStep === s.key ? 700 : 500, fontSize: "var(--text-xs)",
                              marginBottom: -2, transition: "all var(--transition-fast)",
                            }}>
                            {s.icon} {s.label}
                          </button>
                        ))}
                      </div>

                      {/* Step 1: ПОНЯТЬ */}
                      {curStep === 1 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                          {dec.why && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-warning-light)", borderRadius: "var(--radius-m)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)", color: "var(--color-warning)" }}>⚠️ Почему это важно</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.why}</div>
                            </div>
                          )}
                          {dec.context && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)" }}>🧠 Контекст</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.context}</div>
                            </div>
                          )}
                          {dec.mistakes && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)", color: "var(--color-error)" }}>❌ Типичные ошибки новичков</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.mistakes}</div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Step 2: ВЫБРАТЬ */}
                      {curStep === 2 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                          <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)" }}>
                            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)", color: "var(--color-accent)" }}>✅ Рекомендуемое решение</div>
                            <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7 }}>{dec.recommended}</div>
                          </div>
                          {dec.content && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)" }}>📋 Как сделать</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.content}</div>
                            </div>
                          )}
                          {dec.tradeoffs && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-warning-light)", borderRadius: "var(--radius-m)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)", color: "var(--color-warning)" }}>⚖️ Компромиссы</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.tradeoffs}</div>
                            </div>
                          )}
                          {dec.constraints && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)", color: "var(--color-error)" }}>🛑 Ограничения (что НЕ делать)</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.constraints}</div>
                            </div>
                          )}
                          {dec.whenNotUse && (
                            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontStyle: "italic" }}>ℹ️ Когда не применять: {dec.whenNotUse}</div>
                          )}
                        </div>
                      )}

                      {/* Step 3: ПРОВЕРИТЬ */}
                      {curStep === 3 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                          {dec.validation && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)", color: "var(--color-accent)" }}>✅ Как проверить что всё правильно</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.validation}</div>
                            </div>
                          )}
                          {dec.iteration && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
                              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-xs)" }}>🔄 Как улучшить результат</div>
                              <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.iteration}</div>
                            </div>
                          )}
                          
                          {/* Assembled prompt */}
                          {builtPrompt && (
                            <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)", marginTop: "var(--space-s)" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-s)" }}>
                                <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>📋 Собранный промпт</div>
                                <button onClick={() => copyPrompt(dec)}
                                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)", background: "white", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
                                  <Copy size={12} /> {promptCopied === dec.id ? "Скопировано!" : "Копировать"}
                                </button>
                              </div>
                              <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 300, overflow: "auto", color: "var(--color-text-secondary)", background: "white", padding: "var(--space-s)", borderRadius: "var(--radius-s)" }}>
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
