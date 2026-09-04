import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Copy,
  Layers,
  ListChecks,
  ShieldAlert,
} from "lucide-react";
import {
  MODULES,
  TRACK,
  getModule,
  getModuleSlugs,
  getNextModule,
  type AgentModuleSlug,
} from "@/lib/agent-engineering";
import NeuroCatalogCallout from "@/components/arsenal/neuro-catalog-callout";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getModuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) {
    return { title: "Модуль не найден | ProektMap" };
  }
  return {
    title: mod.seoTitle,
    description: mod.seoDescription,
    alternates: {
      canonical: `https://proektmap.ru/agent-engineering/${mod.slug}`,
    },
    openGraph: {
      title: mod.seoTitle,
      description: mod.seoDescription,
      url: `https://proektmap.ru/agent-engineering/${mod.slug}`,
      siteName: "ProektMap",
      type: "article",
    },
  };
}

export default async function AgentEngineeringModulePage({ params }: PageProps) {
  const { slug } = await params;
  const mod = getModule(slug);
  if (!mod) notFound();

  const next = getNextModule(mod.slug as AgentModuleSlug);
  const prev = MODULES.find((m) => m.nextSlug === mod.slug) ?? null;

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
          background: "var(--color-bg-primary)",
          borderBottom: "1px solid var(--color-border)",
          padding: "40px 20px 36px",
        }}
      >
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link
            href="/agent-engineering"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 600,
              color: "var(--color-text-secondary)",
              textDecoration: "none",
              marginBottom: 16,
            }}
          >
            <ArrowLeft size={14} /> {TRACK.title}
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              background: `${mod.accent}18`,
              color: mod.accent,
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Модуль {mod.order} из {MODULES.length} · {mod.enLabel}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            {mod.title}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
              maxWidth: 620,
            }}
          >
            {mod.heroLead}
          </p>

          <nav
            aria-label="Переход по модулям"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 22 }}
          >
            {MODULES.map((m) => {
              const active = m.slug === mod.slug;
              return (
                <Link
                  key={m.slug}
                  href={`/agent-engineering/${m.slug}`}
                  aria-current={active ? "page" : undefined}
                  style={{
                    padding: "8px 12px",
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    border: active ? `2px solid ${m.accent}` : "1px solid var(--color-border)",
                    color: active ? m.accent : "var(--color-text-secondary)",
                    background: active ? `${m.accent}10` : "transparent",
                  }}
                >
                  {m.order}. {m.shortTitle}
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      <main style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 64px" }}>
        {/* 1. What it is */}
        <Section title="Что это" kicker="Простыми словами">
          {mod.whatItIs.map((p) => (
            <p
              key={p.slice(0, 40)}
              style={{
                margin: "0 0 12px",
                fontSize: "var(--text-s)",
                lineHeight: 1.7,
                color: "var(--color-text-secondary)",
              }}
            >
              {p}
            </p>
          ))}
        </Section>

        {/* 2. Drive / catch */}
        <Section title={mod.driveCatchTitle} kicker="Движок и тормоза">
          {mod.driveCatch.map((pair) => (
            <div
              key={pair.drive.slice(0, 30)}
              style={{
                display: "grid",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  padding: "14px 16px",
                  background: "var(--color-bg-primary)",
                  borderLeft: `4px solid ${mod.accent}`,
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: mod.accent, marginBottom: 6 }}>
                  ВЕДЁТ (drive)
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{pair.drive}</p>
              </div>
              <div
                style={{
                  padding: "14px 16px",
                  background: "var(--color-bg-primary)",
                  borderLeft: "4px solid #64748b",
                }}
              >
                <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  ЛОВИТ (catch)
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>{pair.catch}</p>
              </div>
              {pair.example && (
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "var(--color-text-secondary)",
                    fontStyle: "italic",
                  }}
                >
                  Пример: {pair.example}
                </p>
              )}
            </div>
          ))}

          {mod.parts.length > 0 && (
            <div style={{ marginTop: 20, overflowX: "auto" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                  background: "var(--color-bg-primary)",
                }}
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        borderBottom: "1px solid var(--color-border)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Часть
                    </th>
                    <th
                      style={{
                        textAlign: "left",
                        padding: "10px 12px",
                        borderBottom: "1px solid var(--color-border)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      Роль
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mod.parts.map((part) => (
                    <tr key={part.name}>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "1px solid var(--color-border)",
                          fontWeight: 600,
                          verticalAlign: "top",
                          width: "38%",
                        }}
                      >
                        {part.name}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          borderBottom: "1px solid var(--color-border)",
                          color: "var(--color-text-secondary)",
                          lineHeight: 1.5,
                        }}
                      >
                        {part.role}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>

        {/* 3. Checklist */}
        <Section title="Чеклист окружения" kicker="Перед практикой">
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
            {mod.checklist.map((item) => (
              <li
                key={item.label}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <ListChecks size={18} style={{ color: mod.accent, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                  {item.hint && (
                    <div style={{ fontSize: 13, color: "var(--color-text-secondary)", marginTop: 4 }}>
                      {item.hint}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Section>

        {/* 4. Prompts */}
        <Section title="Примеры промптов" kicker="Скопируйте в Cursor">
          <div style={{ display: "grid", gap: 16 }}>
            {mod.prompts.map((pr) => (
              <article
                key={pr.title}
                style={{
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 14px",
                    borderBottom: "1px solid var(--color-border)",
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      color: mod.accent,
                    }}
                  >
                    {pr.level}
                  </span>
                  <strong style={{ fontSize: 14 }}>{pr.title}</strong>
                  <span
                    style={{
                      marginLeft: "auto",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 12,
                      color: "var(--color-text-tertiary)",
                    }}
                  >
                    <Copy size={12} aria-hidden /> вставьте как есть
                  </span>
                </div>
                <pre
                  style={{
                    margin: 0,
                    padding: "16px 14px",
                    background: "#0f172a",
                    color: "#e2e8f0",
                    fontSize: 13,
                    lineHeight: 1.55,
                    overflowX: "auto",
                    whiteSpace: "pre-wrap",
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                  }}
                >
                  {pr.prompt}
                </pre>
              </article>
            ))}
          </div>
        </Section>

        {/* 5. DoD */}
        <Section title="Definition of Done" kicker="Артефакт модуля">
          <div
            style={{
              padding: "18px 16px",
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              borderTop: `3px solid ${mod.accent}`,
            }}
          >
            <p style={{ margin: "0 0 12px", fontWeight: 700, fontSize: 15 }}>
              Сдали модуль, если есть: {mod.artifact}
            </p>
            <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7, color: "var(--color-text-secondary)" }}>
              {mod.definitionOfDone.map((d) => (
                <li key={d}>
                  <CheckCircle2
                    size={14}
                    style={{ color: mod.accent, display: "inline", marginRight: 6, verticalAlign: -2 }}
                  />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {mod.slug === "graph" && (
            <div
              style={{
                marginTop: 14,
                display: "flex",
                gap: 12,
                padding: "14px 16px",
                background: "rgba(217, 119, 6, 0.08)",
                border: "1px solid rgba(217, 119, 6, 0.35)",
              }}
            >
              <ShieldAlert size={20} style={{ color: "#d97706", flexShrink: 0 }} />
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
                Self-rewrite skills и rules — только после вашего явного «да» и с просмотром diff.
                Агент не должен сам расширять себе доступ к .env или разрушительным командам.
              </p>
            </div>
          )}
        </Section>

        {/* 6. Links */}
        <Section title="Куда дальше" kicker="Связи экосистемы">
          <NeuroCatalogCallout
            compact
            style={{ marginBottom: 16 }}
            secondaryHref={mod.arsenalLinks[0]?.href}
            secondaryLabel={mod.arsenalLinks[0]?.label}
          />

          <div style={{ display: "grid", gap: 8, marginBottom: 24 }}>
            {mod.arsenalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "12px 14px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <Layers size={16} style={{ color: "#0284c7", flexShrink: 0 }} />
                <span style={{ fontWeight: 600, fontSize: 14 }}>{link.label}</span>
                {link.note && (
                  <span style={{ fontSize: 13, color: "var(--color-text-secondary)", marginLeft: "auto" }}>
                    {link.note}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            {prev ? (
              <Link
                href={`/agent-engineering/${prev.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-primary)",
                  textDecoration: "none",
                  color: "var(--color-text-primary)",
                  fontWeight: 600,
                  fontSize: 14,
                  minHeight: 48,
                }}
              >
                <ArrowLeft size={16} /> {prev.shortTitle}
              </Link>
            ) : (
              <Link
                href="/agent-engineering"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-primary)",
                  textDecoration: "none",
                  color: "var(--color-text-primary)",
                  fontWeight: 600,
                  fontSize: 14,
                  minHeight: 48,
                }}
              >
                <ArrowLeft size={16} /> К хабу трека
              </Link>
            )}

            {next ? (
              <Link
                href={`/agent-engineering/${next.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  background: next.accent,
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  minHeight: 48,
                }}
              >
                Далее: {next.shortTitle} <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/resheniya"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 16px",
                  background: "var(--color-accent)",
                  color: "#fff",
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: 14,
                  minHeight: 48,
                }}
              >
                К готовым решениям <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </Section>
      </main>
    </div>
  );
}

function Section({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: ReactNode;
}) {
  return (
    <section style={{ marginBottom: 40 }} aria-labelledby={title.replace(/\s+/g, "-")}>
      <p
        style={{
          margin: "0 0 4px",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-accent)",
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {kicker}
      </p>
      <h2
        id={title.replace(/\s+/g, "-")}
        style={{
          margin: "0 0 16px",
          fontFamily: "var(--font-heading)",
          fontSize: "clamp(20px, 3vw, 24px)",
          fontWeight: 800,
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
