import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Layers } from "lucide-react";

export type NeuroCatalogCalloutProps = {
  compact?: boolean;
  /** Основная CTA — обычно хаб каталога */
  primaryHref?: string;
  primaryLabel?: string;
  /** Вторичная внутренняя ссылка (стек или решение) */
  secondaryHref?: string;
  secondaryLabel?: string;
  className?: string;
  style?: CSSProperties;
  /** Короткий кастомный текст (иначе дефолт) */
  children?: ReactNode;
};

/**
 * Мост: Готовые решения (/resheniya) ↔ Нейро каталог (/arsenal).
 * Паттерн как ClaudeAcademyCallout — компактный aside без карточного шума.
 */
export default function NeuroCatalogCallout({
  compact = false,
  primaryHref = "/arsenal",
  primaryLabel = "Открыть Нейро каталог",
  secondaryHref,
  secondaryLabel,
  className,
  style,
  children,
}: NeuroCatalogCalloutProps) {
  return (
    <aside
      className={className}
      aria-label="Нейро каталог и готовые решения"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: compact ? 12 : 16,
        padding: compact ? "14px 16px" : "var(--space-l)",
        background: "var(--color-bg-primary, #fff)",
        border: "1px solid var(--color-border, #e2e8f0)",
        borderLeft: "4px solid #0ea5e9",
        color: "inherit",
        ...style,
      }}
    >
      <div
        style={{
          width: compact ? 36 : 42,
          height: compact ? 36 : 42,
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          background: "rgba(14, 165, 233, 0.12)",
          color: "#0284c7",
          borderRadius: "var(--radius-s, 6px)",
        }}
        aria-hidden
      >
        <Layers size={compact ? 18 : 20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#0284c7",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 4,
          }}
        >
          Инструменты под маршрут
        </div>
        <p
          style={{
            margin: 0,
            fontSize: compact ? "var(--text-xs, 13px)" : "var(--text-s, 14px)",
            lineHeight: 1.55,
            color: "var(--color-text-primary, #1a1a1a)",
          }}
        >
          {children ?? (
            <>
              <strong>Нейро каталог</strong> — стеки AI-инструментов под задачу (не свалка ссылок).
              Берите набор рядом с готовым решением: порядок, Definition of Done и типичная ошибка уже
              зафиксированы.
            </>
          )}
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            marginTop: compact ? 10 : 12,
            alignItems: "center",
          }}
        >
          <Link
            href={primaryHref}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "var(--text-xs, 13px)",
              fontWeight: 700,
              color: "#0284c7",
              textDecoration: "none",
            }}
          >
            {primaryLabel}
            <ArrowRight size={14} aria-hidden />
          </Link>
          {secondaryHref && secondaryLabel && (
            <Link
              href={secondaryHref}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: "var(--text-xs, 13px)",
                fontWeight: 700,
                color: "var(--color-text-secondary, #64748b)",
                textDecoration: "none",
              }}
            >
              {secondaryLabel}
              <ArrowRight size={14} aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </aside>
  );
}
