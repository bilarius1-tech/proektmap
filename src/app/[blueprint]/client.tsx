"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Eye, CheckCircle, Copy, ChevronDown, ChevronUp, Menu, X,
  Lock, LogIn, FolderOpen, Plus, Briefcase,
} from "lucide-react";

interface Decision {
  id: string; title: string; slug: string;
  problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; mistakes: string;
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
interface ProjectContext {
  id: string; name: string; description: string; domain: string;
  stack: string; niche: string; colors: string; goals: string;
  blueprintTitle: string;
}
interface MiniProject {
  id: string; name: string; progress: number; status: string;
}

function buildPrompt(dec: Decision, bp: Blueprint, ctx: string): string {
  const parts = [];
  if (ctx) parts.push("## Мой проект\n" + ctx);
  if (dec.context) parts.push("## Контекст\n" + dec.context);
  parts.push("## Задача\n" + dec.problem);
  if (dec.why) parts.push("## Почему это важно\n" + dec.why);
  if (dec.constraints) parts.push("## Ограничения\n" + dec.constraints);
  if (dec.recommended) parts.push("## Рекомендация\n" + dec.recommended);
  if (dec.validation) parts.push("## Как проверить\n" + dec.validation);
  if (dec.iteration) parts.push("## Как улучшить\n" + dec.iteration);
  if (dec.mistakes) parts.push("## Частые ошибки\n" + dec.mistakes);
  parts.push("Я прохожу Blueprint «" + bp.title + "» на Карте роста. Отвечай как AI-инженер.");
  return parts.join("\n\n");
}

export default function BlueprintPageClient({
  blueprint, isLoggedIn, isPro, projectContext, userProjects, userContext,
}: {
  blueprint: Blueprint; isLoggedIn: boolean; isPro: boolean;
  projectContext: ProjectContext | null; userProjects: MiniProject[]; userContext: string;
}) {
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
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [projectForm, setProjectForm] = useState({ name: "", niche: "", domain: "", stack: "Next.js", colors: "", description: "", goals: "" });
  const [creating, setCreating] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    if (!isLoggedIn) return;
    fetch("/api/progress").then(r => r.json()).then(d => {
      setCompleted(new Set(d.completed));
      setTotalXp(d.totalXp);
    });
  }, [isLoggedIn]);

  async function createProject() {
    setCreating(true);
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...projectForm, blueprintId: blueprint.id }),
    });
    if (res.ok) {
      const data = await res.json();
      router.push(`/${blueprint.slug}?project=${data.id}`);
      router.refresh();
    }
    setCreating(false);
    setShowProjectModal(false);
  }

  function toggle(id: string) {
    if (!isLoggedIn || !projectContext) return;
    const newStatus = completed.has(id) ? "pending" : "done";
    const next = new Set(completed);
    if (next.has(id)) next.delete(id); else next.add(id);
    setCompleted(next);
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decisionId: id, status: newStatus, projectId: projectContext.id }) })
      .then(r => r.json()).then(d => { if (d.xpGained) setTotalXp(x => x + d.xpGained); });
  }

  async function askAI(dec: Decision) {
    setAiLoading(true); setAiResponse("");
    try {
      const fullPrompt = buildPrompt(dec, blueprint, userContext) + "\n\nВопрос: " + aiMessage;
      const res = await fetch("/api/ai/ask", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: fullPrompt }) });
      const data = await res.json();
      if (res.status === 402) setAiResponse("⚠️ Требуется Pro подписка.");
      else if (data.error) setAiResponse("❌ " + data.error);
      else setAiResponse(data.response || "Нет ответа");
    } catch (e: any) { setAiResponse("❌ Ошибка: " + e.message); }
    setAiLoading(false);
  }

  function copyPrompt(dec: Decision) {
    navigator.clipboard.writeText(buildPrompt(dec, blueprint, userContext));
    setPromptCopied(dec.id);
    setTimeout(() => setPromptCopied(null), 2000);
  }

  const currentStage = stages.find(s => s.slug === activeStage) || stages[0];
  const totalDone = completed.size;
  const progress = Math.round((totalDone / blueprint.totalDecisions) * 100);
  const canTrack = isLoggedIn && !!projectContext;

  const steps = [
    { key: 1, label: "ПОНЯТЬ" },
    { key: 2, label: "ВЫБРАТЬ" },
    { key: 3, label: "ПРОВЕРИТЬ", locked: !isPro },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100dvh - 56px)" }}>
      {/* DESKTOP sidebar */}
      {!isMobile && (
        <aside style={{
          width: 260, minWidth: 260, background: "var(--color-bg-primary)",
          borderRight: "1px solid var(--color-border-light)",
          position: "sticky", top: 56, height: "calc(100dvh - 56px)", overflowY: "auto",
        }}>
          <SidebarContent
            stages={stages} activeStage={activeStage} setActiveStage={setActiveStage}
            completed={completed} progress={progress} totalDone={totalDone} totalDecs={blueprint.totalDecisions}
            projectContext={projectContext} userProjects={userProjects}
            blueprint={blueprint} onNewProject={() => setShowProjectModal(true)}
          />
        </aside>
      )}

      {/* MOBILE */}
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
                <SidebarContent
                  stages={stages} activeStage={activeStage} setActiveStage={(s: string) => { setActiveStage(s); setSidebarOpen(false); }}
                  completed={completed} progress={progress} totalDone={totalDone} totalDecs={blueprint.totalDecisions}
                  projectContext={projectContext} userProjects={userProjects}
                  blueprint={blueprint} onNewProject={() => setShowProjectModal(true)}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* Main content */}
      <main style={{ flex: 1, padding: isMobile ? "var(--space-m)" : "var(--space-xl)", maxWidth: 1100 }}>
        {/* Registration banner */}
        {!isLoggedIn && (
          <div style={{
            padding: "var(--space-m)", marginBottom: "var(--space-l)", borderRadius: "var(--radius-m)",
            background: "var(--color-accent-light)", border: "1px solid var(--color-accent)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ fontSize: "var(--text-s)", fontWeight: 600 }}>
              🔓 Просмотр. <span style={{ fontWeight: 400, color: "var(--color-text-secondary)" }}>Войдите, создайте проект и получите персонального AI-консультанта.</span>
            </div>
            <a href="/auth" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-m)",
              background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600,
            }}><LogIn size={14} /> Войти</a>
          </div>
        )}

        {/* Project required banner */}
        {isLoggedIn && !projectContext && (
          <div style={{
            padding: "var(--space-l)", marginBottom: "var(--space-l)", borderRadius: "var(--radius-l)",
            background: "var(--color-accent-light)", border: "2px dashed var(--color-accent)", textAlign: "center",
          }}>
            <Briefcase size={28} style={{ color: "var(--color-accent)", marginBottom: "var(--space-s)", opacity: 0.6 }} />
            <div style={{ fontWeight: 700, fontSize: "var(--text-m)", marginBottom: 4, color: "var(--color-accent)" }}>
              Создайте проект чтобы начать
            </div>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)", maxWidth: 400, margin: "0 auto var(--space-m)", lineHeight: 1.6 }}>
              Дайте проекту имя — и каждый этап будет адаптирован под него. Промпты заполнятся реальными данными: название, стек, цвета, ниша.
            </p>
            <button onClick={() => setShowProjectModal(true)} style={{
              display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: "var(--radius-m)",
              background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 700, cursor: "pointer",
            }}><Plus size={16} /> Создать проект</button>
          </div>
        )}

        {/* Upgrade banner */}
        {isLoggedIn && projectContext && !isPro && (
          <div style={{
            padding: "var(--space-m)", marginBottom: "var(--space-l)", borderRadius: "var(--radius-m)",
            background: "var(--color-warning-light)", border: "1px solid var(--color-warning)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-warning)" }}>
              ⚡ Pro отключён. <span style={{ fontWeight: 400, color: "var(--color-text-secondary)" }}>AI-консультант и персональные промпты недоступны.</span>
            </div>
            <a href="/dashboard/billing" style={{
              display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-m)",
              background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600,
            }}>Pro за 300 ₽/мес</a>
          </div>
        )}

        {/* Project header */}
        {projectContext && (
          <div style={{
            display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)",
            padding: "var(--space-s) var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)",
            border: "1px solid var(--color-border-light)", fontSize: "var(--text-xs)",
          }}>
            <FolderOpen size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
            <span style={{ fontWeight: 600 }}>{projectContext.name}</span>
            {projectContext.niche && <span style={{ color: "var(--color-text-tertiary)" }}>· {projectContext.niche}</span>}
            {projectContext.stack && <span style={{ color: "var(--color-text-tertiary)" }}>· {projectContext.stack}</span>}
          </div>
        )}

        <div style={{ height: 4, background: "var(--color-border)", borderRadius: 2, overflow: "hidden", marginBottom: "var(--space-m)" }}>
          <div style={{ width: progress + "%", height: "100%", background: "var(--color-accent)", borderRadius: 2, transition: "width 0.4s ease" }} />
        </div>

        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>{currentStage?.title}</h1>
        {currentStage?.description && (
          <p style={{ color: "var(--color-text-secondary)", marginBottom: isMobile ? "var(--space-m)" : "var(--space-l)", fontSize: "var(--text-s)" }}>
            {projectContext ? currentStage.description : currentStage.description}
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          {currentStage?.decisions.map((dec) => {
            const done = completed.has(dec.id);
            const expanded = expandedDec === dec.id;
            const curStep = activeStep[dec.id] || 1;
            const builtPrompt = buildPrompt(dec, blueprint, userContext);

            return (
              <div key={dec.id} style={{
                padding: 0, opacity: done ? 0.6 : 1,
                background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)",
              }}>
                <div onClick={() => { if (canTrack) toggle(dec.id); }} style={{
                  display: "flex", alignItems: "center", gap: "var(--space-s)", padding: isMobile ? "var(--space-m)" : "var(--space-m) var(--space-l)", cursor: canTrack ? "pointer" : "default",
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    border: done ? "2px solid var(--color-accent)" : "2px solid var(--color-border)",
                    background: done ? "var(--color-accent)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontSize: 11, fontWeight: 700,
                  }}>{done ? "✓" : ""}</div>
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
                        <button key={s.key} onClick={() => {
                          if (s.locked && !isPro) return;
                          setActiveStep({ ...activeStep, [dec.id]: s.key });
                        }}
                        style={{
                          padding: "8px 12px", border: "none", background: "transparent",
                          cursor: s.locked && !isPro ? "default" : "pointer",
                          color: curStep === s.key ? "var(--color-accent)" : "var(--color-text-tertiary)",
                          borderBottom: curStep === s.key ? "2px solid var(--color-accent)" : "2px solid transparent",
                          fontWeight: curStep === s.key ? 700 : 500, fontSize: "var(--text-xs)", marginBottom: -2, whiteSpace: "nowrap",
                          display: "flex", alignItems: "center", gap: 4,
                          opacity: s.locked && !isPro ? 0.4 : 1,
                        }}>
                          {s.locked && !isPro && <Lock size={10} />}
                          {s.label}
                        </button>
                      ))}
                    </div>

                    {curStep === 1 && <StepUnderstand dec={dec} />}
                    {curStep === 2 && <StepChoose dec={dec} />}
                    {curStep === 3 && (isPro
                      ? <StepVerify dec={dec} builtPrompt={builtPrompt} promptCopied={promptCopied} copyPrompt={copyPrompt} projectContext={projectContext} aiMessage={aiMessage} setAiMessage={setAiMessage} aiLoading={aiLoading} aiResponse={aiResponse} setAiResponse={setAiResponse} askAI={askAI} />
                      : <StepProRequired />
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Project creation modal */}
      {showProjectModal && <ProjectModal form={projectForm} setForm={setProjectForm} onSave={createProject} onCancel={() => setShowProjectModal(false)} saving={creating} />}
    </div>
  );
}

function SidebarContent({ stages, activeStage, setActiveStage, completed, progress, totalDone, totalDecs, projectContext, userProjects, blueprint, onNewProject }: any) {
  return (
    <div>
      {/* Project selector */}
      <div style={{ marginBottom: "var(--space-m)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
          <h3 style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Мой проект</h3>
          <button onClick={onNewProject} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-accent)", padding: 2 }}>
            <Plus size={14} />
          </button>
        </div>
        {projectContext ? (
          <div style={{ padding: "8px 10px", borderRadius: "var(--radius-s)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", fontSize: "var(--text-xs)" }}>
            <div style={{ fontWeight: 700, color: "var(--color-accent)", marginBottom: 2 }}>{projectContext.name}</div>
            {projectContext.niche && <div style={{ color: "var(--color-text-tertiary)", fontSize: 10 }}>{projectContext.niche} · {projectContext.stack}</div>}
          </div>
        ) : (
          <div style={{ padding: "8px 10px", borderRadius: "var(--radius-s)", background: "var(--color-bg-secondary)", border: "1px dashed var(--color-border)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textAlign: "center", cursor: "pointer" }} onClick={onNewProject}>
            <Plus size={12} style={{ display: "inline", marginRight: 4 }} />
            Создать проект
          </div>
        )}
        {userProjects?.length > 1 && (
          <div style={{ marginTop: 4, display: "flex", flexDirection: "column", gap: 2 }}>
            {userProjects.filter((p: any) => p.id !== projectContext?.id).map((p: any) => (
              <a key={p.id} href={`/${blueprint.slug}?project=${p.id}`}
                style={{ padding: "4px 10px", fontSize: 10, color: "var(--color-text-tertiary)", textDecoration: "none", borderRadius: "var(--radius-s)" }}>
                {p.name} ({p.progress}%)
              </a>
            ))}
          </div>
        )}
      </div>

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
              display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s",
            }}>
              <div style={{ fontWeight: isActive ? 700 : 500, fontSize: "var(--text-s)", color: isActive ? "var(--color-accent)" : "var(--color-text-primary)" }}>{s.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", flexShrink: 0, marginLeft: 8 }}>{done}/{s.decisions.length}</div>
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

function ProjectModal({ form, setForm, onSave, onCancel, saving }: any) {
  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200 }} onClick={onCancel} />
      <div style={{
        position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
        width: "90%", maxWidth: 480, background: "white", borderRadius: "var(--radius-xl)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", zIndex: 201, padding: "var(--space-xl)",
      }}>
        <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: 4 }}>Создать проект</h2>
        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>
          Эти данные будут подставлены во все промпты. Вы всегда сможете их изменить.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Название проекта *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="Сайт стоматологии ДентаЛюкс"
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Ниша</label>
              <input value={form.niche} onChange={e => setForm({ ...form, niche: e.target.value })}
                placeholder="Стоматология"
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Домен</label>
              <input value={form.domain} onChange={e => setForm({ ...form, domain: e.target.value })}
                placeholder="dentalux.ru"
                style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Стек</label>
            <input value={form.stack} onChange={e => setForm({ ...form, stack: e.target.value })}
              placeholder="Next.js + Tailwind + Prisma"
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Цвета (основной, акцентный)</label>
            <input value={form.colors} onChange={e => setForm({ ...form, colors: e.target.value })}
              placeholder="#1a73e8, #0567b3"
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Описание (что за проект)</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Корпоративный сайт с каталогом услуг, формой записи и блогом"
              rows={2} style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Цели (чего хотите достичь)</label>
            <input value={form.goals} onChange={e => setForm({ ...form, goals: e.target.value })}
              placeholder="Привлечь 50 клиентов/мес через сайт"
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: "var(--space-l)" }}>
          <button onClick={onSave} disabled={saving || !form.name}
            style={{
              flex: 1, padding: "12px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white",
              border: "none", fontSize: "var(--text-s)", fontWeight: 700, cursor: form.name ? "pointer" : "default",
              opacity: form.name ? 1 : 0.5,
            }}>
            {saving ? "Создание..." : "Создать проект"}
          </button>
          <button onClick={onCancel}
            style={{ padding: "12px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>
            Отмена
          </button>
        </div>
      </div>
    </>
  );
}

