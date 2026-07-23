"use client";

import Link from "next/link";
import {
  Compass, Package, MessageSquare, Plug, Wrench, BookOpen,
  Newspaper, Search, Users, Network, Home, Settings,
  ArrowRight, ArrowDown, ExternalLink, Cpu, Train, Play
} from "lucide-react";

const FLOW = [
  {
    phase: "Вход",
    modules: [
      { id: "home", title: "Главная", href: "/", icon: Home, desc: "Поиск по всей экосистеме. Популярные запросы: MCP, RAG, Prisma. Быстрый старт через Demo-тур.", links: ["search", "demo"] },
      { id: "search", title: "Поиск", href: "/search", icon: Search, desc: "7 источников: глоссарий, паттерны, MCP, инструменты, блог, промпты, решения.", links: ["glossary", "patterns"] },
    ],
  },
  {
    phase: "Выбор",
    modules: [
      { id: "patterns", title: "Паттерны", href: "/patterns", icon: Package, desc: "7 готовых бизнес-схем. Стек, сущности, эволюция, стоимость запуска, типичные ошибки.", links: ["blueprint", "prompts", "mcp"] },
      { id: "architecture", title: "Карта метро", href: "/architecture", icon: Train, desc: "Визуальная схема 6 фаз разработки. От идеи до запуска — все этапы перед глазами.", links: ["blueprint", "patterns"] },
    ],
  },
  {
    phase: "Сборка",
    modules: [
      { id: "blueprint", title: "Конструктор", href: "/corporate-website", icon: Compass, desc: "21 этап, 35 решений. Админка первой, сущности до кода. AI-помощник на каждом шагу.", links: ["prompts", "mcp", "glossary"] },
    ],
  },
  {
    phase: "Инструменты",
    modules: [
      { id: "prompts", title: "Промпты", href: "/prompts", icon: MessageSquare, desc: "8 инженерных решений с RPG-статами. System + User Prompt. Совместимость с GPT, Claude, Gemini.", links: ["mcp", "patterns"] },
      { id: "mcp", title: "MCP-серверы", href: "/mcp", icon: Plug, desc: "34 сервера Model Context Protocol. Парсер GitHub, DeepSeek-перевод, cron-обновление.", links: ["ai-tools", "prompts"] },
      { id: "ai-tools", title: "AI-инструменты", href: "/ai-tools", icon: Wrench, desc: "31 инструмент: Cursor, Reasonix, Aider, DeepSeek Coder. Фильтр по РФ, VPN, цене. Закладки, модели, подбор.", links: ["mcp", "models"] },
      { id: "models", title: "Модели", href: "/models", icon: Cpu, desc: "Сравнение AI-моделей: GPT, Claude, Gemini, DeepSeek. Рекомендации под задачу.", links: ["ai-tools"] },
    ],
  },
  {
    phase: "Знания",
    modules: [
      { id: "glossary", title: "Глоссарий", href: "/glossary", icon: BookOpen, desc: "94 термина с уровнями сложности. Подсказки `<Term/>` по всему сайту — наведи и узнай.", links: ["patterns", "prompts"] },
      { id: "blog", title: "Блог", href: "/blog", icon: Newspaper, desc: "Авто-публикация из AI-источников. Статьи, новости, кейсы.", links: [] },
      { id: "specialists", title: "Специалисты", href: "/specialists", icon: Users, desc: "Профили вайбкодеров. Портфолио, рейтинг, бейджи достижений.", links: ["blog"] },
    ],
  },
];

const PHASE_COLORS: Record<string, string> = {
  "Вход": "#0fb880",
  "Выбор": "#8b5cf6",
  "Сборка": "#3b82f6",
  "Инструменты": "#f59e0b",
  "Знания": "#ec4899",
};

