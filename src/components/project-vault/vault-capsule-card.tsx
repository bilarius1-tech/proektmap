import Link from "next/link";
import { ArrowRight, ExternalLink, GitBranch, Network, RefreshCw, Shield } from "lucide-react";
import type { VaultCapsule } from "@/lib/project-vault";

type Props = {
  capsule: VaultCapsule;
};

export default function VaultCapsuleCard({ capsule }: Props) {
  const accent = capsule.accent ?? "#0f766e";

  return (
    <article
      style={{
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-m, 12px)",
        padding: "22px 22px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        height: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: accent,
              marginBottom: 6,
            }}
          >
            DNA {capsule.dnaVersion}
            {capsule.derivedFrom ? ` · from ${capsule.derivedFrom}` : " · root"}
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(20px, 3vw, 24px)",
              fontWeight: 800,
              letterSpacing: "-0.02em",
            }}
          >
            {capsule.name}
          </h2>
        </div>
        <a
          href={capsule.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            fontSize: 12,
            fontWeight: 600,
            color: "var(--color-text-secondary)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          live <ExternalLink size={12} aria-hidden />
        </a>
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "var(--text-s, 14px)",
          lineHeight: 1.55,
          color: "var(--color-text-secondary)",
          flex: 1,
        }}
      >
        {capsule.tagline}
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {capsule.stackLabels.map((label) => (
          <span
            key={label}
            style={{
              fontSize: 11,
              fontWeight: 600,
              padding: "3px 8px",
              background: "var(--color-bg-secondary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            {label}
          </span>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {capsule.aiFlags.harness && <AiBadge icon={Shield} label="Harness" color="#0fb880" />}
        {capsule.aiFlags.loop && <AiBadge icon={RefreshCw} label="Loop" color="#3b82f6" />}
        {capsule.aiFlags.graph && <AiBadge icon={Network} label="Graph" color="#8b5cf6" />}
        <AiBadge icon={GitBranch} label="VPS DNA" color={accent} />
      </div>

      <Link
        href={`/project-vault/${capsule.slug}`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          marginTop: 4,
          padding: "12px 16px",
          background: accent,
          color: "#1a2a2a",
          fontWeight: 800,
          fontSize: 14,
          textDecoration: "none",
          borderRadius: "var(--radius-s, 8px)",
        }}
      >
        Открыть инженерную карту
        <ArrowRight size={16} aria-hidden />
      </Link>
    </article>
  );
}

function AiBadge({
  icon: Icon,
  label,
  color,
}: {
  icon: typeof Shield;
  label: string;
  color: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 700,
        color,
        background: `${color}14`,
        padding: "4px 8px",
      }}
    >
      <Icon size={13} aria-hidden />
      {label}
    </span>
  );
}
