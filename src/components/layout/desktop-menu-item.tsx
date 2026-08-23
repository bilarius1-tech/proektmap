"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

interface MenuChild { id: string; label: string; href: string; icon?: string; emoji?: string; }
interface MenuItem { id: string; label: string; href: string; icon?: string; children?: MenuChild[]; }

// Icon mapping for child items
const CHILD_ICONS: Record<string, string> = {
  "Telegram Бот": "🤖",
  "AI без VPN": "🛡️",
  "Vibe Coding": "⚡",
  "Российский AI-стек": "🇷🇺",
  "Все Blueprints": "📋",
  "Корпоративный сайт": "🏢",
  "SaaS-продукт": "🚀",
  "Каталог + заказы": "🛒",
  "Разработка игры": "🎮",
  "Промты": "💬",
  "Паттерны": "📦",
  "MCP": "🔌",
  "AI": "🧠",
};

export default function DesktopMenuItem({ item }: { item: MenuItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timer = useRef<any>(null);

  const hasChildren = item.children && item.children.length > 0;

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  function onMouseEnter() {
    clearTimeout(timer.current);
    if (hasChildren) setOpen(true);
  }
  function onMouseLeave() {
    timer.current = setTimeout(() => setOpen(false), 200);
  }

  if (!hasChildren) {
    const linkClass =
      item.href === "/resheniya"
        ? "header-solutions-link"
        : item.href === "/avito"
          ? "header-avito-link"
          : item.href === "/sitemap"
            ? "header-sitemap-link"
            : "header-menu-link";

    return (
      <Link href={item.href || "#"} className={linkClass}>
        {item.label}
      </Link>
    );
  }

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{ position: "relative" }}
    >
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center", gap: 4,
          color: open ? "var(--color-accent)" : "var(--color-text-secondary)",
          fontSize: "var(--text-s)", textDecoration: "none",
          padding: "6px 12px", borderRadius: "var(--radius-s)", transition: "all 0.1s",
          background: open ? "var(--color-accent-light)" : "transparent",
          border: "none", cursor: "pointer", fontFamily: "inherit",
          whiteSpace: "nowrap",
        }}
      >
        {item.label}
        <ChevronDown size={14} style={{
          transform: open ? "rotate(180deg)" : "none",
          transition: "transform 0.2s",
        }} />
      </button>

      {/* Dropdown Panel */}
      {open && (
        <div
          onMouseEnter={() => clearTimeout(timer.current)}
          onMouseLeave={onMouseLeave}
          style={{
            position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
            marginTop: 8, zIndex: 200,
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-l)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
            padding: "var(--space-l)",
            minWidth: 420,
          }}
        >
          {/* Arrow */}
          <div style={{
            position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
            width: 12, height: 12, background: "var(--color-bg-primary)",
            borderLeft: "1px solid var(--color-border)", borderTop: "1px solid var(--color-border)",
            rotate: "45deg",
          }} />

          {/* Title */}
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            fontSize: 11, fontWeight: 700, textTransform: "uppercase",
            color: "var(--color-text-secondary)", letterSpacing: "0.05em",
            marginBottom: "var(--space-m)", paddingBottom: "var(--space-s)",
            borderBottom: "1px solid var(--color-border)",
          }}>
            <span>{item.label}</span>
            {item.href && item.href !== "#" && (
              <Link
                href={item.href}
                onClick={() => setOpen(false)}
                style={{
                  fontSize: 11, color: "var(--color-accent)", textDecoration: "none",
                  fontWeight: 600, textTransform: "none", letterSpacing: 0,
                }}
              >
                Все →
              </Link>
            )}
          </div>

          {/* Grid of children */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "var(--space-xs)",
          }}>
            {item.children!.map(child => (
              <Link
                key={child.id}
                href={child.href}
                onClick={() => setOpen(false)}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: "var(--radius-m)",
                  textDecoration: "none", color: "var(--color-text-primary)",
                  fontSize: "var(--text-s)", fontWeight: 500,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--color-accent-light)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                }}
              >
                <span style={{ fontSize: 20, flexShrink: 0 }}>
                  {child.emoji || CHILD_ICONS[child.label] || "📄"}
                </span>
                <span>{child.label}</span>
              </Link>
            ))}
          </div>

          {/* Bottom hint */}
          <div style={{
            marginTop: "var(--space-m)", paddingTop: "var(--space-s)",
            borderTop: "1px solid var(--color-border)",
            fontSize: 11, color: "var(--color-text-secondary)",
            textAlign: "center",
          }}>
            Больше инструментов и гайдов в разделе {item.label}
          </div>
        </div>
      )}
    </div>
  );
}
