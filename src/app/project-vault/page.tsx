import type { Metadata } from "next";
import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Cpu,
  Layers,
  Shield,
} from "lucide-react";
import { getPublishedCapsules, VAULT } from "@/lib/project-vault";
import VaultCapsuleCard from "@/components/project-vault/vault-capsule-card";

export const metadata: Metadata = {
  title: "Project Vault — инженерные капсулы DNA + Snapshot | ProektMap",
  description:
    "Капсулы реальных продуктов: переносимая AI-инженерия (Harness, Loop, Graph, rules) и снимок артефактов без секретов. Пилот — Реверанс.",
  alternates: {
    canonical: "https://proektmap.ru/project-vault",
  },
  openGraph: {
    title: "Project Vault — DNA + Snapshot | ProektMap",
    description:
      "Следующий похожий проект стартует с правильных промптов, rules и harness — уже извлечённых из живого продукта.",
    url: "https://proektmap.ru/project-vault",
    siteName: "ProektMap",
    type: "website",
  },
};

export default function ProjectVaultHubPage() {
  const capsules = getPublishedCapsules();

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
            "linear-gradient(165deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 55%, rgba(125, 211, 211, 0.12) 100%)",
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
            <Archive size={14} aria-hidden /> ProektMap · инженерные капсулы
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
            {VAULT.tagline}
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
            {VAULT.title}
          </h1>

          <p
            style={{
              margin: "0 0 22px",
              fontSize: "var(--text-l, 18px)",
              lineHeight: 1.6,
              color: "var(--color-text-secondary)",
              maxWidth: 640,
            }}
          >
            {VAULT.valueProp}
          </p>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              alignItems: "center",
            }}
          >
            <Link
              href="/agent-engineering"
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
              <Cpu size={14} aria-hidden /> Словарь Harness → Loop → Graph
              <ArrowRight size={14} aria-hidden />
            </Link>
            <span style={{ color: "var(--color-border)" }}>·</span>
            <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
              Не путать с{" "}
              <Link href="/ai-workshop" style={{ color: "inherit" }}>
                /ai-workshop
              </Link>{" "}
              и{" "}
              <Link href="/resheniya" style={{ color: "inherit" }}>
                /resheniya
              </Link>
            </span>
          </div>
        </div>
      </section>

      <section style={{ padding: "40px 20px 24px", maxWidth: 960, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 8px",
          }}
        >
          Два слоя капсулы
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 14,
            marginBottom: 36,
          }}
        >
          <LayerCard
            icon={Shield}
            title="Project DNA"
            text="Философия, AGENTS, rules, prompts, Harness/Loop/Graph, DoD, паттерны deploy — то, что копируют в проект #2."
          />
          <LayerCard
            icon={Layers}
            title="Project Snapshot"
            text="Код, schema, nginx/pm2, .env.example, SECRETS (имена), URL/VPS metadata — без PII и ключей."
          />
        </div>

        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: 20,
            fontWeight: 800,
            margin: "0 0 16px",
          }}
        >
          Капсулы
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 18,
          }}
        >
          {capsules.map((c) => (
            <VaultCapsuleCard key={c.slug} capsule={c} />
          ))}
        </div>
      </section>

      <section style={{ padding: "8px 20px 56px", maxWidth: 880, margin: "0 auto" }}>
        <aside
          style={{
            padding: "18px 20px",
            background: "var(--color-bg-primary)",
            border: "1px solid var(--color-border)",
            borderLeft: "4px solid #0f766e",
          }}
        >
          <strong style={{ display: "block", marginBottom: 6 }}>После этой страницы вы знаете</strong>
          <ul style={{ margin: 0, paddingLeft: 18, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
            {VAULT.afterTrack.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </aside>
      </section>
    </div>
  );
}

function LayerCard({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Shield;
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <Icon size={16} color="#0f766e" aria-hidden />
        <strong>{title}</strong>
      </div>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
        {text}
      </p>
    </div>
  );
}
