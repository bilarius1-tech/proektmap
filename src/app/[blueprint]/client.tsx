"use client";

import { useState, useEffect } from "react";
import { Eye, CheckCircle, RefreshCw, Copy, ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import AIRadar from "./ai-radar";
import AIRules from "@/components/blueprint/ai-rules";
import VideoBlock from "@/components/blueprint/video-block";
import PromptsBlock from "@/components/blueprint/prompts-block";

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
interface Variable {
  name: string; label: string; description: string; example: string; category: string;
}

interface Prompt {
  id: string; title: string; category: string;
  description: string | null; content: string; tags: string;
  useCount: number;
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
  parts.push("---\nЯ прохожу Blueprint «" + bp.title + "» на ProektMap. Отвечай как AI-инженер.");
  return parts.join("\n\n");
}

export default function BlueprintPageClient({ blueprint, prompts, variables }: { blueprint: Blueprint; prompts: Prompt[]; variables: Variable[] }) {
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

  const steps = [{ key: 1, label: "ПОНЯТЬ" }, { key: 2, label: "ВЫБРАТЬ" }, { key: 3, label: "ПРОВЕРИТЬ" }];

  return (
    <div style={{ display: "flex", minHeight: "calc(100dvh - 56px)" }}>
      {/* DESKTOP sidebar */}
      {!isMobile && (
        <aside style={{
          width: 260, minWidth: 260, background: "var(--color-bg-primary)",
          borderRight: "1px solid var(--color-border-light)",
          position: "sticky", top: 56, height: "calc(100dvh - 56px)", overflowY: "auto",
        }}>
          <SidebarContent stages={stages} activeStage={activeStage} setActiveStage={setActiveStage}
            completed={completed} progress={progress} totalDone={totalDone} totalDecs={blueprint.totalDecisions}
            blueprint={blueprint} />
        </aside>
      )}

      {/* MOBILE: FAB + sliding panel */}
      {isMobile && (
        <>
          <button onClick={() => setSidebarOpen(true)} style={{
            position: "fixed", right: 16, bottom: 24, zIndex: 50,
            width: 48, height: 48, borderRadius: "50%",
            background: "var(--color-accent)", color: "white",
            border: "none", boxShadow: "0 4px 16px rgba(15,184,128,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}>
            <Menu size={22} />
          </button>

          {sidebarOpen && (
            <>
              <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 98 }} onClick={() => setSidebarOpen(false)} />
              <div style={{
                position: "fixed", top: 0, right: 0, bottom: 0, width: "85%", maxWidth: 320, zIndex: 99,
                background: "var(--color-bg-primary)", boxShadow: "var(--shadow-l)",
                padding: "var(--space-m)", overflowY: "auto",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>Путь проекта</div>
                  <button onClick={() => setSidebarOpen(false)} style={{ background: "none", border: "none", padding: 8, cursor: "pointer", color: "var(--color-text-tertiary)" }}>
                    <X size={20} />
                  </button>
                </div>
                <SidebarContent stages={stages} activeStage={activeStage} setActiveStage={(slug: string) => { setActiveStage(slug); setSidebarOpen(false); }}
                  completed={completed} progress={progress} totalDone={totalDone} totalDecs={blueprint.totalDecisions}
                  blueprint={blueprint} />
              </div>
            </>
          )}
        </>
      )}

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? "var(--space-m)" : "var(--space-xl)", maxWidth: 1100 }}>
        <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: "var(--space-m)" }}>
          <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>

        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>{currentStage?.title}</h1>
        {currentStage?.description && <p style={{ color: "var(--color-text-secondary)", marginBottom: isMobile ? "var(--space-m)" : "var(--space-l)", fontSize: "var(--text-s)" }}>{currentStage?.description}</p>}

        {activeStage === "ai-philosophy" && <AIRules />}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {currentStage?.decisions.map((dec) => {
            const done = completed.has(dec.id);
            const expanded = expandedDec === dec.id;
            const curStep = activeStep[dec.id] || 1;
            const builtPrompt = buildPrompt(dec, blueprint);

            return (
              <div key={dec.id} className="card" style={{ opacity: done ? 0.6 : 1, padding: 0, overflow: "hidden" }}>
                <div onClick={() => toggle(dec.id)} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: isMobile ? "var(--space-m)" : "var(--space-m) var(--space-l)", cursor: "pointer" }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, border: done ? "2px solid var(--color-accent)" : "2px solid var(--color-border)", background: done ? "var(--color-accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 11, fontWeight: 700 }}>{done ? "✓" : ""}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-s)", textDecoration: done ? "line-through" : "none" }}>{dec.title}</div>
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", flexShrink: 0, fontWeight: 600 }}>+{dec.xpReward}</div>
                  <button onClick={(e) => { e.stopPropagation(); setExpandedDec(expanded ? null : dec.id); }}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 8, minWidth: 36, minHeight: 36 }}>
                    {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {expanded && !done && (
                  <div style={{ borderTop: "1px solid var(--color-border-light)", padding: isMobile ? "var(--space-m)" : "var(--space-l)" }}>
                    <div style={{ display: "flex", gap: 0, marginBottom: "var(--space-m)", borderBottom: "2px solid var(--color-border-light)", overflowX: "auto" }}>
                      {steps.map(s => (
                        <button key={s.key} onClick={() => setActiveStep({ ...activeStep, [dec.id]: s.key })}
                          style={{ padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", color: curStep === s.key ? "var(--color-accent)" : "var(--color-text-tertiary)", borderBottom: curStep === s.key ? "2px solid var(--color-accent)" : "2px solid transparent", fontWeight: curStep === s.key ? 700 : 500, fontSize: "var(--text-xs)", marginBottom: -2, whiteSpace: "nowrap" }}>{s.label}</button>
                      ))}
                    </div>
                    {curStep === 1 && <StepUnderstand dec={dec} />}
                    {curStep === 2 && <StepChoose dec={dec} />}
                    {curStep === 3 && <StepVerify dec={dec} builtPrompt={builtPrompt} promptCopied={promptCopied} copyPrompt={copyPrompt} />}
                    <AIRadar />
      <PromptsBlock prompts={prompts || []} variables={variables || []} />
                    <VideoBlock videos={[]} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function SidebarContent({ stages, activeStage, setActiveStage, completed, progress, totalDone, totalDecs, blueprint }: any) {
  return (
    <div>
      <h3 style={{ marginBottom: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Путь проекта</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {stages.map((s: Stage) => {
          const done = s.decisions.filter((d: Decision) => completed.has(d.id)).length;
          const isActive = activeStage === s.slug;
          return (
            <div key={s.slug} onClick={() => setActiveStage(s.slug)} style={{
              padding: "10px 12px", borderRadius: "var(--radius-m)", cursor: "pointer",
              background: isActive ? "var(--color-accent-light)" : "transparent",
              border: isActive ? "1px solid var(--color-accent)" : "1px solid transparent",
              display: "flex", justifyContent: "space-between", alignItems: "center",
              transition: "background 0.15s",
            }}>
              <div style={{ fontWeight: isActive ? 700 : 500, fontSize: "var(--text-s)", color: isActive ? "var(--color-accent)" : "var(--color-text-primary)" }}>
                {s.title}
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", flexShrink: 0, marginLeft: 8 }}>
                {done}/{s.decisions.length}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: "var(--space-m)", padding: "var(--space-s)", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)" }}>
        <div style={{ fontWeight: 600, fontSize: "var(--text-xs)", marginBottom: 4 }}>Прогресс</div>
        <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: 4 }}>
          <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          <span>{totalDone}/{totalDecs}</span><span>{progress}%</span>
        </div>
      </div>
    </div>
  );
}

function StepUnderstand({ dec }: { dec: Decision }) {
  return (
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
  );
}

function StepChoose({ dec }: { dec: Decision }) {
  return (
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
  );
}

function StepVerify({ dec, builtPrompt, promptCopied, copyPrompt }: { dec: Decision; builtPrompt: string; promptCopied: string | null; copyPrompt: (d: Decision) => void }) {
  return (
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
  );
}
