"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Copy, Sparkles, Monitor, Terminal, Globe, Download, Cloud } from "lucide-react";

const STEP_META: Record<number, { icon: any; color: string; time: string }> = {
  1: { icon: Monitor, color: "#f59e0b", time: "5 мин" },
  2: { icon: Download, color: "#3b82f6", time: "15 мин" },
  3: { icon: Terminal, color: "#8b5cf6", time: "20 мин" },
  4: { icon: Cloud, color: "#22c55e", time: "10 мин" },
  5: { icon: Globe, color: "#ef4444", time: "15 мин" },
};

export default function BeginnerPathClient({ nodes }: any) {
  const [step, setStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("beginner-path");
      if (saved) {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step);
        if (data.completed) setCompleted(new Set(data.completed));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("beginner-path", JSON.stringify({ step, completed: [...completed] }));
  }, [step, completed]);

  const node = nodes[step];
  if (!node) {
    // All done
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40, textAlign: "center" }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 900, fontFamily: "var(--font-heading)", marginBottom: 8 }}>Ты прошёл весь путь!</h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 500, lineHeight: 1.7, marginBottom: 24 }}>
          От идеи до сайта в интернете. Теперь ты знаешь базовый цикл AI-разработки: установить → создать → запустить → сохранить → опубликовать.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => { setStep(0); setCompleted(new Set()); localStorage.removeItem("beginner-path"); }}
            style={{ padding: "12px 24px", borderRadius: 0, border: "1px solid var(--color-border)", background: "white", cursor: "pointer", fontWeight: 600 }}>
            Пройти заново
          </button>
          <Link href="/quest/services-site"
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0, background: "var(--color-accent)", color: "white", textDecoration: "none", fontWeight: 700 }}>
            Следующий уровень <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const options = JSON.parse(node.options || "[]");
  const meta = STEP_META[node.stage] || STEP_META[1];
  const Icon = meta.icon;
  const progress = Math.round(((step + 1) / nodes.length) * 100);
  const currentOption = options.find((o: any) => o.id === selectedOption);

  async function getAIHelp() {
    if (!node.aiPrompt) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt: node.aiPrompt, userMessage: currentOption?.consequence || "Помоги разобраться" }),
      });
      const data = await res.json();
      setAiResponse(data.reply || "");
    } catch { setAiResponse(""); }
    setAiLoading(false);
  }

  function handleNext() {
    setCompleted(prev => new Set([...prev, step]));
    setSelectedOption("");
    setAiResponse("");
    if (step < nodes.length - 1) setStep(prev => prev + 1);
  }

  function copyCommand(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)" }}>
      {/* Progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 50, height: 4, background: "var(--color-border-light)" }}>
        <div style={{ height: "100%", background: meta.color, width: `${progress}%`, transition: "width 0.4s" }} />
      </div>

      <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        {/* Step header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-l)" }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: meta.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, flexShrink: 0 }}>
            {step + 1}
          </div>
          <div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontWeight: 600 }}>
              Шаг {step + 1} из {nodes.length} · ~{meta.time}
            </div>
            <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 900, fontFamily: "var(--font-heading)", margin: "4px 0 0" }}>
              {node.title}
            </h2>
          </div>
        </div>

        {/* Description */}
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.7, marginBottom: "var(--space-l)" }}>
          {node.description}
        </p>

        {/* Context */}
        <div style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)", borderLeft: `4px solid ${meta.color}`, borderRadius: 0, marginBottom: "var(--space-l)" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
            {node.context}
          </div>
        </div>

        {/* Question */}
        <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: "var(--space-s)", color: "var(--color-text-primary)" }}>
          {node.question}
        </div>

        {/* Options */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-l)" }}>
          {options.map((opt: any) => {
            const isSelected = selectedOption === opt.id;
            return (
              <button key={opt.id}
                onClick={() => setSelectedOption(opt.id)}
                disabled={completed.has(step)}
                style={{
                  textAlign: "left", padding: "var(--space-m)", borderRadius: 0,
                  border: isSelected ? `2px solid ${meta.color}` : "1px solid var(--color-border-light)",
                  background: isSelected ? `${meta.color}10` : "var(--color-bg-primary)",
                  cursor: completed.has(step) ? "default" : "pointer",
                  opacity: completed.has(step) && !isSelected ? 0.5 : 1,
                  display: "flex", alignItems: "flex-start", gap: 10,
                }}>
                <div style={{ width: 24, height: 24, borderRadius: "50%", border: `2px solid ${isSelected ? meta.color : "var(--color-border)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  {isSelected && <Check size={14} style={{ color: meta.color }} />}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "var(--text-s)", marginBottom: 2 }}>{opt.text}</div>
                  {isSelected && (
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 4, lineHeight: 1.5 }}>
                      {opt.consequence}
                      {opt.helpText && (
                        <div style={{ marginTop: 8, padding: "var(--space-s)", background: "var(--color-bg-secondary)", fontSize: "var(--text-xs)", fontFamily: "monospace", whiteSpace: "pre-wrap", lineHeight: 1.6, border: "1px solid var(--color-border-light)" }}>
                          {opt.helpText}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {selectedOption && !aiResponse && (
            <button onClick={getAIHelp} disabled={aiLoading}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0, background: meta.color, color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "var(--text-s)" }}>
              <Sparkles size={16} /> {aiLoading ? "Думает..." : "Объясни подробнее"}
            </button>
          )}

          {(aiResponse || completed.has(step)) && (
            <>
              {aiResponse && (
                <div style={{ width: "100%", padding: "var(--space-m)", background: `${meta.color}10`, borderRadius: 0, border: `1px solid ${meta.color}30`, marginBottom: "var(--space-s)" }}>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiResponse}</div>
                </div>
              )}
              <button onClick={handleNext}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 700, fontSize: "var(--text-s)" }}>
                {step === nodes.length - 1 ? "Завершить" : "Дальше"} <ArrowRight size={16} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
