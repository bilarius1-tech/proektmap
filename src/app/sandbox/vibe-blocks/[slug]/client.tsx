"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import {
  AGENT_MODE_LABEL,
  FAMILY_META,
  VIBE_KITS,
  priceLabel,
  type VibeKit,
} from "@/lib/vibe-blocks/data";

export default function VibeKitDetailClient({ kit }: { kit: VibeKit }) {
  const [copied, setCopied] = useState<"prompt" | "id" | null>(null);

  async function copy(text: string, kind: "prompt" | "id") {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* ignore */
    }
  }

  const related = VIBE_KITS.filter(
    (k) => k.slug !== kit.slug && (k.family === kit.family || k.tasks.some((t) => kit.tasks.includes(t)))
  ).slice(0, 4);

  const useCmd = `Use ProektMap vibe-blocks: https://proektmap.ru/sandbox/vibe-blocks/${kit.slug}\n\n${kit.agentPrompt}`;

  return (
    <div
      style={{
        fontFamily: "var(--font-body)",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-primary)",
        minHeight: "100dvh",
      }}
    >
      <div
        style={{
          background: "var(--color-bg-primary)",
          borderBottom: "1px solid var(--color-border)",
          padding: "var(--space-xl) var(--space-m)",
        }}
      >
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link
            href="/sandbox/vibe-blocks"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 12,
              color: "var(--color-text-tertiary)",
              textDecoration: "none",
              marginBottom: "var(--space-m)",
            }}
          >
            <ArrowLeft size={14} /> Вайб-блоки
          </Link>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--color-text-tertiary)",
              marginBottom: 8,
            }}
          >
            {FAMILY_META[kit.family].label} · {kit.slug}
          </div>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: 900,
              letterSpacing: "-0.03em",
              margin: "0 0 12px",
              lineHeight: 1.1,
            }}
          >
            {kit.name}
          </h1>
          <p
            style={{
              fontSize: "var(--text-m)",
              color: "var(--color-text-secondary)",
              lineHeight: 1.6,
              margin: "0 0 16px",
              maxWidth: 640,
            }}
          >
            {kit.tagline}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Meta>{priceLabel(kit.price)}</Meta>
            <Meta>{kit.stack}</Meta>
            {kit.agentMode.map((m) => (
              <Meta key={m}>{AGENT_MODE_LABEL[m]}</Meta>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "var(--space-xl) var(--space-m) var(--space-xxl)" }}>
        <div
          style={{
            marginBottom: "var(--space-l)",
            padding: "var(--space-l)",
            background: "var(--color-accent-light)",
            border: "1px solid var(--color-accent)",
            borderLeft: "4px solid var(--color-accent)",
          }}
        >
          <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-m)", marginBottom: 8 }}>
            Use with AI
          </div>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
            Скопируй промпт и отдай агенту. Он соберёт решение в твоём стеке — с опорой на этот кит.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <button type="button" onClick={() => copy(kit.agentPrompt, "prompt")} style={btnPrimary}>
              {copied === "prompt" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "prompt" ? "Скопировано" : "Copy Prompt"}
            </button>
            <button type="button" onClick={() => copy(useCmd, "id")} style={btnGhost}>
              {copied === "id" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "id" ? "Скопировано" : "Copy URL + Prompt"}
            </button>
            <a
              href={kit.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...btnGhost, textDecoration: "none" }}
            >
              Сайт кита <ExternalLink size={14} />
            </a>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 12,
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              fontSize: 12,
              lineHeight: 1.55,
              whiteSpace: "pre-wrap",
              fontFamily: "var(--font-mono)",
              overflow: "auto",
            }}
          >
            {kit.agentPrompt}
          </pre>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-m)",
            marginBottom: "var(--space-l)",
          }}
        >
          <ListBlock title="Когда брать" items={kit.bestFor} tone="good" />
          <ListBlock title="Когда не брать" items={kit.notFor} tone="bad" />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "var(--space-m)",
            marginBottom: "var(--space-l)",
          }}
        >
          <ListBlock title="Сильные стороны" items={kit.strengths} tone="good" />
          <ListBlock title="Ограничения" items={kit.caveats} tone="warn" />
        </div>

        <Block title="Типичные блоки / примеры">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {kit.examples.map((ex) => (
              <Meta key={ex}>{ex}</Meta>
            ))}
          </div>
        </Block>

        <Block title="С чем сочетается">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {kit.pairsWith.map((p) => (
              <Meta key={p}>{p}</Meta>
            ))}
          </div>
        </Block>

        <Block title="Альтернативы">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {kit.alternatives.map((p) => (
              <Meta key={p}>{p}</Meta>
            ))}
          </div>
        </Block>

        <Block title="Из России">
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
            {kit.russiaNote}
          </p>
        </Block>

        {related.length > 0 && (
          <Block title="Похожие">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/sandbox/vibe-blocks/${r.slug}`}
                  style={{
                    padding: 12,
                    border: "1px solid var(--color-border)",
                    background: "var(--color-bg-primary)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <div style={{ fontWeight: 800, fontFamily: "var(--font-heading)", marginBottom: 4 }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: "var(--color-text-secondary)" }}>{r.tagline}</div>
                </Link>
              ))}
            </div>
          </Block>
        )}

        <p style={{ marginTop: "var(--space-l)", fontSize: 12, color: "var(--color-text-tertiary)" }}>
          Инструменты анимации (GSAP, Three, Vanta) —{" "}
          <Link href="/sandbox/creative-library" style={{ color: "var(--color-accent)" }}>
            Креативная библиотека
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        marginBottom: "var(--space-l)",
        padding: "var(--space-l)",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-s)",
          fontWeight: 800,
          margin: "0 0 12px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

function ListBlock({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "good" | "bad" | "warn";
}) {
  const color =
    tone === "good" ? "var(--color-accent)" : tone === "bad" ? "var(--color-error)" : "var(--color-warning)";
  return (
    <section
      style={{
        padding: "var(--space-l)",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        height: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 800, margin: "0 0 12px" }}>
        {title}
      </h2>
      <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.65, color: "var(--color-text-secondary)" }}>
        {items.map((item) => (
          <li key={item} style={{ marginBottom: 4 }}>
            <span style={{ color, fontWeight: 700, marginRight: 6 }}>·</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function Meta({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        fontSize: 11,
        fontWeight: 600,
        padding: "4px 8px",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-secondary)",
        color: "var(--color-text-secondary)",
      }}
    >
      {children}
    </span>
  );
}

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  border: "1px solid var(--color-accent)",
  background: "var(--color-accent)",
  color: "#fff",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 14px",
  fontSize: 12,
  fontWeight: 700,
  cursor: "pointer",
  border: "1px solid var(--color-border)",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
};
