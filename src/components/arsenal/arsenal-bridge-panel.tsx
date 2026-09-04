import Link from "next/link";
import { ArrowRight, Wrench } from "lucide-react";
import { resolveBridge } from "@/lib/arsenal/resheniya-bridges";
import NeuroCatalogCallout from "@/components/arsenal/neuro-catalog-callout";

/**
 * Блок «инструменты из Нейро каталога» для обзора флагманского решения.
 * Данные — только из RESHENIYA_ARSENAL_BRIDGES (2–4 тула + стеки).
 */
export default function ArsenalBridgePanel({ solutionSlug }: { solutionSlug: string }) {
  const resolved = resolveBridge(solutionSlug);
  if (!resolved) {
    return (
      <NeuroCatalogCallout
        compact
        style={{ margin: "24px 0" }}
        secondaryHref="/resheniya"
        secondaryLabel="К готовым решениям"
      />
    );
  }

  const { bridge, stacks, tools } = resolved;
  const primaryStack = stacks[0];

  return (
    <section
      aria-labelledby={`arsenal-bridge-${solutionSlug}`}
      style={{ margin: "28px 0", display: "grid", gap: 14 }}
    >
      <NeuroCatalogCallout
        compact
        primaryHref={primaryStack ? `/arsenal/${primaryStack.slug}` : "/arsenal"}
        primaryLabel={primaryStack ? `Стек: ${primaryStack.title}` : "Открыть Нейро каталог"}
        secondaryHref="/arsenal"
        secondaryLabel="Все стеки"
      >
        <strong>Нейро каталог</strong> рядом с этим маршрутом: {bridge.why}
      </NeuroCatalogCallout>

      <div>
        <h2
          id={`arsenal-bridge-${solutionSlug}`}
          style={{
            margin: "0 0 10px",
            fontSize: 18,
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Wrench size={18} aria-hidden /> Инструменты из Нейро каталога
        </h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {tools.map((t) => (
            <Link
              key={t.slug}
              href={`/arsenal/tools/${t.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 12px",
                borderRadius: "var(--radius-m, 8px)",
                border: "1px solid var(--color-border, #e2e8f0)",
                background: "var(--color-surface, #fff)",
                textDecoration: "none",
                color: "inherit",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {t.categoryIcon} {t.name}
              <ArrowRight size={13} aria-hidden />
            </Link>
          ))}
        </div>
        {stacks.length > 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {stacks.slice(1).map((s) => (
              <Link
                key={s.slug}
                href={`/arsenal/${s.slug}`}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#0284c7",
                  textDecoration: "none",
                }}
              >
                {s.icon} {s.title} →
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
