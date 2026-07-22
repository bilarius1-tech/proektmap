"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, MessageSquare, Package, Plug, ExternalLink } from "lucide-react";

interface RelatedData {
  terms: Array<{ term: string; slug: string; level: string }>;
  prompts: Array<{ title: string; slug: string; category: string }>;
  patterns: Array<{ title: string; slug: string; difficulty: string }>;
  mcp: Array<{ name: string; slug: string; category: string }>;
}

export default function RelatedSidebar({ type, slug }: { type: string; slug: string }) {
  const [data, setData] = useState<RelatedData | null>(null);

  useEffect(() => {
    fetch(`/api/graph/node?type=${type}&slug=${slug}`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
  }, [type, slug]);

  if (!data) return null;

  const hasContent = (data.terms?.length || 0) + (data.prompts?.length || 0) + (data.patterns?.length || 0) + (data.mcp?.length || 0) > 0;
  if (!hasContent) return null;

  return (
    <div style={{
      padding: "var(--space-l)", background: "var(--color-bg-primary)",
      border: "1px solid var(--color-border-light)", borderRadius: 0,
      alignSelf: "flex-start", position: "sticky", top: 72,
    }}>
      <div style={{
        fontSize: "var(--text-xs)", fontWeight: 800, color: "var(--color-text-tertiary)",
        textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-m)",
      }}>
        Связанные материалы
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
        {data.terms?.length > 0 && (
          <Section icon={<BookOpen size={12} />} label="Глоссарий" color="#ec4899">
            {data.terms.map(t => (
              <Link key={t.slug} href={`/glossary/${t.slug}`}
                style={linkStyle}>
                <span style={{ flex: 1 }}>{t.term}</span>
                <span style={{ fontSize: 12 }}>{t.level === "beginner" ? "🟢" : t.level === "intermediate" ? "🟡" : "🔴"}</span>
              </Link>
            ))}
          </Section>
        )}

        {data.prompts?.length > 0 && (
          <Section icon={<MessageSquare size={12} />} label="Промпты" color="#f59e0b">
            {data.prompts.map(p => (
              <Link key={p.slug} href={`/prompts`} style={linkStyle}>
                <span style={{ flex: 1 }}>{p.title}</span>
                <span style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>{p.category}</span>
              </Link>
            ))}
          </Section>
        )}

        {data.patterns?.length > 0 && (
          <Section icon={<Package size={12} />} label="Паттерны" color="#8b5cf6">
            {data.patterns.map(p => (
              <Link key={p.slug} href={`/patterns/${p.slug}`} style={linkStyle}>
                <span style={{ flex: 1 }}>{p.title}</span>
                <span style={{ fontSize: 12 }}>{p.difficulty === "beginner" ? "🟢" : p.difficulty === "intermediate" ? "🟡" : "🔴"}</span>
              </Link>
            ))}
          </Section>
        )}

        {data.mcp?.length > 0 && (
          <Section icon={<Plug size={12} />} label="MCP-серверы" color="#ef4444">
            {data.mcp.map(m => (
              <Link key={m.slug} href={`/mcp/${m.slug}`} style={linkStyle}>
                <span style={{ flex: 1 }}>{m.name}</span>
                <span style={{ fontSize: 9, color: "var(--color-text-tertiary)" }}>{m.category}</span>
              </Link>
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ icon, label, color, children }: any) {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6, color }}>
        {icon}
        <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>{children}</div>
    </div>
  );
}

const linkStyle: any = {
  display: "flex", alignItems: "center", gap: 6, padding: "4px 6px",
  fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", textDecoration: "none",
  borderRadius: 0, transition: "background 0.1s",
};
