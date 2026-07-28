"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ChevronRight, Minimize2, Maximize2, Target } from "lucide-react";

const STORAGE_KEY = "beginner-path-v5";
const DISMISS_KEY = "blueprint-bar-dismissed";

const STEP_TITLES: Record<number, string> = {
  1: "Инструменты", 2: "Первый сайт", 3: "Правки через AI",
  4: "GitHub", 5: "Сайт в интернете", 6: "Структура проекта",
  7: "Переменные", 8: "SEO и аналитика",
};

export default function BlueprintProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState<{ step: number; completed: number[] } | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(DISMISS_KEY);
    if (dismissed) { setDismissed(true); return; }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        if (data.step !== undefined) setProgress(data);
      }
    } catch {}
  }, [pathname]);

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(DISMISS_KEY, "1");
  }

  if (dismissed || pathname.startsWith("/quest/")) return null;

  if (!progress) {
    // Show CTA for users who haven't started
    const hasStarted = !!progress;
    if (hasStarted || dismissed) return null;

    return (
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
        background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border)",
        padding: minimized ? "4px 0" : "10px var(--space-l)",
        fontFamily: "var(--font-body)",
        transition: "padding 0.2s",
      }}>
        {minimized ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button onClick={() => setMinimized(false)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-accent)", padding: "2px 8px",
              display: "flex", alignItems: "center", gap: 4, fontSize: 10,
            }}>
              <Maximize2 size={12} /> Путь новичка
            </button>
          </div>
        ) : (
          <div style={{
            maxWidth: 900, margin: "0 auto",
            display: "flex", alignItems: "center", gap: "var(--space-m)",
            flexWrap: "wrap", justifyContent: "center",
          }}>
            <Target size={18} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
            <span style={{ fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-text-primary)" }}>
              Пройди 8 шагов — сделай сайт и опубликуй в интернет
            </span>
            <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>≈ 1 час</span>
            <div style={{ height: 4, flex: "0 0 120px", background: "var(--color-border-light)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", width: "0%", background: "var(--color-accent)", borderRadius: 99 }} />
            </div>
            <Link href="/quest/beginner" style={{
              padding: "6px 16px", borderRadius: "var(--radius-full)",
              background: "var(--color-accent)", color: "white", textDecoration: "none",
              fontSize: "var(--text-xs)", fontWeight: 700, whiteSpace: "nowrap",
              display: "flex", alignItems: "center", gap: 4,
            }}>
              Начать <ChevronRight size={14} />
            </Link>
            <button onClick={dismiss} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-text-tertiary)", padding: 4,
            }} title="Скрыть">
              <X size={14} />
            </button>
            <button onClick={() => setMinimized(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--color-text-tertiary)", padding: 4,
            }} title="Свернуть">
              <Minimize2 size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }

  // User has progress — show status bar
  const step = progress.step;
  const completed = progress.completed || [];
  const total = 8;
  const pct = Math.round((completed.length / total) * 100);
  const currentTitle = STEP_TITLES[step + 1] || "";

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999,
      background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border)",
      boxShadow: "0 -2px 12px rgba(0,0,0,0.04)",
      padding: minimized ? "4px 0" : "10px var(--space-l)",
      fontFamily: "var(--font-body)",
      transition: "padding 0.2s",
    }}>
      {minimized ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={() => setMinimized(false)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-accent)", padding: "2px 8px",
            display: "flex", alignItems: "center", gap: 6, fontSize: 11,
            fontWeight: 600,
          }}>
            <Maximize2 size={12} />
            🗺 Путь новичка: {completed.length}/{total} шагов
            <div style={{ width: 60, height: 3, background: "var(--color-border-light)", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ width: `${pct}%`, height: "100%", background: "var(--color-accent)", borderRadius: 99, transition: "width 0.4s" }} />
            </div>
          </button>
        </div>
      ) : (
        <div style={{
          maxWidth: 900, margin: "0 auto",
          display: "flex", alignItems: "center", gap: "var(--space-m)",
          flexWrap: "wrap", justifyContent: "center",
        }}>
          {/* Step indicator */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--color-accent-light)", padding: "4px 12px",
            borderRadius: "var(--radius-full)",
          }}>
            <Target size={16} style={{ color: "var(--color-accent)" }} />
            <span style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-accent)" }}>
              Шаг {step + 1} из {total}
            </span>
          </div>

          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", fontWeight: 500 }}>
            {currentTitle}
          </span>

          {/* Mini progress */}
          <div style={{ flex: "0 0 100px", height: 4, background: "var(--color-border-light)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              width: `${pct}%`, height: "100%", background: "var(--color-accent)",
              borderRadius: 99, transition: "width 0.4s",
            }} />
          </div>

          <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontWeight: 600 }}>
            {completed.length}/{total} 🏆
          </span>

          <Link href="/quest/beginner" style={{
            padding: "6px 16px", borderRadius: "var(--radius-full)",
            background: "var(--color-accent)", color: "white", textDecoration: "none",
            fontSize: "var(--text-xs)", fontWeight: 700, whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            Продолжить <ChevronRight size={14} />
          </Link>

          <button onClick={dismiss} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-text-tertiary)", padding: 4,
          }} title="Скрыть">
            <X size={14} />
          </button>
          <button onClick={() => setMinimized(true)} style={{
            background: "none", border: "none", cursor: "pointer",
            color: "var(--color-text-tertiary)", padding: 4,
          }} title="Свернуть">
            <Minimize2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
