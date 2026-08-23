"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, ExternalLink } from "lucide-react";
import {
  CREATIVE_TOOLS,
  difficultyLabel,
  mobileLabel,
  type CreativeTool,
} from "@/lib/creative-library/data";

export default function CreativeToolDetailClient({ tool }: { tool: CreativeTool }) {
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

  const related = CREATIVE_TOOLS.filter(
    (t) => t.slug !== tool.slug && t.tasks.some((task) => tool.tasks.includes(task))
  ).slice(0, 4);

  const useCmd = `Use ProektMap creative library: https://proektmap.ru/sandbox/creative-library/${tool.slug}\n\n${tool.agentPrompt}`;

  return (
    <div style={{ fontFamily: "var(--font-body)", background: "var(--color-bg-secondary)", color: "var(--color-text-primary)", minHeight: "100dvh" }}>
      <div style={{ background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)", padding: "var(--space-xl) var(--space-m)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <Link
            href="/sandbox/creative-library"
            style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-m)" }}
          >
            <ArrowLeft size={14} /> Креативная библиотека
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-text-tertiary)", marginBottom: 8 }}>
            {tool.category} · {tool.slug}
          </div>
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(28px, 5vw, 42px)", fontWeight: 900, letterSpacing: "-0.03em", margin: "0 0 12px", lineHeight: 1.1 }}>
            {tool.name}
          </h1>
          <p style={{ fontSize: "var(--text-m)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: "0 0 16px", maxWidth: 640 }}>
            {tool.tagline}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <Meta>{difficultyLabel(tool.difficulty)}</Meta>
            <Meta>{mobileLabel(tool.mobile)}</Meta>
            <Meta>{tool.price}</Meta>
            <Meta>{tool.stack}</Meta>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "var(--space-xl) var(--space-m) var(--space-xxl)" }}>
        <Block title="Design DNA">
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, fontStyle: "italic", color: "var(--color-text-primary)" }}>
            «{tool.designDNA}»
          </p>
        </Block>

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
            Скопируй промпт и отдай агенту. Он реализует решение в твоём стеке — не копирует чужой код.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
            <button type="button" onClick={() => copy(tool.agentPrompt, "prompt")} style={btnPrimary}>
              {copied === "prompt" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "prompt" ? "Скопировано" : "Copy Prompt"}
            </button>
            <button type="button" onClick={() => copy(useCmd, "id")} style={btnGhost}>
              {copied === "id" ? <Check size={14} /> : <Copy size={14} />}
              {copied === "id" ? "Скопировано" : "Copy URL + Prompt"}
            </button>
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
            {tool.agentPrompt}
          </pre>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
          <ListBlock title="Что умеет" items={tool.can} tone="good" />
          <ListBlock title="Чего не умеет" items={tool.cannot} tone="bad" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-l)" }}>
          <ListBlock title="Когда брать" items={tool.whenYes} tone="good" />
          <ListBlock title="Когда не брать" items={tool.whenNo} tone="bad" />
        </div>

        <Block title="С чем сочетается">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tool.pairsWith.map((p) => (
              <Meta key={p}>{p}</Meta>
            ))}
          </div>
        </Block>

        <Block title="Альтернативы">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {tool.alternatives.map((p) => (
              <Meta key={p}>{p}</Meta>
            ))}
          </div>
        </Block>

        <ListBlock title="Типичные ошибки" items={tool.mistakes} tone="warn" />

        <Block title="Демо и ссылки">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {tool.demos.map((d) => (
              <a
                key={d.href}
                href={d.href}
                target={d.href.startsWith("http") ? "_blank" : undefined}
                rel={d.href.startsWith("http") ? "noopener noreferrer" : undefined}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--color-accent)", fontSize: 14, fontWeight: 600, textDecoration: "none" }}
              >
                {d.label} <ExternalLink size={14} />
              </a>
            ))}
          </div>
        </Block>

        {related.length > 0 && (
          <Block title="Похожие">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/sandbox/creative-library/${r.slug}`}
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
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 800, margin: "0 0 12px", letterSpacing: "-0.01em" }}>{title}</h2>
      {children}
    </section>
  );
}

function ListBlock({ title, items, tone }: { title: string; items: string[]; tone: "good" | "bad" | "warn" }) {
  const color = tone === "good" ? "var(--color-accent)" : tone === "bad" ? "var(--color-error)" : "var(--color-warning)";
  return (
    <section style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", height: "100%", boxSizing: "border-box" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-s)", fontWeight: 800, margin: "0 0 12px" }}>{title}</h2>
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
    <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>
      {children}
    </span>
  );
}

const btnPrimary: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 16px",
  background: "var(--color-accent)",
  color: "#fff",
  border: "none",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "10px 16px",
  background: "var(--color-bg-primary)",
  color: "var(--color-text-primary)",
  border: "1px solid var(--color-border)",
  fontWeight: 700,
  fontSize: 13,
  cursor: "pointer",
};
