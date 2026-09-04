import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowRight, ExternalLink, GraduationCap } from "lucide-react";

const ACADEMY_URL = "https://academy.claude.com/";

export type ClaudeAcademyCalloutProps = {
  /** Компактный вариант без лишнего воздуха */
  compact?: boolean;
  /** Внутренняя ссылка «следующий шаг» */
  secondaryHref?: string;
  secondaryLabel?: string;
  /** Доп. класс обёртки (для страниц с CSS-классами) */
  className?: string;
  style?: CSSProperties;
};

/**
 * Мост: Claude Academy (бесплатная школа грамотности) → ProektMap (полигон результата).
 * Внешняя ссылка только на официальный сайт Anthropic; в меню шапки не дублируем.
 */
export default function ClaudeAcademyCallout({
  compact = false,
  secondaryHref = "/resheniya",
  secondaryLabel = "К готовым решениям",
  className,
  style,
}: ClaudeAcademyCalloutProps) {
  return (
    <aside
      className={className}
      aria-label="Claude Academy и ProektMap"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: compact ? 12 : 16,
        padding: compact ? "14px 16px" : "var(--space-l)",
        background: "var(--color-bg-primary, #fff)",
        border: "1px solid var(--color-border, #e2e8f0)",
        borderLeft: "4px solid var(--color-accent, #0fb880)",
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
          background: "var(--color-accent-light, rgba(15, 184, 128, 0.12))",
          color: "var(--color-accent, #0fb880)",
          borderRadius: "var(--radius-s, 6px)",
        }}
        aria-hidden
      >
        <GraduationCap size={compact ? 18 : 20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "var(--color-accent, #0fb880)",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 4,
          }}
        >
          Грамотность → практика
        </div>
        <p
          style={{
            margin: 0,
            fontSize: compact ? "var(--text-xs, 13px)" : "var(--text-s, 14px)",
            lineHeight: 1.55,
            color: "var(--color-text-primary, #1a1a1a)",
          }}
        >
          <strong>Claude Academy</strong> — бесплатная официальная школа Anthropic: базовые
          принципы работы с AI (они полезны и за пределами Claude).{" "}
          <strong>ProektMap</strong> — следующий шаг: маршруты, микросервисы и проверка
          конкретного результата.
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
          <a
            href={ACADEMY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "var(--text-xs, 13px)",
              fontWeight: 700,
              color: "var(--color-accent, #0fb880)",
              textDecoration: "none",
            }}
          >
            Открыть Claude Academy
            <ExternalLink size={14} aria-hidden />
          </a>
          {secondaryHref && (
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
