"use client";

import { useState, useEffect, useRef } from "react";
import { HelpCircle, X } from "lucide-react";

interface Variable {
  name: string; label: string; description: string; example: string; category: string;
}

// Parse {{variable}} out of text and render with tooltips
export function RenderTemplate({ text, variables }: { text: string; variables: Variable[] }) {
  const varMap = new Map(variables.map(v => [v.name, v]));
  const parts = text.split(/(\{\{[a-zA-Z0-9_-]+\}\})/g);

  return (
    <span>
      {parts.map((part, i) => {
        const m = part.match(/^\{\{([a-zA-Z0-9_-]+)\}\}$/);
        if (m) {
          const v = varMap.get(m[1]);
          if (v) return <VarTooltip key={i} variable={v} />;
          return <span key={i} style={{ background: "var(--color-warning-light)", padding: "1px 4px", borderRadius: 3, fontSize: "inherit" }}>{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

function VarTooltip({ variable }: { variable: Variable }) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !tooltipRef.current || !triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current;

    // Position above the trigger, centered
    let left = rect.left + rect.width / 2 - 150; // 300px width / 2
    let top = rect.top - tooltip.offsetHeight - 12;

    // Fallback: show below if above goes off-screen
    if (top < 10) top = rect.bottom + 12;

    // Keep within viewport
    if (left < 10) left = 10;
    if (left + 300 > window.innerWidth - 10) left = window.innerWidth - 310;

    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
    tooltip.style.position = "fixed";
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node) &&
          triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <span style={{ position: "relative", display: "inline" }}>
      <span ref={triggerRef} onClick={() => setOpen(!open)}
        style={{
          display: "inline-block", background: "var(--color-accent-light)", color: "var(--color-accent)",
          padding: "1px 6px", borderRadius: 4, cursor: "pointer", fontWeight: 600, fontSize: "inherit",
          border: "1px solid var(--color-accent)", transition: "0.15s",
        }}>
        {"{{" + variable.name + "}}"}
      </span>
      {open && (
        <div ref={tooltipRef}
          style={{
            position: "fixed", zIndex: 99999,
            width: 300, background: "white", borderRadius: "var(--radius-m)",
            boxShadow: "0 12px 40px rgba(0,0,0,0.2)", border: "1px solid var(--color-border)",
            padding: "var(--space-m)",
          }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)" }}>{variable.label}</div>
            <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "var(--color-text-tertiary)" }}><X size={14} /></button>
          </div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: 6 }}>{variable.description}</div>
          {variable.example && (
            <div style={{ fontSize: 11, background: "var(--color-bg-secondary)", padding: "6px 8px", borderRadius: "var(--radius-s)", fontFamily: "var(--font-mono)", color: "var(--color-text-secondary)" }}>
              Пример: <span style={{ color: "var(--color-accent)" }}>{variable.example}</span>
            </div>
          )}
        </div>
      )}
    </span>
  );
}

// Variable legend/catalog for beginners
export function VariableLegend({ variables, category }: { variables: Variable[]; category?: string }) {
  const [open, setOpen] = useState(false);
  const categories = Array.from(new Set(variables.map(v => v.category)));

  return (
    <div style={{ marginTop: "var(--space-s)" }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
        borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)",
        background: "var(--color-bg-secondary)", cursor: "pointer",
        fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)",
      }}>
        <HelpCircle size={14} />
        Как пользоваться шаблонами?
      </button>

      {open && (
        <div style={{
          marginTop: "var(--space-s)", padding: "var(--space-m)",
          background: "white", borderRadius: "var(--radius-m)",
          border: "1px solid var(--color-border)", position: "relative", zIndex: 10,
        }}>
          <div style={{ marginBottom: "var(--space-m)" }}>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>📖 Что такое {"{{переменные}}"}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
              В каждом промпте есть места, отмеченные <span style={{ background: "var(--color-accent-light)", padding: "1px 6px", borderRadius: 4, fontWeight: 600, color: "var(--color-accent)" }}>{"{{вот так}}"}</span>.
              Это <b>переменные</b> — их нужно заменить на свои данные перед отправкой AI.
              <br /><br />
              Например, вместо <code style={{ background: "var(--color-bg-secondary)", padding: "1px 4px", borderRadius: 3 }}>{"{{project}}"}</code> подставьте название вашего проекта.
              <br /><br />
              <b>Как использовать:</b>
              <br />1. Выберите промпт под вашу задачу
              <br />2. Нажмите «📋 Копировать»
              <br />3. Вставьте в чат с AI
              <br />4. Замените все <code style={{ background: "var(--color-bg-secondary)", padding: "1px 4px", borderRadius: 3 }}>{"{{переменные}}"}</code> на свои данные
              <br />5. Отправьте
            </div>
          </div>

          {categories.map(cat => {
            const catVars = variables.filter(v => v.category === cat);
            if (catVars.length === 0) return null;
            return (
              <div key={cat} style={{ marginBottom: "var(--space-m)" }}>
                <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 6, letterSpacing: "0.05em" }}>{cat}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {catVars.map(v => (
                    <div key={v.name} style={{ display: "flex", gap: 8, alignItems: "baseline", fontSize: "var(--text-xs)" }}>
                      <code style={{ background: "var(--color-accent-light)", padding: "1px 6px", borderRadius: 4, fontWeight: 700, color: "var(--color-accent)", whiteSpace: "nowrap", flexShrink: 0, fontSize: 11 }}>{"{{" + v.name + "}}"}</code>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }}>{v.label}</div>
                        <div style={{ color: "var(--color-text-tertiary)" }}>{v.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
