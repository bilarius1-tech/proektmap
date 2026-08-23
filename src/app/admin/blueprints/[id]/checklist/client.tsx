"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Circle, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  hint: string;
  auto: boolean;
}

const CHECKLIST: ChecklistItem[] = [
  // Content (8)
  { id: "1", category: "Содержание", label: "Все 12 полей заполнены в каждом решении", hint: "problem, why, context, constraints, recommended, content, tradeoffs, whenNotUse, mistakes, validation, iteration, promptTemplate", auto: true },
  { id: "2", category: "Содержание", label: "Нет демо-заглушек и placeholder-текста", hint: "Проверьте: нет ли 'TODO', 'заглушка', 'текст рыба' в полях", auto: false },
  { id: "3", category: "Содержание", label: "Каждый промпт — рабочий и конкретный", hint: "Версии, имена файлов, структура. Не 'напиши код', а 'создай next.config.js с...'", auto: false },
  { id: "4", category: "Содержание", label: "Рекомендации конкретные с обоснованием", hint: "Не 'выбери хостинг', а 'Vercel, потому что SSR из коробки и бесплатный тариф'", auto: false },
  { id: "5", category: "Содержание", label: "Ошибки — реальные, из практики", hint: "Не выдуманные. Например: 'покупают домен у хостинга — привязка, сложно сменить'", auto: false },
  { id: "6", category: "Содержание", label: "Валидация — чек-лист с проверяемыми пунктами", hint: "Формат: [ ] пункт 1, [ ] пункт 2. Можно скопировать и проверить", auto: false },
  { id: "7", category: "Содержание", label: "Контекст учитывает тип проекта", hint: "Не универсальный шаблон, а конкретный проект (сайт, SaaS, бот)", auto: false },
  { id: "8", category: "Содержание", label: "Связи с другими решениями указаны явно", hint: "Поле context должно ссылаться на предыдущие решения: 'фреймворк: Next.js'", auto: false },

  // Structure (5)
  { id: "9", category: "Структура", label: "Стадии идут в логическом порядке", hint: "sortOrder последовательный: исследование → разработка → запуск", auto: true },
  { id: "10", category: "Структура", label: "Каждая стадия имеет 5-8 решений", hint: "Меньше 5 — поверхностно, больше 8 — перегруз", auto: true },
  { id: "11", category: "Структура", label: "Общее количество решений: 30-50", hint: "Достаточно для глубины, не перегружает пользователя", auto: true },
  { id: "12", category: "Структура", label: "XP распределён пропорционально сложности", hint: "Простые решения — 10-15 XP, сложные — 20-30 XP", auto: false },
  { id: "13", category: "Структура", label: "Порядок решений учитывает зависимости", hint: "framework перед hosting, database перед API", auto: false },

  // UX (7)
  { id: "14", category: "Пользовательский опыт", label: "Прогресс виден на каждом шаге", hint: "Шкала, XP, бриф — пользователь видит свой путь", auto: true },
  { id: "15", category: "Пользовательский опыт", label: "Каждое решение можно пропустить", hint: "Без блокировки следующих шагов (кнопка 'Пропустить')", auto: true },
  { id: "16", category: "Пользовательский опыт", label: "Бриф формируется по мере прохождения", hint: "ProjectDecision сохраняется → бриф растёт → виден в сайдбаре", auto: true },
  { id: "17", category: "Пользовательский опыт", label: "Навыки (SkillChips) привязаны к 80%+ решений", hint: "Каждое решение прокачивает навык. Цель: 80% решений имеют skill", auto: true },
  { id: "18", category: "Пользовательский опыт", label: "Термины глоссария связаны в текстах решений", hint: "{{Term|термин}} в текстах → ссылка на глоссарий", auto: false },
  { id: "19", category: "Пользовательский опыт", label: "Мобильная версия читаема и удобна", hint: "Проверьте на телефоне: текст не обрезан, кнопки нажимаются", auto: false },
  { id: "20", category: "Пользовательский опыт", label: "Время на решение указано", hint: "Поле timeEstimate заполнено (например: '10 мин')", auto: true },
];

