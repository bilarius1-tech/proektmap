"use client";

import { CreditCard, ExternalLink } from "lucide-react";
import { PLATIPOMIRU } from "@/app/resheniya/platipomiru";

type Props = {
  compact?: boolean;
  className?: string;
};

/**
 * Блок входа на Плати по миру: одна публичная ссылка без ?code= в UI.
 */
export default function PlatipomiruCallout({ compact = false, className }: Props) {
  return (
    <aside
      className={className}
      aria-label="Оплата AI-агентов из России"
      style={{
        padding: compact ? "14px 16px" : "var(--space-l)",
        background: "linear-gradient(135deg, rgba(15,184,128,0.08) 0%, var(--color-bg-primary, #fff) 55%)",
        border: "1px solid var(--color-accent, #0fb880)",
        borderLeft: "4px solid var(--color-accent, #0fb880)",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center", marginBottom: compact ? 8 : 12 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px",
            background: "var(--color-accent, #0fb880)",
            color: "#fff",
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <CreditCard size={13} /> Шаг 1 · Из РФ
        </span>
      </div>

      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: compact ? "var(--text-s)" : "var(--text-m)", marginBottom: 6 }}>
        {PLATIPOMIRU.brand}: оплата Cursor и AI-агентов
      </div>
      <p
        style={{
          margin: "0 0 14px",
          fontSize: compact ? 13 : "var(--text-s)",
          lineHeight: 1.55,
          color: "var(--color-text-secondary)",
          maxWidth: 640,
        }}
      >
        {PLATIPOMIRU.tagline}. Воспользуйтесь сервисом по кнопке ниже — карта, СБП, затем Cursor через GitHub и оплата Pro.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
        <a
          href={PLATIPOMIRU.siteUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 16px",
            background: "var(--color-accent, #0fb880)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 13,
          }}
        >
          Воспользоваться Плати по миру <ExternalLink size={15} />
        </a>
      </div>
    </aside>
  );
}
