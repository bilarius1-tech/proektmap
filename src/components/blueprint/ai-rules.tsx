"use client";

import { useState } from "react";
import { MessageSquare, Brain, Users, Sun, Moon, Star, Cpu, ThumbsUp } from "lucide-react";

const rules = [
  {
    icon: <MessageSquare size={18} />,
    title: "ИИ — не поисковик",
    bad: "Сделай сайт.",
    good: "Я делаю лендинг для производителя кирпича. Нужны заявки от дилеров. Вот конкуренты. Сначала структура.",
    why: "Модель не читает мысли. Чем конкретнее задача — тем точнее результат.",
  },
  {
    icon: <Brain size={18} />,
    title: "ИИ любит контекст",
    bad: "Напиши текст для сайта.",
    good: "Я владелец производства кирпича. Работаю по РФ. Клиенты — стройкомпании. Нужен сайт для заявок.",
    why: "Контекст = качество. Без контекста модель гадает.",
  },
  {
    icon: <Users size={18} />,
    title: "ИИ — сотрудник, а не маг",
    bad: "Почему он не сделал всё идеально с первого раза?",
    good: "Сначала черновик. Потом правки. Потом финальная версия.",
    why: "Даже senior-разработчик не пишет идеальный код за один проход.",
  },
  {
    icon: <Star size={18} />,
    title: "Разговаривайте как с экспертом",
    bad: "Напиши текст.",
    good: "Ты — лучший маркетолог с опытом 20 лет. Сначала задай мне вопросы о бизнесе.",
    why: "Роль задаёт качество. «Маркетолог» напишет лучше чем «помощник».",
  },
  {
    icon: <Sun size={18} />,
    title: "Открывайте день",
    bad: "Продолжи.",
    good: "Доброе утро. Сегодня: авторизация, Prisma, тест регистрации. Работай как Senior Full Stack.",
    why: "Утренний ритуал восстанавливает контекст. Экономит токены.",
  },
  {
    icon: <Moon size={18} />,
    title: "Закрывайте день",
    bad: "(просто закрыл чат)",
    good: "Подведи итоги: что сделали, какие решения приняли, что осталось. Составь план на завтра.",
    why: "Превращает AI в проектный журнал. Завтра не придётся начинать с нуля.",
  },
  {
    icon: <Cpu size={18} />,
    title: "У каждой модели — характер",
    bad: "Все модели одинаковые.",
    good: "GPT для агентов, Claude для архитектуры, DeepSeek когда бюджет ограничен.",
    why: "Выбор модели под задачу = экономия денег и времени.",
  },
  {
    icon: <ThumbsUp size={18} />,
    title: "Давайте обратную связь",
    bad: "Молодец.",
    good: "Структура стала лучше. Особенно блок преимуществ. Но первый экран слабый — добавь конкретики.",
    why: "Конкретная обратная связь лучше похвалы. Модель понимает ЧТО именно улучшить.",
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
          <div key={i} style={{
            background: "var(--color-bg-primary)", borderRadius: "var(--radius-m)",
            border: "1px solid var(--color-border-light)", overflow: "hidden",
          }}>
            <div onClick={() => setExpanded(expanded === i ? null : i)}
              style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", cursor: "pointer" }}>
              <span style={{ color: "var(--color-accent)", flexShrink: 0 }}>{rule.icon}</span>
              <span style={{ fontWeight: 700, fontSize: "var(--text-s)", flex: 1 }}>{rule.title}</span>
              <span style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>{expanded === i ? "▲" : "▼"}</span>
            </div>

            {expanded === i && (
              <div style={{ padding: "0 var(--space-m) var(--space-m) var(--space-l)", marginLeft: 28 }}>
                <div style={{ marginBottom: "var(--space-s)" }}>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-error)", marginBottom: 2 }}>❌ Плохо:</div>
                  <div style={{ fontSize: "var(--text-s)", color: "var(--color-error)", background: "var(--color-error-light)", padding: "var(--space-s)", borderRadius: "var(--radius-s)" }}>
                    «{rule.bad}»
                  </div>
                </div>
                <div style={{ marginBottom: "var(--space-s)" }}>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", marginBottom: 2 }}>✅ Хорошо:</div>
                  <div style={{ fontSize: "var(--text-s)", color: "var(--color-accent)", background: "var(--color-accent-light)", padding: "var(--space-s)", borderRadius: "var(--radius-s)" }}>
                    «{rule.good}»
                  </div>
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
                  💡 {rule.why}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
