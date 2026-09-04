import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Layers } from "lucide-react";
import {
  ARSENAL_TOOLS,
  getArsenalTool,
  getStacksForTool,
} from "@/lib/arsenal";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return ARSENAL_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = getArsenalTool(slug);
  if (!tool) return { title: "Инструмент не найден | ProektMap" };
  return {
    title: `${tool.name} — Нейро каталог | ProektMap`,
    description: tool.summary.slice(0, 160),
    alternates: {
      canonical: `https://proektmap.ru/arsenal/tools/${tool.slug}`,
    },
  };
}

export default async function ArsenalToolPage({ params }: Props) {
  const { slug } = await params;
  const tool = getArsenalTool(slug);
  if (!tool) notFound();

  const stacks = getStacksForTool(tool.slug);

  return (
    <div
      style={{
        fontFamily: "Inter, sans-serif",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        minHeight: "100vh",
      }}
    >
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 64px" }}>
        <Link
          href="/arsenal"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-s)",
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} /> Нейро каталог
        </Link>

        <div style={{ marginBottom: 8, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          {tool.categoryIcon} {tool.categoryLabel}
          {tool.wasDuplicate ? " · dedup из Excel" : ""}
        </div>
        <h1
          style={{
            margin: "0 0 12px",
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(26px, 4vw, 34px)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
          }}
        >
          {tool.name}
        </h1>
        <p style={{ margin: "0 0 20px", fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
          {tool.summary}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {tool.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: "var(--text-xs)",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "var(--radius-full)",
                background: "rgba(14,165,233,0.12)",
                color: "#0369a1",
              }}
            >
              {tag}
            </span>
          ))}
          <span
            style={{
              fontSize: "var(--text-xs)",
              padding: "4px 10px",
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-tertiary)",
            }}
          >
            {tool.excelStatus}
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 32 }}>
          {tool.website && (
            <a
              href={tool.website}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 16px",
                borderRadius: "var(--radius-m)",
                background: "#0ea5e9",
                color: "#fff",
                fontWeight: 700,
                fontSize: "var(--text-s)",
                textDecoration: "none",
              }}
            >
              Открыть сайт <ExternalLink size={14} />
            </a>
          )}
          {tool.download && (
            <a
              href={tool.download}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 16px",
                borderRadius: "var(--radius-m)",
                border: "1px solid var(--color-border)",
                color: "inherit",
                fontWeight: 600,
                fontSize: "var(--text-s)",
                textDecoration: "none",
              }}
            >
              Скачать / GitHub <ExternalLink size={14} />
            </a>
          )}
        </div>

        {stacks.length > 0 && (
          <section>
            <h2
              style={{
                margin: "0 0 12px",
                fontSize: 18,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Layers size={18} /> Входит в арсеналы
            </h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 8 }}>
              {stacks.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/arsenal/${s.slug}`}
                    style={{
                      display: "block",
                      padding: "12px 14px",
                      borderRadius: "var(--radius-m)",
                      border: "1px solid var(--color-border)",
                      textDecoration: "none",
                      color: "inherit",
                      fontWeight: 700,
                    }}
                  >
                    {s.icon} {s.title}
                    <div style={{ fontWeight: 400, fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginTop: 4 }}>
                      {s.mission}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p style={{ marginTop: 36, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          Карточка из Нейро каталога ProektMap. Категория «Голос и Аудио» закрыта; остальные добираются этапами 3–9.{" "}
          <Link href="/ai-tools" style={{ color: "#0284c7" }}>
            Смотреть /ai-tools
          </Link>
        </p>
      </div>
    </div>
  );
}
