import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FolderOpen,
  Lock,
  Network,
  RefreshCw,
  Shield,
} from "lucide-react";
import {
  getCapsule,
  getCapsuleSlugs,
  VAULT,
} from "@/lib/project-vault";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCapsuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const capsule = getCapsule(slug);
  if (!capsule) return { title: "Капсула не найдена | Project Vault" };
  return {
    title: capsule.seoTitle,
    description: capsule.seoDescription,
    alternates: {
      canonical: `https://proektmap.ru/project-vault/${capsule.slug}`,
    },
    openGraph: {
      title: capsule.seoTitle,
      description: capsule.seoDescription,
      url: `https://proektmap.ru/project-vault/${capsule.slug}`,
      siteName: "ProektMap",
      type: "article",
    },
  };
}

export default async function ProjectVaultCapsulePage({ params }: PageProps) {
  const { slug } = await params;
  const capsule = getCapsule(slug);
  if (!capsule || capsule.status !== "published") notFound();

  const accent = capsule.accent ?? "#0f766e";

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
            href="/project-vault"
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
            <ArrowLeft size={14} /> {VAULT.title}
          </Link>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 10px",
              background: `${accent}22`,
              color: "#2a5555",
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            <Archive size={13} aria-hidden /> Капсула · DNA {capsule.dnaVersion}
            {capsule.derivedFrom ? ` · derivedFrom ${capsule.derivedFrom}` : ""}
          </div>

          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 4vw, 40px)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
            }}
          >
            {capsule.name}
          </h1>
          <p
            style={{
              margin: "0 0 16px",
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.55,
              color: "var(--color-text-secondary)",
              maxWidth: 640,
            }}
          >
            {capsule.tagline}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <a
              href={capsule.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 700,
                color: "#0f766e",
                textDecoration: "none",
              }}
            >
              {capsule.sourceUrl.replace(/^https?:\/\//, "")}
              <ExternalLink size={13} aria-hidden />
            </a>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                fontWeight: 700,
                color: "#0f766e",
                background: "rgba(15,118,110,0.1)",
                padding: "4px 8px",
              }}
            >
              <Lock size={12} aria-hidden /> Client Boundary ON
            </span>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "32px 20px 64px" }}>
        <Section title="Зачем эта капсула">
          <p style={pStyle}>
            Перенос AI-инженерии: следующий похожий проект стартует не с пустого чата, а с
            проверенных rules, harness, loop, graph и паттернов деплоя.
          </p>
          <ul style={{ margin: "12px 0 0", paddingLeft: 18, lineHeight: 1.6 }}>
            {capsule.longSummary.map((item) => (
              <li key={item} style={{ marginBottom: 6, color: "var(--color-text-secondary)" }}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="DNA" id="dna">
          <div style={{ display: "grid", gap: 12 }}>
            {capsule.dnaSections.map((sec) => (
              <div
                key={sec.id}
                style={{
                  padding: "14px 16px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <strong style={{ display: "block", marginBottom: 4 }}>{sec.title}</strong>
                <p style={{ ...pStyle, marginBottom: 8 }}>{sec.summary}</p>
                <code style={codeBlock}>{sec.paths.join(" · ")}</code>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 16 }}>
            <TrackLink href="/agent-engineering/harness" icon={Shield} label="Harness" />
            <TrackLink href="/agent-engineering/loop" icon={RefreshCw} label="Loop" />
            <TrackLink href="/agent-engineering/graph" icon={Network} label="Graph" />
          </div>
        </Section>

        <Section title="Snapshot" id="snapshot">
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            {capsule.snapshotHighlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <p style={{ ...pStyle, marginTop: 12 }}>
            Package root: <code>{capsule.packageRoot}</code>
            <br />
            Manifest: <code>{capsule.manifestPath}</code>
          </p>
        </Section>

        <Section title="Reusable" id="reusable">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {capsule.reusablePatterns.map((p) => (
              <span
                key={p}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "5px 10px",
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </Section>

        <Section title="Arsenal candidates" id="arsenal">
          <p style={{ ...pStyle, marginBottom: 10 }}>
            Только пометки — <strong>не опубликовано автоматически</strong> в /arsenal.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
            {capsule.arsenalCandidates.map((c) => (
              <li key={c.title} style={{ marginBottom: 8, color: "var(--color-text-secondary)" }}>
                <strong style={{ color: "var(--color-text-primary)" }}>{c.title}</strong> — {c.reason}
              </li>
            ))}
          </ul>
          <Link href={capsule.links.arsenal} style={textLink}>
            Открыть Arsenal <ArrowRight size={14} />
          </Link>
        </Section>

        <Section title="Связи" id="links">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <Link href={capsule.links.agentEngineering} style={textLink}>
              Инженерия агентов
            </Link>
            <Link href={capsule.links.aiSkills} style={textLink}>
              AI Skills
            </Link>
            <Link href="/ai-skills" style={textLink}>
              Skills каталог
            </Link>
          </div>
        </Section>

        <Section title="Создать из этого" id="create">
          <div
            style={{
              padding: "16px 18px",
              background: "var(--color-bg-primary)",
              border: "1px dashed var(--color-border)",
              opacity: 0.85,
            }}
          >
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: 6 }}>
              Phase 2 · planned
            </div>
            <p style={pStyle}>
              Чекбоксы seed-kit (AGENTS, rules, harness stub, DoD, .env.example) появятся позже.
              Сейчас используйте <code>ai/COPY-FIRST.md</code> в пакете капсулы.
            </p>
          </div>
        </Section>

        <Section title="Для агента" id="agent-paths">
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "14px 16px",
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span style={{ marginTop: 2, display: "inline-flex" }}>
              <FolderOpen size={18} color="#0f766e" aria-hidden />
            </span>
            <div>
              <p style={{ ...pStyle, marginBottom: 8 }}>
                Абсолютный путь на хосте ProektMap:
              </p>
              <code style={codeBlock}>
                /var/www/www-root/data/www/proektmap.ru/{capsule.packageRoot}
              </code>
              <p style={{ ...pStyle, marginTop: 10 }}>
                Старт проекта #2: TEMPLATE в{" "}
                <code>docs/PROJECT-VAULT-TZ.md</code> + новый INSTANCE block.
              </p>
            </div>
          </div>
          <ul style={{ margin: "14px 0 0", paddingLeft: 0, listStyle: "none" }}>
            {[
              "Client Boundary подписан",
              "Secret scan package clean",
              "DNA достаточна для day-0 harness",
            ].map((t) => (
              <li
                key={t}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 6,
                  fontSize: 14,
                }}
              >
                <CheckCircle2 size={16} color="#0fb880" aria-hidden /> {t}
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} style={{ marginBottom: 36 }}>
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: 22,
          fontWeight: 800,
          margin: "0 0 12px",
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function TrackLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Shield;
  label: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        fontSize: 13,
        fontWeight: 700,
        textDecoration: "none",
        color: "var(--color-text-primary)",
      }}
    >
      <Icon size={14} aria-hidden /> {label}
    </Link>
  );
}

const pStyle: CSSProperties = {
  margin: 0,
  fontSize: 15,
  lineHeight: 1.6,
  color: "var(--color-text-secondary)",
};

const codeBlock: CSSProperties = {
  display: "block",
  fontSize: 12,
  lineHeight: 1.45,
  padding: "8px 10px",
  background: "var(--color-bg-secondary)",
  border: "1px solid var(--color-border)",
  overflowWrap: "anywhere",
};

const textLink: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  marginTop: 10,
  fontSize: 13,
  fontWeight: 700,
  color: "#0f766e",
  textDecoration: "none",
};
