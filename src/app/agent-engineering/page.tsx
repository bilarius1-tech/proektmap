import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  GitBranch,
  Layers,
  Network,
  RefreshCw,
  Shield,
} from "lucide-react";
import { MODULES, TRACK } from "@/lib/agent-engineering";
import ClaudeAcademyCallout from "@/components/academy/claude-academy-callout";
import NeuroCatalogCallout from "@/components/arsenal/neuro-catalog-callout";

export const metadata: Metadata = {
  title: "Инженерия агентов — Harness, Loop, Graph в Cursor | ProektMap",
  description:
    "Образовательный трек: harness engineering, agent loop и graph. Промпты — тонкий вход; ремесло — окружение агента. Для AI-инженеров и вайбкодеров.",
  alternates: {
    canonical: "https://proektmap.ru/agent-engineering",
  },
  openGraph: {
    title: "Инженерия агентов — Harness → Loop → Graph | ProektMap",
    description:
      "Соберите машину работы агента: каркас, цикл с проверкой и карта связей. Отдельно от готовых продуктовых маршрутов.",
    url: "https://proektmap.ru/agent-engineering",
    siteName: "ProektMap",
    type: "website",
  },
};

const moduleIcons = {
  harness: Shield,
  loop: RefreshCw,
  graph: Network,
} as const;