function StepUnderstand({ dec }: { dec: Decision }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
      {dec.problem && <div style={{ padding: "var(--space-m)", background: "var(--color-warning-light)", borderRadius: "var(--radius-m)" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-warning)" }}>⚠️ Проблема</div>
        <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7 }}>{dec.problem}</div>
      </div>}
      {dec.why && <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>Почему это важно</div>
        <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.why}</div>
      </div>}
      {dec.context && <div style={{ padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>🧠 Контекст</div>
        <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)", whiteSpace: "pre-wrap" }}>{dec.context}</div>
      </div>}
      {dec.mistakes && <div style={{ padding: "var(--space-m)", background: "var(--color-error-light)", borderRadius: "var(--radius-m)" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-error)" }}>❌ Частые ошибки</div>
        <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7 }}>{dec.mistakes}</div>
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
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, color: "var(--color-warning)" }}>⚖️ Что выбрать</div>
        <div style={{ fontSize: "var(--text-s)", lineHeight: 1.7, color: "var(--color-text-secondary)" }}>{dec.tradeoffs}</div>
      </div>}
    </div>
  );
}

function StepVerify({ dec, builtPrompt, promptCopied, copyPrompt, projectContext, aiMessage, setAiMessage, aiLoading, aiResponse, setAiResponse, askAI }: any) {
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
            <div>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>📋 Персональный промпт</div>
              {projectContext && <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>Данные подставлены из вашего проекта</div>}
            </div>
            <button onClick={() => copyPrompt(dec)}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)", background: "white", color: "var(--color-accent)", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
              <Copy size={14} /> {promptCopied === dec.id ? "Скопировано!" : "Копировать"}
            </button>
          </div>
          <div style={{ fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", whiteSpace: "pre-wrap", lineHeight: 1.6, maxHeight: 250, overflow: "auto", color: "var(--color-text-secondary)", background: "white", padding: "var(--space-s)", borderRadius: "var(--radius-s)" }}>
            {builtPrompt}

      <div style={{ padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)", marginTop: "var(--space-s)" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 8, color: "var(--color-accent)" }}>💬 Задайте вопрос AI</div>
        <div style={{ display: "flex", gap: 8 }}>
          <textarea
            value={aiMessage}
            onChange={e => setAiMessage(e.target.value)}
            placeholder="Уточните задачу или задайте вопрос AI-консультанту..."
            rows={3}
            style={{ flex: 1, padding: "10px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical", fontFamily: "inherit" }}
          />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8, alignItems: "center" }}>
          <button
            onClick={() => askAI(dec)}
            disabled={!aiMessage.trim() || aiLoading}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 18px", borderRadius: "var(--radius-m)", background: aiMessage.trim() ? "var(--color-accent)" : "var(--color-border)", color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: aiMessage.trim() ? "pointer" : "default" }}
          >
            {aiLoading ? "Думаю..." : "Спросить AI"}
          </button>
          {aiResponse && (
            <button onClick={() => setAiResponse("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>
              Очистить
            </button>
          )}
        </div>
        {aiResponse && (
          <div style={{ marginTop: "var(--space-s)", padding: "var(--space-m)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", fontSize: "var(--text-xs)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
            {aiResponse}
          </div>
        )}
      </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepProRequired() {
  return (
    <div style={{ padding: "var(--space-xl)", textAlign: "center", borderRadius: "var(--radius-m)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)" }}>
      <Lock size={32} style={{ color: "var(--color-accent)", marginBottom: "var(--space-m)", opacity: 0.5 }} />
      <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)", marginBottom: 8 }}>Доступно с Pro подпиской</div>
      <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)", lineHeight: 1.6, maxWidth: 360, margin: "0 auto var(--space-m)" }}>
        Персональные промпты с данными вашего проекта. AI-консультант который знает ваш стек, цвета и нишу.
      </p>
      <a href="/dashboard/billing" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 700 }}>
        <Lock size={14} /> Pro за 300 ₽/мес
      </a>
    </div>
  );
}
