"use client";

import { useState } from "react";

interface Decision {
  id: string; title: string; slug: string;
  problem: string; why: string; recommended: string; content: string;
  tradeoffs: string; whenNotUse: string; mistakes: string;
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

const ICON_MAP: Record<string, string> = {
  Wrench: "🔧", Palette: "🎨", Layout: "📐", Code: "💻", Rocket: "🚀",
  Search: "🔍", BarChart: "📊", Shield: "⚖️", Send: "✈️", Heart: "🔄",
  Globe: "🌐", Zap: "⚡",
};

export default function BlueprintPageClient({ blueprint }: { blueprint: Blueprint }) {
  const stages = blueprint.stages.map(bs => bs.stage);
  const [activeStage, setActiveStage] = useState(stages[0]?.slug || "");
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [expandedDec, setExpandedDec] = useState<string | null>(null);
  const [promptCopied, setPromptCopied] = useState<string | null>(null);

  const currentStage = stages.find(s => s.slug === activeStage) || stages[0];
  const totalDone = completed.size;
  const totalDecs = blueprint.totalDecisions;
  const progress = Math.round((totalDone / totalDecs) * 100);

  function toggle(id: string) {
    // Сохраняем в БД
    fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decisionId: id, status: completed.has(id) ? "pending" : "done" }) });
    setCompleted(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  }

  function copyPrompt(dec: Decision) {
    const prompt = dec.promptTemplate || `Помоги с задачей: ${dec.title}. Контекст: ${dec.problem}`;
    navigator.clipboard.writeText(prompt);
    setPromptCopied(dec.id);
    setTimeout(() => setPromptCopied(null), 2000);
  }

  return (
    <div style={{ fontFamily: "Inter, sans-serif", background: "#fafafa", color: "#222", minHeight: "100vh" }}>
      {/* Header */}
      <header style={{ height: 72, background: "white", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", borderBottom: "1px solid #ececec", position: "sticky", top: 0, zIndex: 100 }}>
        <a href="/" style={{ fontSize: 22, fontWeight: 800, textDecoration: "none", color: "#222" }}>
          Engineering <span style={{ color: "#0FB880" }}>Blueprint</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          <div style={{ textAlign: "right" }}>
            <strong>{blueprint.title}</strong><br />
            <small style={{ color: "#888" }}>{blueprint.totalXp} XP · {blueprint.totalDecisions} решений</small>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#e5e7eb" }} />
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{ width: 310, background: "white", borderRight: "1px solid #ececec", minHeight: "calc(100vh - 72px)", padding: 35 }}>
          <h3 style={{ marginBottom: 20, fontSize: 14, color: "#777", textTransform: "uppercase", letterSpacing: "0.08em" }}>Путь проекта</h3>
          {stages.map((s, i) => {
            const done = s.decisions.filter(d => completed.has(d.id)).length;
            return (
              <div key={s.slug} onClick={() => setActiveStage(s.slug)} style={{
                padding: 15, borderRadius: 14, marginBottom: 10, cursor: "pointer",
                background: activeStage === s.slug ? "#eef3ff" : "transparent",
                border: activeStage === s.slug ? "1px solid #d8e2ff" : "1px solid transparent", transition: ".2s",
              }}>
                <strong style={{ display: "block", marginBottom: 5, color: activeStage === s.slug ? "#0FB880" : "#222", fontSize: 14 }}>
                  {ICON_MAP[s.icon] || "📋"} {s.title}
                </strong>
                <small style={{ color: "#888" }}>{done}/{s.decisions.length} решений</small>
              </div>
            );
          })}
          <div style={{ marginTop: 30, padding: "16px", borderRadius: 14, background: "#f8f8f8" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Прогресс</strong>
            <div style={{ height: 6, background: "#ececec", borderRadius: 30, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: progress + "%", height: "100%", background: "#0FB880", borderRadius: 30, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#666" }}>{totalDone} из {totalDecs}</span>
              <span style={{ fontWeight: 700, color: "#0FB880" }}>{progress}%</span>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main style={{ flex: 1, padding: "60px", maxWidth: 1200 }}>
          <div style={{ height: 8, background: "#ececec", borderRadius: 30, overflow: "hidden", marginBottom: 20 }}>
            <div style={{ width: progress + "%", height: "100%", background: "#0FB880", borderRadius: 30, transition: "width 0.6s ease" }} />
          </div>

          <div style={{ display: "inline-block", padding: "8px 16px", borderRadius: 30, background: "#eef3ff", color: "#0FB880", fontSize: 13, marginBottom: 18 }}>
            {ICON_MAP[currentStage?.icon] || "📋"} {currentStage?.title}
          </div>

          <h1 style={{ fontSize: 44, marginBottom: 10, fontWeight: 800, lineHeight: 1.15 }}>{currentStage?.title}</h1>
          {currentStage?.description && (
            <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 900, color: "#555", marginBottom: 40 }}>{currentStage?.description}</p>
          )}

          {/* Decisions */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 35 }}>
            <div>
              <div style={{ background: "white", borderRadius: 22, padding: 35, border: "1px solid #ececec" }}>
                <h2 style={{ fontSize: 26, marginBottom: 20 }}>Что нужно сделать</h2>
                {currentStage?.decisions.map((dec, i) => {
                  const done = completed.has(dec.id);
                  const expanded = expandedDec === dec.id;
                  return (
                    <div key={dec.id} style={{ padding: "16px 0", borderBottom: i < currentStage.decisions.length - 1 ? "1px solid #f2f2f2" : "none" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer", opacity: done ? 0.5 : 1 }}
                        onClick={() => toggle(dec.id)}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2, border: done ? "2px solid #0FB880" : "2px solid #d1d5db", background: done ? "#0FB880" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 12, fontWeight: 700 }}>{done ? "✓" : ""}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, textDecoration: done ? "line-through" : "none" }}>{dec.title}</div>
                          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.5, marginBottom: 6 }}>{dec.problem}</div>
                          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
                            <span>+{dec.xpReward} XP</span>
                            <span>⏱ {dec.timeEstimate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Expand button */}
                      {!done && (
                        <div style={{ marginTop: 8, marginLeft: 38, display: "flex", gap: 8, flexWrap: "wrap" }}>
                          <button onClick={(e) => { e.stopPropagation(); setExpandedDec(expanded ? null : dec.id); }}
                            style={{ background: "none", border: "none", color: "#0FB880", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                            {expanded ? "Скрыть детали ▲" : "Подробнее ▼"}
                          </button>
                          {dec.promptTemplate && (
                            <button onClick={(e) => { e.stopPropagation(); copyPrompt(dec); }}
                              style={{ background: "none", border: "none", color: "#3b82f6", fontSize: 13, cursor: "pointer", fontWeight: 500 }}>
                              {promptCopied === dec.id ? "✅ Скопировано!" : "📋 Скопировать промпт"}
                            </button>
                          )}
                        </div>
                      )}

                      {/* Expanded details */}
                      {expanded && !done && (
                        <div style={{ marginTop: 12, marginLeft: 38, padding: "16px", background: "#f8f9fa", borderRadius: 14, border: "1px solid #ececec" }}>
                          {dec.why && (
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 4 }}>Почему это важно</div>
                              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{dec.why}</div>
                            </div>
                          )}
                          {dec.recommended && (
                            <div style={{ marginBottom: 10, padding: "12px", background: "#f0fdf6", borderRadius: 10, border: "1px solid #d1fae5" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#0FB880", marginBottom: 4 }}>✅ Рекомендуем</div>
                              <div style={{ fontSize: 13, color: "#333" }}>{dec.recommended}</div>
                            </div>
                          )}
                          {dec.content && (
                            <div style={{ marginBottom: 10 }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#333", marginBottom: 4 }}>Как сделать</div>
                              <div style={{ fontSize: 13, color: "#666", lineHeight: 1.6 }}>{dec.content}</div>
                            </div>
                          )}
                          {dec.tradeoffs && (
                            <div style={{ marginBottom: 10, padding: "12px", background: "#fff9ea", borderRadius: 10, border: "1px solid #ffe29a" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#b45309", marginBottom: 4 }}>⚖️ Компромиссы</div>
                              <div style={{ fontSize: 13, color: "#666" }}>{dec.tradeoffs}</div>
                            </div>
                          )}
                          {dec.mistakes && (
                            <div style={{ marginBottom: 10, padding: "12px", background: "#fef2f2", borderRadius: 10, border: "1px solid #fecaca" }}>
                              <div style={{ fontWeight: 600, fontSize: 13, color: "#dc2626", marginBottom: 4 }}>❌ Частые ошибки</div>
                              <div style={{ fontSize: 13, color: "#666" }}>{dec.mistakes}</div>
                            </div>
                          )}
                          {dec.whenNotUse && (
                            <div style={{ fontSize: 12, color: "#999", fontStyle: "italic" }}>ℹ️ Когда не применять: {dec.whenNotUse}</div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel */}
            <div>
              <div style={{ background: "white", padding: 28, borderRadius: 22, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 12 }}>📋 Промпты</h3>
                <p style={{ lineHeight: 1.7, color: "#666", fontSize: 15, marginBottom: 16 }}>
                  У каждого решения есть готовый промпт. Скопируйте и вставьте в ChatGPT/DeepSeek.
                </p>
              </div>

              <div style={{ background: "white", padding: 28, borderRadius: 22, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 12 }}>После этапа</h3>
                <div style={{ lineHeight: 2.2, color: "#444", fontSize: 15 }}>
                  {(currentStage?.decisions || []).slice(0, 3).map(d => (
                    <div key={d.id}>• {d.title}</div>
                  ))}
                </div>
              </div>

              {stages[stages.findIndex(s => s.slug === activeStage) + 1] && (
                <div onClick={() => setActiveStage(stages[stages.findIndex(s => s.slug === activeStage) + 1].slug)}
                  style={{ padding: 18, background: "#eef3ff", borderRadius: 14, cursor: "pointer" }}>
                  <strong style={{ display: "block", marginBottom: 4 }}>Следующий этап →</strong>
                  <span style={{ color: "#666", fontSize: 14 }}>{stages[stages.findIndex(s => s.slug === activeStage) + 1].title}</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
