'use client';

import { useState, useEffect, useRef } from "react";
import { Sparkles, Cpu, ArrowRight, Terminal } from "lucide-react";

const DEMO_STEPS = [
  { text: "Создай лендинг для стоматологии...", delay: 800 },
  { text: "Анализирую задачу: лендинг, медицина, форма записи...", delay: 1500 },
  { text: "Выбираю стек: HTML + Tailwind + форма...", delay: 1200 },
  { text: "Генерирую структуру: hero, услуги, отзывы, контакты...", delay: 1800 },
  { text: "Готово! Смотри результат справа →", delay: 2000 },
];

const RESULT_BLOCKS = [
  { title: "Профессиональная улыбка", subtitle: "Стоматология «ДентАрт»", desc: "Запишитесь на бесплатную консультацию", color: "#0fb880", delay: 2500 },
  { title: "Наши услуги", subtitle: "Имплантация • Отбеливание • Брекеты", desc: "Более 5000 довольных пациентов", color: "#3b82f6", delay: 3500 },
  { title: "Запись на приём", subtitle: "Оставьте заявку", desc: "Имя: _______  Телефон: _______  [Записаться]", color: "#8b5cf6", delay: 4500 },
];

export default function DemoBlock() {
  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [visibleBlocks, setVisibleBlocks] = useState<number>(0);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const stepRef = useRef(0);

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    
    // Typing animation
    DEMO_STEPS.forEach((step, i) => {
      timers.push(setTimeout(() => { setVisibleSteps(i + 1); }, step.delay));
    });

    // Result blocks appear
    RESULT_BLOCKS.forEach((block, i) => {
      timers.push(setTimeout(() => { setVisibleBlocks(i + 1); }, block.delay));
    });

    // Loop restart
    timers.push(setTimeout(() => {
      setVisibleSteps(0);
      setVisibleBlocks(0);
    }, 8000));

    const loop = setInterval(() => {
      setVisibleSteps(0);
      setVisibleBlocks(0);
    }, 9000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, []);

  return (
    <section style={{
      background: "#0a0a0b", color: "#e0e0e0", padding: "var(--space-xl) var(--space-m)",
      fontFamily: "var(--font-body)", position: "relative", overflow: "hidden",
      borderTop: "1px solid #1a1a1f", borderBottom: "1px solid #1a1a1f",
    }}>
      {/* Grid background */}
      <div style={{ position: "absolute", inset: 0, opacity: 0.03, backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <h2 style={{
          fontSize: "var(--text-xl)", fontWeight: 900, fontFamily: "var(--font-heading)",
          textAlign: "center", marginBottom: "var(--space-xl)", letterSpacing: "-0.02em",
        }}>
          Prompt <span style={{ color: "var(--color-accent)" }}>Playground</span>
          <span style={{ display: "block", fontSize: "var(--text-s)", fontWeight: 400, color: "#666", marginTop: 8 }}>
            Пиши на русском — AI создаёт код. Без Cursor, без установки.
          </span>
        </h2>

        <div className="demo-split" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-xl)", maxWidth: 1000, margin: "0 auto" }}>
          {/* LEFT: AI thoughts */}
          <div style={{
            background: "#111116", border: "1px solid #1a1a1f", padding: "var(--space-l)",
            borderRadius: 0, fontFamily: "monospace", fontSize: "var(--text-xs)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-m)", paddingBottom: "var(--space-s)", borderBottom: "1px solid #1a1a1f" }}>
              <Terminal size={14} style={{ color: "var(--color-accent)" }} />
              <span style={{ color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 10 }}>AI-консоль</span>
            </div>
            {DEMO_STEPS.map((step, i) => (
              <div key={i} style={{
                marginBottom: 8, opacity: i < visibleSteps ? 1 : 0.2,
                transition: "opacity 0.3s", padding: "4px 0",
                borderLeft: i === visibleSteps - 1 ? "2px solid var(--color-accent)" : "2px solid transparent",
                paddingLeft: i === visibleSteps - 1 ? 12 : 14,
              }}>
                <span style={{ color: i < visibleSteps ? "#0fb880" : "#444", marginRight: 8 }}>▸</span>
                <span style={{ color: i < visibleSteps ? "#ddd" : "#444" }}>{step.text}</span>
              </div>
            ))}
            {/* Typing cursor */}
            <div style={{ marginTop: 4, height: 16, display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 8, height: 14, background: "var(--color-accent)", animation: "blink 1s step-end infinite" }} />
              <span style={{ color: "#555", fontSize: 10 }}>DeepSeek V3</span>
            </div>
          </div>

          {/* RIGHT: Generated preview */}
          <div style={{
            background: "#111116", border: "1px solid #1a1a1f", padding: "var(--space-l)",
            borderRadius: 0, minHeight: 350,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "var(--space-m)", paddingBottom: "var(--space-s)", borderBottom: "1px solid #1a1a1f" }}>
              <Cpu size={14} style={{ color: "#3b82f6" }} />
              <span style={{ color: "#888", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", fontSize: 10 }}>Результат</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              {RESULT_BLOCKS.map((block, i) => (
                <div key={i} style={{
                  padding: "var(--space-m)", background: "#0d0d12",
                  border: "1px solid #1a1a1f", borderLeft: "3px solid " + block.color,
                  borderRadius: 0, opacity: i < visibleBlocks ? 1 : 0,
                  transform: i < visibleBlocks ? "translateX(0)" : "translateX(20px)",
                  transition: "all 0.4s ease-out",
                }}>
                  <div style={{ fontSize: "var(--text-s)", fontWeight: 700, color: "#fff", fontFamily: "var(--font-heading)", marginBottom: 4 }}>
                    {block.title}
                  </div>
                  <div style={{ fontSize: "var(--text-xs)", color: "#888", marginBottom: 4 }}>{block.subtitle}</div>
                  <div style={{ fontSize: 10, color: "#555" }}>{block.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "var(--space-xl)" }}>
          <a href="/playground" style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "14px 32px",
            background: "var(--color-accent)", color: "#fff", textDecoration: "none",
            fontSize: "var(--text-s)", fontWeight: 700, fontFamily: "var(--font-heading)",
            borderRadius: 0, transition: "background 0.15s",
          }}>
            Попробовать <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
}
