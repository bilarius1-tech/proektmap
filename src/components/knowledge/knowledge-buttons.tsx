"use client";

import { useState, useEffect } from "react";
import { BookOpen, GraduationCap } from "lucide-react";
import { dispatchTogglePanel, dispatchToggleLearning } from "@/components/knowledge/knowledge-provider";
import { useSession } from "next-auth/react";

export default function KnowledgeButtons() {
  const { data: session } = useSession();
  const [learningOn, setLearningOn] = useState(false);

  useEffect(() => {
    function onLearning(e: Event) {
      const detail = (e as CustomEvent<{ on?: boolean }>).detail;
      if (typeof detail?.on === "boolean") setLearningOn(detail.on);
    }
    window.addEventListener("kp:learning-state", onLearning as EventListener);
    return () => window.removeEventListener("kp:learning-state", onLearning as EventListener);
  }, []);

  if (!session?.user) return null;

  function toggleLearning() {
    dispatchToggleLearning();
  }

  return (
    <>
      <button
        type="button"
        onClick={toggleLearning}
        title={
          learningOn
            ? "Выключить режим обучения — выделение текста больше не предлагает сохранить"
            : "Режим обучения: выделите текст на странице → сохранить в базу знаний"
        }
        aria-pressed={learningOn}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: learningOn ? "var(--color-accent-light)" : "transparent",
          border: learningOn ? "1px solid var(--color-accent)" : "1px solid transparent",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "var(--radius-s)",
          color: learningOn ? "var(--color-accent)" : "var(--color-text-secondary)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          fontFamily: "inherit",
          transition: "all 0.15s",
        }}
      >
        <GraduationCap size={15} />
        <span className="hide-mobile">Обучение</span>
      </button>

      <button
        type="button"
        onClick={() => dispatchTogglePanel()}
        title="Моя база знаний — сохранённые фрагменты текста"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 4,
          background: "transparent",
          border: "1px solid transparent",
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "var(--radius-s)",
          color: "var(--color-text-secondary)",
          fontSize: "var(--text-xs)",
          fontWeight: 600,
          fontFamily: "inherit",
          transition: "all 0.15s",
        }}
      >
        <BookOpen size={15} />
        <span className="hide-mobile">База знаний</span>
      </button>
    </>
  );
}