export default function SitemapClient() {
  return (
    <div style={{ background: "var(--color-bg-secondary)", minHeight: "100vh", fontFamily: "var(--font-body)" }}>
      {/* Hero */}
      <div style={{
        padding: "60px var(--space-m) 40px", textAlign: "center",
        background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border-light)",
      }}>
        <h1 style={{
          fontSize: "clamp(28px,5vw,44px)", fontWeight: 900, letterSpacing: "-0.02em",
          fontFamily: "var(--font-heading)", marginBottom: 8,
        }}>
          Карта экосистемы ProektMap
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
          14 модулей, 5 фаз — от идеи до запуска AI-продукта.
          Каждый модуль решает конкретную задачу на пути инженера.
        </p>
      </div>

      {/* Flow */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
        {FLOW.map((phase, phaseIndex) => (
          <div key={phase.phase} style={{ marginBottom: phaseIndex < FLOW.length - 1 ? "var(--space-l)" : 0 }}>
            {/* Phase header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: "var(--space-m)",
              paddingLeft: 4,
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 0,
                background: PHASE_COLORS[phase.phase],
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: 14,
              }}>
                {phaseIndex + 1}
              </div>
              <div>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: PHASE_COLORS[phase.phase], textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Фаза {phaseIndex + 1}
                </div>
                <div style={{ fontSize: "var(--text-l)", fontWeight: 800 }}>
                  {phase.phase}
                </div>
              </div>
            </div>

            {/* Module cards */}
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: "var(--space-s)", marginLeft: 44,
            }}>
              {phase.modules.map(mod => (
                <Link key={mod.id} href={mod.href}
                  style={{
                    display: "flex", flexDirection: "column", gap: "var(--space-s)",
                    padding: "var(--space-m)", background: "var(--color-bg-primary)",
                    borderRadius: 0, border: `1px solid var(--color-border-light)`,
                    borderLeft: `4px solid ${PHASE_COLORS[phase.phase]}`,
                    textDecoration: "none", color: "inherit",
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderLeftColor = PHASE_COLORS[phase.phase];
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Title row */}
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <mod.icon size={18} style={{ color: PHASE_COLORS[phase.phase], flexShrink: 0 }} />
                    <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{mod.title}</div>
                    <ExternalLink size={12} style={{ marginLeft: "auto", opacity: 0.2, flexShrink: 0 }} />
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>
                    {mod.desc}
                  </p>

                  {/* Connected modules */}
                  {mod.links.length > 0 && (
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 9, color: "var(--color-text-tertiary)", fontWeight: 600 }}>Связан с:</span>
                      {mod.links.map(linkId => {
                        // Find the linked module across all phases
                        let linkedMod = null;
                        for (const p of FLOW) {
                          const found = p.modules.find(m => m.id === linkId);
                          if (found) { linkedMod = found; break; }
                        }
                        if (!linkedMod) return null;
                        return (
                          <span key={linkId} style={{
                            padding: "1px 6px", borderRadius: "var(--radius-full)",
                            background: "var(--color-bg-secondary)",
                            fontSize: 9, color: "var(--color-text-secondary)",
                          }}>
                            {linkedMod.title}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </Link>
              ))}
            </div>

            {/* Arrow between phases */}
            {phaseIndex < FLOW.length - 1 && (
              <div style={{
                display: "flex", justifyContent: "center", padding: "var(--space-m) 0 var(--space-m) 44px",
                color: "var(--color-text-tertiary)",
              }}>
                <ArrowDown size={20} style={{ opacity: 0.3 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer summary */}
      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "var(--space-l) var(--space-m)",
        borderTop: "1px solid var(--color-border-light)", textAlign: "center",
      }}>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.8 }}>
          <strong>Путь пользователя:</strong> поиск идеи → выбор паттерна → сборка в Blueprint'е →
          копирование промптов → подключение MCP → запуск продукта.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: "var(--space-m)" }}>
          {FLOW.flatMap(p => p.modules).map(m => (
            <Link key={m.id} href={m.href}
              style={{ fontSize: 11, color: "var(--color-text-secondary)", textDecoration: "none", fontWeight: 600 }}>
              {m.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