export default function ChecklistClient({
  blueprint, stats, autoChecks, autoStats, decisionsCount,
}: {
  blueprint: { id: string; title: string; slug: string };
  stats: { totalDecisions: number; totalStages: number; avgDecisionsPerStage: number; totalXp: number; fieldsFilledAvg: number; promptsWithVersions: number; skillCoverage: number };
  autoChecks: Record<string, boolean>;
  autoStats: { passed: number; total: number };
  decisionsCount: number;
}) {
  const [manualChecks, setManualChecks] = useState<Record<string, boolean>>({});
  const [expandedCat, setExpandedCat] = useState<string | null>("Содержание");

  const categories = [...new Set(CHECKLIST.map(c => c.category))];

  function toggleManual(id: string) {
    setManualChecks(prev => ({ ...prev, [id]: !prev[id] }));
  }

  function isPassed(item: ChecklistItem): boolean {
    if (item.auto) return autoChecks[item.id] ?? false;
    return manualChecks[item.id] ?? false;
  }

  const totalPassed = CHECKLIST.filter(c => isPassed(c)).length;
  const totalItems = CHECKLIST.length;
  const pct = Math.round((totalPassed / totalItems) * 100);

  // Pass manual checks to localStorage (client-side only)
  function saveManual() {
    if (typeof window !== "undefined") {
      localStorage.setItem(`checklist-${blueprint.id}`, JSON.stringify(manualChecks));
    }
  }

  return (
    <div style={{ minHeight: "100dvh", background: "var(--color-bg-secondary)", paddingBottom: "var(--space-xxl)" }}>
      {/* Header */}
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "var(--space-m) var(--space-l)", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <Link href="/admin/blueprints" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: 4 }}>
            <ArrowLeft size={14} /> К Blueprint'ам
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: 0 }}>
              ✅ Чек-лист: {blueprint.title}
            </h1>

            {/* Score */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 18px", borderRadius: "var(--radius-full)",
              background: pct >= 80 ? "var(--color-accent-light)" : pct >= 50 ? "#fef3c7" : "var(--color-error-light)",
              border: `2px solid ${pct >= 80 ? "var(--color-accent)" : pct >= 50 ? "#f59e0b" : "var(--color-error)"}`,
            }}>
              <span style={{ fontSize: "var(--text-xl)", fontWeight: 900, color: pct >= 80 ? "var(--color-accent)" : pct >= 50 ? "#92400e" : "var(--color-error)" }}>
                {totalPassed}/{totalItems}
              </span>
              <div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700 }}>{pct}%</div>
                <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>
                  {pct >= 80 ? "Готов к публикации" : pct >= 50 ? "Требует доработки" : "Нужна серьёзная работа"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ maxWidth: 900, margin: "var(--space-l) auto 0", padding: "0 var(--space-m)" }}>
        <div style={{ display: "flex", gap: "var(--space-s)", flexWrap: "wrap", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>
          <span style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", background: "white", border: "1px solid var(--color-border)" }}>
            📊 {stats.totalDecisions} решений в {stats.totalStages} стадиях
          </span>
          <span style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", background: "white", border: "1px solid var(--color-border)" }}>
            📝 ~{stats.avgDecisionsPerStage} решений/стадию
          </span>
          <span style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", background: "white", border: "1px solid var(--color-border)" }}>
            ⭐ {stats.totalXp} XP всего
          </span>
          <span style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", background: "white", border: "1px solid var(--color-border)" }}>
            📋 {stats.fieldsFilledAvg}/12 полей в среднем
          </span>
          <span style={{ padding: "4px 10px", borderRadius: "var(--radius-s)", background: "white", border: "1px solid var(--color-border)" }}>
            🎯 {stats.skillCoverage}% навыков
          </span>
        </div>

        {/* Auto-check summary */}
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)", fontSize: "var(--text-xs)" }}>
          <strong style={{ color: "var(--color-accent)" }}>🤖 Автопроверка:</strong> {autoStats.passed}/{autoStats.total} критериев пройдено автоматически.
          Остальные {CHECKLIST.filter(c => !c.auto).length} — проверьте вручную и отметьте.
          <button onClick={saveManual} style={{ marginLeft: 12, padding: "2px 8px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-accent)", background: "white", color: "var(--color-accent)", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600 }}>
            💾 Сохранить ручные отметки
          </button>
        </div>
      </div>

      {/* Checklist */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 var(--space-m)", display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
        {categories.map(cat => {
          const items = CHECKLIST.filter(c => c.category === cat);
          const catPassed = items.filter(i => isPassed(i)).length;
          const isExpanded = expandedCat === cat;

          return (
            <div key={cat} style={{ background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
              <button
                onClick={() => setExpandedCat(isExpanded ? null : cat)}
                style={{
                  width: "100%", padding: "var(--space-m) var(--space-l)", display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: "none", border: "none", cursor: "pointer", fontSize: "var(--text-m)", fontWeight: 700,
                  borderBottom: isExpanded ? "1px solid var(--color-border-light)" : "none",
                }}>
                <span>{cat}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: "var(--text-xs)", color: catPassed === items.length ? "var(--color-accent)" : "var(--color-text-tertiary)", fontWeight: 600 }}>
                    {catPassed}/{items.length}
                  </span>
                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
              </button>

              {isExpanded && (
                <div style={{ padding: "var(--space-s) var(--space-l) var(--space-l)" }}>
                  {items.map(item => {
                    const passed = isPassed(item);
                    return (
                      <div key={item.id}
                        onClick={() => { if (!item.auto) toggleManual(item.id); }}
                        style={{
                          display: "flex", alignItems: "flex-start", gap: 10, padding: "var(--space-s) 0",
                          borderBottom: "1px solid var(--color-border-light)", cursor: item.auto ? "default" : "pointer",
                          opacity: passed ? 1 : 0.7,
                        }}>
                        {passed
                          ? <CheckCircle size={16} style={{ color: "var(--color-accent)", marginTop: 2, flexShrink: 0 }} />
                          : <Circle size={16} style={{ color: "var(--color-border)", marginTop: 2, flexShrink: 0 }} />}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: "var(--text-s)", fontWeight: passed ? 600 : 400, textDecoration: passed ? "none" : "none" }}>
                              {item.label}
                            </span>
                            {item.auto && (
                              <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 99, background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }}>АВТО</span>
                            )}
                          </div>
                          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: 2, lineHeight: 1.5 }}>
                            {item.hint}
                          </div>
                        </div>
                        {!item.auto && !passed && (
                          <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", whiteSpace: "nowrap", marginTop: 2 }}>Нажмите</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