export default function AgentEngineeringHubPage() {
  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      <section
        style={{
          background:
            "linear-gradient(165deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 55%, rgba(15, 184, 128, 0.08) 100%)",
          borderBottom: "1px solid var(--color-border)",
          padding: "56px 20px 48px",
        }}
      >
        <div style={{ maxWidth: 880, margin: "0 auto" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              background: "rgba(15, 118, 110, 0.12)",
              color: "#0f766e",
              fontSize: "var(--text-xs)",
              fontWeight: 700,
              letterSpacing: "0.03em",
              marginBottom: 16,
            }}
          >
            <Cpu size={14} aria-hidden /> ProektMap · образовательный трек
          </div>

          <p
            style={{
              margin: "0 0 8px",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--color-text-secondary)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            {TRACK.tagline}
          </p>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(30px, 5vw, 44px)",
              fontWeight: 900,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              margin: "0 0 14px",
            }}
          >
            {TRACK.title}
          </h1>

          <p
            style={{
              margin: 0,
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.65,
              color: "var(--color-text-secondary)",
              maxWidth: 640,
            }}
          >
            {TRACK.valueProp}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              marginTop: 28,
            }}
          >
            <Link
              href="/agent-engineering/harness"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "var(--color-accent)",
                color: "#fff",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                fontFamily: "var(--font-heading)",
                minHeight: 52,
              }}
            >
              Начать с Harness <ArrowRight size={16} />
            </Link>
            <Link
              href="/arsenal"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 22px",
                background: "var(--color-bg-primary)",
                border: "1px solid var(--color-border)",
                color: "var(--color-text-primary)",
                textDecoration: "none",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                minHeight: 52,
              }}
            >
              <Layers size={16} /> Нейро каталог
            </Link>
          </div>

          <nav
            aria-label="Модули трека"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 24,
            }}
          >
            {MODULES.map((m) => (
              <Link
                key={m.slug}
                href={`/agent-engineering/${m.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 12px",
                  border: `1px solid ${m.accent}55`,
                  color: m.accent,
                  textDecoration: "none",
                  fontSize: 13,
                  fontWeight: 700,
                  background: "var(--color-bg-primary)",
                }}
              >
                <span style={{ opacity: 0.7 }}>{m.order}.</span> {m.shortTitle}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <main style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 64px" }}>
        <ClaudeAcademyCallout
          style={{ marginBottom: 16 }}
          secondaryHref="/agent-engineering/harness"
          secondaryLabel="К первому модулю"
        />
        <NeuroCatalogCallout
          style={{ marginBottom: 32 }}
          secondaryHref="/arsenal/mcp-agents"
          secondaryLabel="Стек: агенты и скиллы"
        />

        <section aria-labelledby="modules-title" style={{ marginBottom: 48 }}>
          <p
            style={{
              margin: "0 0 6px",
              fontSize: 12,
              fontWeight: 700,
              color: "var(--color-accent)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
            }}
          >
            Лестница из трёх ступеней
          </p>
          <h2
            id="modules-title"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(22px, 3vw, 28px)",
              fontWeight: 800,
              margin: "0 0 8px",
            }}
          >
            Модули трека
          </h2>
          <p style={{ margin: "0 0 24px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Отдельно от{" "}
            <Link href="/resheniya" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
              готовых решений
            </Link>
            : там собираете продукт, здесь — окружение агента.
          </p>

          <div style={{ display: "grid", gap: 16 }}>
            {MODULES.map((m) => {
              const Icon = moduleIcons[m.slug];
              return (
                <Link
                  key={m.slug}
                  href={`/agent-engineering/${m.slug}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "inherit",
                    background: "var(--color-bg-primary)",
                    border: "1px solid var(--color-border)",
                    borderLeft: `4px solid ${m.accent}`,
                    padding: "20px 22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        display: "grid",
                        placeItems: "center",
                        background: `${m.accent}18`,
                        color: m.accent,
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: m.accent,
                          marginBottom: 4,
                        }}
                      >
                        Модуль {m.order} · {m.enLabel}
                      </div>
                      <h3
                        style={{
                          margin: "0 0 8px",
                          fontFamily: "var(--font-heading)",
                          fontSize: 20,
                          fontWeight: 800,
                        }}
                      >
                        {m.title}
                      </h3>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "var(--text-s)",
                          lineHeight: 1.6,
                          color: "var(--color-text-secondary)",
                        }}
                      >
                        {m.summary}
                      </p>
                      <div
                        style={{
                          marginTop: 12,
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 6,
                          fontSize: 13,
                          fontWeight: 700,
                          color: m.accent,
                        }}
                      >
                        Открыть модуль <ArrowRight size={14} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section
          aria-labelledby="outcomes-title"
          style={{
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            padding: "24px 22px",
            marginBottom: 40,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <CheckCircle2 size={20} style={{ color: "var(--color-accent)" }} />
            <h2
              id="outcomes-title"
              style={{
                margin: 0,
                fontFamily: "var(--font-heading)",
                fontSize: 20,
                fontWeight: 800,
              }}
            >
              После трека вы сможете ответить
            </h2>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.75, color: "var(--color-text-secondary)" }}>
            {TRACK.afterTrack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="vs-title"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <article
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              padding: "20px",
            }}
          >
            <GitBranch size={20} style={{ color: "#0f766e", marginBottom: 10 }} />
            <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", fontSize: 16 }}>
              Этот трек
            </h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              Собрать машину агента: harness, loop, graph. Промпт — вход, окружение — ремесло.
            </p>
          </article>
          <article
            style={{
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              padding: "20px",
            }}
          >
            <Layers size={20} style={{ color: "#0284c7", marginBottom: 10 }} />
            <h3 style={{ margin: "0 0 8px", fontFamily: "var(--font-heading)", fontSize: 16 }}>
              Готовые решения
            </h3>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
              Собрать продукт по маршруту. Когда окружение готово — берите миссию на{" "}
              <Link href="/resheniya" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
                /resheniya
              </Link>
              .
            </p>
          </article>
        </section>

        <section
          style={{
            textAlign: "center",
            padding: "28px 20px",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
          }}
        >
          <p style={{ margin: "0 0 16px", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
            Честное правило Graph: агент не переписывает себе права без вашего «да».
          </p>
          <Link
            href="/agent-engineering/harness"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 24px",
              background: "var(--color-accent)",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 700,
              minHeight: 52,
            }}
          >
            Модуль 1 — Harness <ArrowRight size={16} />
          </Link>
        </section>
      </main>
    </div>
  );
}
