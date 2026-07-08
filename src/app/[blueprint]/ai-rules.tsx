"use client";

import { useState } from "react";
import { ChevronDown, MessageSquare, Brain, Users, Star } from "lucide-react";

const rules = [
  {
    icon: <MessageSquare size={18} style={{ color: "var(--color-accent)" }} />,
    title: "ИИ — не поисковик",
    body: "Ты не вбиваешь запрос как в Google. Ты даёшь контекст: что за проект, какой стек, куда хочешь прийти. Чем точнее контекст — тем точнее ответ.",
  },
  {
    icon: <Brain size={18} style={{ color: "var(--color-accent)" }} />,
    title: "ИИ любит контекст",
    body: "Перед вопросом опиши: 1) проект, 2) стек, 3) что пробовал, 4) куда хочешь. Это экономит 3-4 раунда уточнений.",
  },
  {
    icon: <Users size={18} style={{ color: "var(--color-accent)" }} />,
    title: "ИИ — сотрудник, а не маг",
    body: "Относись как к джуну с энциклопедическими знаниями. Дай чёткое ТЗ → проверь результат → попроси исправить. Паттерн: Задача → Результат → Критика → Исправление.",
  },
  {
    icon: <Star size={18} style={{ color: "var(--color-accent)" }} />,
    title: "Разговаривайте как с экспертом",
    body: "Не «сделай сайт», а «создай лендинг стоматологии на Next.js: 4 блока, синий+белый, форма записи». AI понимает профессиональный язык.",
  },
];

export default function AIRules() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{
      padding: "var(--space-l)", background: "var(--color-accent-light)",
      borderRadius: "var(--radius-l)", border: "1px solid var(--color-accent)",
      marginBottom: "var(--space-l)",
    }}>
      <div style={{ fontWeight: 800, fontSize: "var(--text-m)", marginBottom: "var(--space-xs)", color: "var(--color-accent)" }}>
        🤖 Философия общения с AI
      </div>
      <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-m)" }}>
        Не промпт-инжиниринг — а AI-коммуникация. Модель не калькулятор. Это младший партнёр по проекту.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
        {rules.map((rule, i) => (
          <div key={i} style={{ background: "var(--color-bg-primary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
            <div onClick={() => setExpanded(expanded === i ? null : i)}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", cursor: "pointer" }}>
              <span style={{ flexShrink: 0 }}>{rule.icon}</span>
              <span style={{ fontWeight: 700, fontSize: "var(--text-s)", flex: 1 }}>{rule.title}</span>
              <ChevronDown size={14} style={{
                color: "var(--color-text-tertiary)", transition: "0.2s",
                transform: expanded === i ? "rotate(180deg)" : "",
                flexShrink: 0,
              }} />
            </div>
            {expanded === i && (
              <div style={{ padding: "0 var(--space-m) var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.7 }}>
                {rule.body}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
