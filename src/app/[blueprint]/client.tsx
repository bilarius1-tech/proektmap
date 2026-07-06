"use client";

import { useState } from "react";

interface Card {
  id: string; title: string; content: string;
  xpReward: number; timeEstimate: string; aiPrompt: string | null;
}
interface Stage {
  id: string; title: string; slug: string; icon: string; description: string | null;
  cards: Card[];
}
interface Blueprint {
  id: string; title: string; slug: string; description: string | null;
  icon: string; totalXp: number; totalCards: number;
  stages: Array<{ stage: Stage; sortOrder: number }>;
}

const ICON_MAP: Record<string, string> = {
  Compass: "🧭", FileText: "📄", Palette: "🎨", Layout: "📐",
  Code: "💻", Database: "🗄", Search: "🔍", Rocket: "🚀", Heart: "❤️",
  Globe: "🌐", Zap: "⚡",
};

export default function BlueprintPageClient({ blueprint }: { blueprint: Blueprint }) {
  const stages = blueprint.stages.map(bs => bs.stage);
  const [activeStage, setActiveStage] = useState(stages[0]?.slug || "");
  const [completedCards, setCompletedCards] = useState<Set<string>>(new Set());

  const currentStage = stages.find(s => s.slug === activeStage) || stages[0];
  const totalDone = completedCards.size;
  const totalCards = blueprint.totalCards;
  const progress = Math.round((totalDone / totalCards) * 100);

  function toggleCard(cardId: string) {
    setCompletedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId); else next.add(cardId);
      return next;
    });
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
            <small style={{ color: "#888" }}>{blueprint.totalXp} XP · {blueprint.totalCards} карточек</small>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#e5e7eb" }} />
        </div>
      </header>

      <div style={{ display: "flex" }}>
        {/* Sidebar */}
        <aside style={{ width: 310, background: "white", borderRight: "1px solid #ececec", minHeight: "calc(100vh - 72px)", padding: 35 }}>
          <h3 style={{ marginBottom: 20, fontSize: 14, color: "#777", textTransform: "uppercase", letterSpacing: "0.08em" }}>Путь проекта</h3>
          {stages.map((s, i) => {
            const stageCards = s.cards;
            const done = stageCards.filter(c => completedCards.has(c.id)).length;
            return (
              <div key={s.slug}
                onClick={() => setActiveStage(s.slug)}
                style={{
                  padding: 15, borderRadius: 14, marginBottom: 10, cursor: "pointer",
                  background: activeStage === s.slug ? "#eef3ff" : "transparent",
                  border: activeStage === s.slug ? "1px solid #d8e2ff" : "1px solid transparent",
                  transition: ".2s",
                }}>
                <strong style={{ display: "block", marginBottom: 5, color: activeStage === s.slug ? "#0FB880" : "#222", fontSize: 14 }}>
                  {ICON_MAP[s.icon] || "•"} {i + 1}. {s.title}
                </strong>
                <small style={{ color: "#888" }}>
                  {done}/{stageCards.length} выполнено
                </small>
              </div>
            );
          })}

          {/* Progress */}
          <div style={{ marginTop: 30, padding: "16px", borderRadius: 14, background: "#f8f8f8" }}>
            <strong style={{ display: "block", marginBottom: 8, fontSize: 13 }}>Прогресс</strong>
            <div style={{ height: 6, background: "#ececec", borderRadius: 30, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ width: progress + "%", height: "100%", background: "#0FB880", borderRadius: 30, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
              <span style={{ color: "#666" }}>{totalDone} из {totalCards}</span>
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
            {ICON_MAP[currentStage.icon] || "•"} {currentStage.title}
          </div>

          <h1 style={{ fontSize: 44, marginBottom: 10, fontWeight: 800, lineHeight: 1.15 }}>
            {currentStage.title}
          </h1>
          {currentStage.description && (
            <p style={{ fontSize: 18, lineHeight: 1.7, maxWidth: 900, color: "#555", marginBottom: 40 }}>
              {currentStage.description}
            </p>
          )}

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 35 }}>
            <div>
              <div style={{ background: "white", borderRadius: 22, padding: 35, border: "1px solid #ececec" }}>
                <h2 style={{ fontSize: 26, marginBottom: 20 }}>Что нужно сделать</h2>
                <div style={{ marginTop: 25 }}>
                  {currentStage.cards.map((card, i) => {
                    const done = completedCards.has(card.id);
                    return (
                      <div key={card.id}
                        onClick={() => toggleCard(card.id)}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 14,
                          padding: "16px 0", borderBottom: i < currentStage.cards.length - 1 ? "1px solid #f2f2f2" : "none",
                          cursor: "pointer", opacity: done ? 0.6 : 1,
                        }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: "50%", flexShrink: 0, marginTop: 2,
                          border: done ? "2px solid #0FB880" : "2px solid #d1d5db",
                          background: done ? "#0FB880" : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          color: "white", fontSize: 12, fontWeight: 700, transition: "all 0.2s",
                        }}>
                          {done ? "✓" : ""}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4, textDecoration: done ? "line-through" : "none" }}>
                            {card.title}
                          </div>
                          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.5, marginBottom: 6 }}>
                            {card.content}
                          </div>
                          <div style={{ display: "flex", gap: 16, fontSize: 12, color: "#999" }}>
                            <span>+{card.xpReward} XP</span>
                            <span>⏱ {card.timeEstimate}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right panel */}
            <div>
              <div style={{ background: "white", padding: 28, borderRadius: 22, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 12 }}>🤖 AI-консультант</h3>
                <p style={{ lineHeight: 1.7, color: "#666", fontSize: 15, marginBottom: 16 }}>
                  Не уверены что делать дальше? AI объяснит каждое решение.
                </p>
                <button style={{
                  display: "block", width: "100%", padding: 14, background: "#0FB880", color: "white",
                  border: "none", borderRadius: 14, fontSize: 15, fontWeight: 600, cursor: "pointer",
                }}>
                  Задать вопрос AI
                </button>
              </div>

              <div style={{ background: "white", padding: 28, borderRadius: 22, border: "1px solid #ececec", marginBottom: 20 }}>
                <h3 style={{ marginBottom: 12 }}>После этапа</h3>
                <div style={{ lineHeight: 2.2, color: "#444", fontSize: 15 }}>
                  {currentStage.cards.slice(0, 3).map(c => (
                    <div key={c.id}>• {c.title}</div>
                  ))}
                </div>
              </div>

              {/* Next stage */}
              {stages[stages.findIndex(s => s.slug === activeStage) + 1] && (
                <div
                  onClick={() => setActiveStage(stages[stages.findIndex(s => s.slug === activeStage) + 1].slug)}
                  style={{ padding: 18, background: "#eef3ff", borderRadius: 14, cursor: "pointer" }}>
                  <strong style={{ display: "block", marginBottom: 4 }}>Следующий этап →</strong>
                  <span style={{ color: "#666", fontSize: 14 }}>
                    {stages[stages.findIndex(s => s.slug === activeStage) + 1].title}
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
