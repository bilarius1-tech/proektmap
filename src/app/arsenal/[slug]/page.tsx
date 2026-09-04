import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Map,
} from "lucide-react";
import {
  getArsenalStack,
  getPublishedStacks,
  getArsenalToolsBySlugs,
  ARSENAL_STACKS,
} from "@/lib/arsenal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARSENAL_STACKS.filter((s) => s.status === "published").map((s) => ({
    slug: s.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const stack = getArsenalStack(slug);
  if (!stack) {
    return { title: "Стек не найден | ProektMap" };
  }
  return {
    title: `${stack.title} — Нейро каталог | ProektMap`,
    description: `${stack.mission} ${stack.definitionOfDone}`.slice(0, 160),
    alternates: {
      canonical: `https://proektmap.ru/arsenal/${stack.slug}`,
    },
    openGraph: {
      title: `${stack.title} — Нейро каталог`,
      description: stack.mission,
      url: `https://proektmap.ru/arsenal/${stack.slug}`,
      siteName: "ProektMap",
      type: "website",
    },
  };
}

export default async function ArsenalDetailPage({ params }: Props) {
  const { slug } = await params;
  const stack = getArsenalStack(slug);
  if (!stack || stack.status !== "published") notFound();

  const tools = getArsenalToolsBySlugs(stack.tools);
  const others = getPublishedStacks().filter((s) => s.slug !== stack.slug).slice(0, 4);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #0f172a 0%, #1e293b 50%, #0c4a6e 100%)",
          padding: "40px 20px 36px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link
            href="/arsenal"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              color: "rgba(255,255,255,0.7)",
              fontSize: "var(--text-s)",
              textDecoration: "none",
              marginBottom: 18,
            }}
          >
            <ArrowLeft size={16} /> Все стеки
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <span style={{ fontSize: 36 }} aria-hidden>
              {stack.icon}
            </span>
            <span
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: "rgba(14,165,233,0.25)",
                color: "#7dd3fc",
              }}
            >
              {stack.focus}
            </span>
          </div>
          <h1
            style={{
              margin: "0 0 10px",
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(26px, 4.5vw, 38px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {stack.title}
          </h1>
          <p style={{ margin: "0 0 8px", fontSize: "var(--text-m)", color: "rgba(255,255,255,0.78)", lineHeight: 1.55 }}>
            {stack.mission}
          </p>
          <p style={{ margin: 0, fontSize: "var(--text-s)", color: "rgba(255,255,255,0.55)" }}>
            Для кого: {stack.audience}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "28px 20px 64px" }}>
        <h2 style={{ margin: "0 0 14px", fontSize: 22, fontWeight: 800 }}>Порядок использования</h2>
        <ol style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 12 }}>
          {stack.tools.map((toolSlug, i) => {
            const tool = tools.find((t) => t.slug === toolSlug);
            const hint = stack.orderHint[i] || tool?.name || toolSlug;
            return (
              <li
                key={toolSlug}
                style={{
                  display: "flex",
                  gap: 14,
                  padding: "14px 14px",
                  borderRadius: "var(--radius-m)",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                }}
              >
                <div
                  style={{
                    flexShrink: 0,
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "rgba(14,165,233,0.15)",
                    color: "#0369a1",
                    fontWeight: 800,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "baseline", marginBottom: 4 }}>
                    {tool ? (
                      <Link
                        href={`/arsenal/tools/${tool.slug}`}
                        style={{ fontWeight: 800, color: "inherit", textDecoration: "none" }}
                      >
                        {tool.name}
                      </Link>
                    ) : (
                      <strong>{toolSlug}</strong>
                    )}
                    {tool && (
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                        {tool.categoryIcon} {tool.categoryLabel}
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "0 0 8px", fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.45 }}>
                    {hint}
                  </p>
                  {tool?.summary && hint !== tool.summary && (
                    <p style={{ margin: "0 0 8px", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.4 }}>
                      {tool.summary}
                    </p>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                    {tool?.website && (
                      <a
                        href={tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "var(--text-xs)",
                          fontWeight: 700,
                          color: "#0284c7",
                          textDecoration: "none",
                        }}
                      >
                        Сайт <ExternalLink size={12} />
                      </a>
                    )}
                    {tool?.download && (
                      <a
                        href={tool.download}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: "var(--text-xs)",
                          fontWeight: 600,
                          color: "var(--color-text-secondary)",
                          textDecoration: "none",
                        }}
                      >
                        Скачать <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
            gap: 12,
            marginBottom: 28,
          }}
        >
          <div
            style={{
              padding: 16,
              borderRadius: "var(--radius-m)",
              border: "1px solid rgba(34,197,94,0.35)",
              background: "rgba(34,197,94,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, marginBottom: 8 }}>
              <CheckCircle2 size={18} color="#16a34a" /> Definition of Done
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-s)", lineHeight: 1.5 }}>{stack.definitionOfDone}</p>
          </div>
          <div
            style={{
              padding: 16,
              borderRadius: "var(--radius-m)",
              border: "1px solid rgba(245,158,11,0.4)",
              background: "rgba(245,158,11,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 800, marginBottom: 8 }}>
              <AlertTriangle size={18} color="#d97706" /> Типичная ошибка
            </div>
            <p style={{ margin: 0, fontSize: "var(--text-s)", lineHeight: 1.5 }}>{stack.commonMistake}</p>
          </div>
        </div>

        {stack.relatedRoutes.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ margin: "0 0 12px", fontSize: 20, fontWeight: 800 }}>Связи в ProektMap</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {stack.relatedRoutes.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "10px 14px",
                    borderRadius: "var(--radius-m)",
                    border: "1px solid var(--color-border)",
                    background: "var(--color-surface)",
                    textDecoration: "none",
                    color: "inherit",
                    fontWeight: 700,
                    fontSize: "var(--text-s)",
                  }}
                >
                  <Map size={14} /> {r.label} <ArrowRight size={14} />
                </Link>
              ))}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section>
            <h2 style={{ margin: "0 0 12px", fontSize: 18, fontWeight: 800 }}>Другие стеки</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {others.map((s) => (
                <Link
                  key={s.slug}
                  href={`/arsenal/${s.slug}`}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-full)",
                    border: "1px solid var(--color-border)",
                    textDecoration: "none",
                    color: "var(--color-text-secondary)",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                  }}
                >
                  {s.icon} {s.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
