"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Package, Compass, MessageSquare, Plug, Wrench, BookOpen, Cpu, Newspaper,
  Train, Search, Users, Play, Home, Settings, ArrowRight, ExternalLink, Sparkles, Network
} from "lucide-react";

const MODULES = [
  { id: "home", title: "Главная", href: "/", icon: Home, color: "#0fb880", desc: "Поиск + навигация", links: ["patterns","search","architecture"] },
  { id: "patterns", title: "Паттерны сборки", href: "/patterns", icon: Package, color: "#8b5cf6", desc: "7 бизнес-схем", links: ["blueprint","prompts","mcp"] },
  { id: "blueprint", title: "Blueprint", href: "/corporate-website", icon: Compass, color: "#3b82f6", desc: "21 этап, 35 решений", links: ["prompts","mcp","glossary"] },
  { id: "prompts", title: "Промпты", href: "/prompts", icon: MessageSquare, color: "#f59e0b", desc: "8 инженерных решений", links: ["mcp","patterns","glossary"] },
  { id: "mcp", title: "MCP-серверы", href: "/mcp", icon: Plug, color: "#ef4444", desc: "34 сервера", links: ["ai-tools","patterns","prompts"] },
  { id: "ai-tools", title: "AI-инструменты", href: "/ai-tools", icon: Wrench, color: "#22c55e", desc: "16 инструментов", links: ["mcp","models"] },
  { id: "glossary", title: "Глоссарий", href: "/glossary", icon: BookOpen, color: "#ec4899", desc: "94 термина + подсказки", links: ["patterns","prompts","mcp"] },
  { id: "models", title: "AI Модели", href: "/models", icon: Cpu, color: "#06b6d4", desc: "Сравнение моделей", links: ["ai-tools","prompts"] },
  { id: "blog", title: "Блог", href: "/blog", icon: Newspaper, color: "#f97316", desc: "Авто-публикация", links: ["specialists"] },
  { id: "architecture", title: "Карта метро", href: "/architecture", icon: Train, color: "#6366f1", desc: "6 линий разработки", links: ["blueprint","patterns"] },
  { id: "search", title: "Умный поиск", href: "/search", icon: Search, color: "#14b8a6", desc: "7 источников", links: ["home","glossary","patterns"] },
  { id: "specialists", title: "Специалисты", href: "/specialists", icon: Users, color: "#a855f7", desc: "Профили + рейтинг", links: ["blog"] },
  { id: "demo", title: "Demo-тур", href: "/corporate-website?demo=true", icon: Play, color: "#84cc16", desc: "Виртуальный тур", links: ["blueprint"] },
];

