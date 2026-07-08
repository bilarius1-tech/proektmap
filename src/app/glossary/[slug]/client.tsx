"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

const LEVELS: Record<string, string> = { survival: "Выживание", vibe: "Вайбкодинг", modern: "Современный AI", senior: "Старший", jargon: "Жаргон" };

export default function TermClient({ term, related }: any) {
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/glossary" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к глоссарию
      </Link>

      <div style={{ marginBottom: "var(--space-s)" }}>
        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600 }}>
          {LEVELS[term.level] || term.level}
        </span>
      </div>

      <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-m)", color: "var(--color-accent)" }}>{term.term}</h1>

      {term.simpleExplanation && (
        <div style={{ padding: "var(--space-l)", background: "var(--color-accent-light)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-accent)", marginBottom: "var(--space-l)", fontSize: "var(--text-l)", fontWeight: 600, lineHeight: 1.5 }}>
          💡 {term.simpleExplanation}
        </div>
      )}

      <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", marginBottom: "var(--space-m)" }}>
        <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Определение</div>
        <div style={{ fontSize: "var(--text-s)", lineHeight: 1.8 }}>{term.definition}</div>
      </div>

      {term.example && (
        <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", marginBottom: "var(--space-m)" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Пример</div>
          <div style={{ fontSize: "var(--text-s)", lineHeight: 1.8, fontStyle: "italic" }}>{term.example}</div>
        </div>
      )}

      {term.vibeUsage && (
        <div style={{ padding: "var(--space-l)", background: "var(--color-warning-light)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-warning)", marginBottom: "var(--space-l)" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-warning)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Как говорят вайбкодеры</div>
          <div style={{ fontSize: "var(--text-s)", lineHeight: 1.8 }}>«{term.vibeUsage}»</div>
        </div>
      )}

      {term.devSay && (
        <div style={{ padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", marginBottom: "var(--space-l)" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Как говорят разработчики</div>
          <div style={{ fontSize: "var(--text-s)", lineHeight: 1.8 }}>«{term.devSay}»</div>
        </div>
      )}

      {related.length > 0 && (
        <div style={{ padding: "var(--space-l)", background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)" }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-xs)", marginBottom: "var(--space-s)" }}>Связанные термины</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {related.map((r: any) => (
              <Link key={r.slug} href={`/glossary/${r.slug}`} style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", background: "var(--color-bg-secondary)", fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none" }}>
                {r.term}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
