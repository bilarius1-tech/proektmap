import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowRight, Cpu } from "lucide-react";

export type AgentEngineeringCalloutProps = {
  compact?: boolean;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
};

/**
 * Мост: Готовые решения ↔ трек «Инженерия агентов».
 * Лёгкий callout: сначала окружение агента, потом продукт.
 */
export default function AgentEngineeringCallout({
  compact = false,
  className,
  style,
  children,
}: AgentEngineeringCalloutProps) {
  return (
    <aside
      className={className}
      aria-label="Инженерия агентов"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: compact ? 12 : 16,
        padding: compact ? "14px 16px" : "var(--space-l)",
        background: "var(--color-bg-primary, #fff)",
        border: "1px solid var(--color-border, #e2e8f0)",
        borderLeft: "4px solid #0f766e",
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
          background: "rgba(15, 118, 110, 0.12)",
          color: "#0f766e",
          borderRadius: "var(--radius-s, 6px)",
        }}
        aria-hidden
      >
        <Cpu size={compact ? 18 : 20} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#0f766e",
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            marginBottom: 4,
          }}
        >
          Сначала окружение агента
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
              Маршрут продукта сильнее, когда у агента есть harness, loop и карта связей.
              Трек <strong>Инженерия агентов</strong> — отдельно от готовых решений: собираете
              машину работы, потом берёте миссию.
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
            href="/agent-engineering"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: "var(--text-xs, 13px)",
              fontWeight: 700,
              color: "#0f766e",
              textDecoration: "none",
            }}
          >
            Открыть трек Harness → Loop → Graph
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>
    </aside>
  );
}