export default function SitemapClient() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const selectedModule = MODULES.find(m => m.id === selected);

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-secondary)" }}>
      {/* Hero */}
      <div style={{
        padding: "var(--space-xl) var(--space-m)", textAlign: "center",
        background: "linear-gradient(135deg, #0fb88010, #3b82f610, #8b5cf610)",
        borderBottom: "1px solid var(--color-border-light)",
      }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: "var(--space-s)" }}>
          <Network size={32} style={{ color: "var(--color-accent)" }} />
          <Sparkles size={24} style={{ color: "#f59e0b" }} />
        </div>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 900, fontFamily: "var(--font-heading)", letterSpacing: "-0.02em", marginBottom: "var(--space-s)" }}>
          🗺️ Карта экосистемы
        </h1>
        <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", maxWidth: 600, margin: "0 auto", lineHeight: 1.7 }}>
          14 модулей связаны в единую экосистему AI-инжиниринга.
          Каждый модуль самостоятелен, но вместе они создают полный путь от идеи до запуска.
        </p>
        <div style={{ marginTop: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          Наведи на узел — увидишь связи. Кликни — узнаешь подробности.
        </div>
      </div>

      {/* Graph */}
      <div style={{
        maxWidth: 1000, margin: "0 auto", padding: "var(--space-xl) var(--space-m)",
        position: "relative", minHeight: 600,
      }}>
        {/* Central hub */}
        <div style={{
          position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
          width: 100, height: 100, borderRadius: "50%",
          background: "var(--color-accent)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 40px rgba(15,184,128,0.3)",
          zIndex: 10, animation: "pulse 3s infinite",
        }}>
          <div style={{ textAlign: "center", color: "white", fontWeight: 800, fontSize: 11, lineHeight: 1.2 }}>
            PROEKT<br/>MAP
          </div>
        </div>

        {/* Module nodes arranged in a circle */}
        {MODULES.map((m, i) => {
          const angle = (i / MODULES.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 240;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const isHovered = hovered === m.id;
          const isSelected = selected === m.id;
          const hasLinks = hovered && m.links.includes(hovered);

          return (
            <div key={m.id}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setSelected(isSelected ? null : m.id)}
              style={{
                position: "absolute",
                left: `calc(50% + ${x}px)`,
                top: `calc(50% + ${y}px)`,
                transform: "translate(-50%, -50%)",
                transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                zIndex: isHovered || isSelected ? 20 : 5,
                cursor: "pointer",
              }}
            >
              {/* Glow ring */}
              {(isHovered || isSelected) && (
                <div style={{
                  position: "absolute", inset: -16, borderRadius: "50%",
                  background: `${m.color}20`, animation: "pulse 2s infinite",
                }} />
              )}

              {/* Node */}
              <Link href={m.href}
                onClick={e => e.stopPropagation()}
                style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  padding: isHovered ? "var(--space-m) var(--space-l)" : "var(--space-s) var(--space-m)",
                  background: isHovered ? m.color : "var(--color-bg-primary)",
                  borderRadius: 0, border: `2px solid ${m.color}`,
                  textDecoration: "none", color: isHovered ? "white" : m.color,
                  transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  boxShadow: isHovered ? `0 8px 24px ${m.color}40` : "none",
                  transform: isHovered ? "scale(1.1)" : "scale(1)",
                  minWidth: isHovered ? 140 : 80,
                }}
              >
                <m.icon size={isHovered ? 22 : 18} />
                <div style={{ fontWeight: 700, fontSize: isHovered ? "var(--text-xs)" : 10, textAlign: "center", lineHeight: 1.2 }}>
                  {m.title}
                </div>
                {isHovered && (
                  <div style={{ fontSize: 9, opacity: 0.8, textAlign: "center" }}>{m.desc}</div>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      {/* Selected module detail */}
      {selectedModule && (
        <div style={{
          maxWidth: 700, margin: "0 auto var(--space-xl)", padding: "var(--space-l)",
          background: "var(--color-bg-primary)", borderRadius: 0,
          border: `2px solid ${selectedModule.color}`,
          animation: "slideUp 0.3s ease",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <selectedModule.icon size={24} style={{ color: selectedModule.color }} />
              <div>
                <div style={{ fontWeight: 800, fontSize: "var(--text-l)" }}>{selectedModule.title}</div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)" }}>{selectedModule.desc}</div>
              </div>
            </div>
            <Link href={selectedModule.href} style={{
              padding: "8px 16px", borderRadius: 0, background: selectedModule.color, color: "white",
              textDecoration: "none", fontWeight: 700, fontSize: "var(--text-xs)",
            }}>
              Открыть <ArrowRight size={12} style={{ display: "inline", marginLeft: 4 }} />
            </Link>
          </div>

          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-s)" }}>
            Связан с:
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {selectedModule.links.map(linkId => {
              const linked = MODULES.find(m => m.id === linkId);
              if (!linked) return null;
              return (
                <span key={linkId}
                  onClick={() => setSelected(linkId)}
                  style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "4px 12px", borderRadius: "var(--radius-full)",
                    background: `${linked.color}15`, border: `1px solid ${linked.color}30`,
                    color: linked.color, fontSize: "var(--text-xs)", fontWeight: 600,
                    cursor: "pointer",
                  }}>
                  <linked.icon size={12} /> {linked.title}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-l)", textAlign: "center", borderTop: "1px solid var(--color-border-light)" }}>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 8 }}>
          💡 <strong>Как пользоваться:</strong> наведи на узел → увидишь описание. Кликни на узел → откроется страница.
          Кликни на соединённый модуль → переключишься на него.
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", fontSize: 10, color: "var(--color-text-tertiary)" }}>
          {MODULES.map(m => (
            <Link key={m.id} href={m.href} style={{ color: m.color, textDecoration: "none", fontWeight: 600 }}>
              {m.title}
            </Link>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.8; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
