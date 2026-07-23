"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, BookOpen, Package, Plug, MessageSquare, ArrowRight } from "lucide-react";

const TYPE_ICONS: Record<string, any> = { glossary: BookOpen, prompt: MessageSquare, pattern: Package, mcp: Plug };

export default function WhatsNewFeed() {
  const [feed, setFeed] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/activity").then(r => r.json()).then(d => setFeed(d.feed || [])).catch(() => {});
  }, []);

  if (!feed.length) return null;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 var(--space-m) var(--space-l)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Bell size={14} style={{ color: "var(--color-text-tertiary)" }} />
        <span style={{ fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Что нового
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {feed.slice(0, 4).map((item: any, i: number) => {
          const Icon = TYPE_ICONS[item.type] || BookOpen;
          return (
            <Link key={i} href={item.href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "8px 12px",
              background: "var(--color-bg-primary)", border: "1px solid var(--color-border-light)",
              borderRadius: 0, textDecoration: "none", color: "inherit", fontSize: "var(--text-xs)",
            }}>
              <Icon size={12} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
              <span style={{ fontWeight: 600, color: "var(--color-accent)", flex: 1 }}>{item.title}</span>
              <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
                {timeAgo(item.date)}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Сегодня";
  if (days === 1) return "Вчера";
  if (days < 7) return days + " дн.";
  return Math.floor(days / 7) + " нед.";
}
