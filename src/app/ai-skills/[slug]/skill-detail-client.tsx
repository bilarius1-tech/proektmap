"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Shield,
} from "lucide-react";
import type { AiSkill } from "@/lib/ai-skills/types";
import { AI_SKILL_RECIPE, AI_SKILL_STACK, getRelatedSkills } from "@/lib/ai-skills";

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {
          /* ignore */
        }
      }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "8px 12px",
        border: "1px solid var(--color-border)",
        background: ok ? "rgba(15,184,128,0.12)" : "var(--color-bg-primary)",
        color: ok ? "#0f766e" : "var(--color-text-primary)",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
      }}
    >
      {ok ? <Check size={14} /> : <Copy size={14} />}
      {ok ? "Скопировано" : label}
    </button>
  );
}

function PreBlock({ text }: { text: string }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: 16,
        background: "#0f172a",
        color: "#e2e8f0",
        fontSize: 13,
        lineHeight: 1.55,
        overflowX: "auto",
        whiteSpace: "pre-wrap",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}
    >
      {text}
    </pre>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2
        style={{
          margin: "0 0 12px",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: "0.08em",
          color: "var(--color-text-secondary)",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function SkillDetailClient({ skill }: { skill: AiSkill }) {
  const related = getRelatedSkills(skill);
  const trustLabel =
    skill.trust === "verified" ? "verified" : skill.trust === "community" ? "community" : "flagged";

  return (
    <div
      style={{
        background: "var(--color-bg-secondary)",
        minHeight: "100vh",
        fontFamily: "var(--font-body)",
        color: "var(--color-text-primary)",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px 20px 72px" }}>
        <Link
          href="/ai-skills"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 24,
            fontWeight: 700,
            fontSize: 14,
            color: "#0f766e",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} /> AI Skills
        </Link>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {skill.typeLabels.map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
                padding: "3px 8px",
                background: "rgba(15,118,110,0.1)",
                color: "#0f766e",
              }}
            >
              {t.toUpperCase()}
            </span>
          ))}
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.04em",
              padding: "3px 8px",
              background: "var(--color-bg-primary)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
          >
            <Shield size={12} /> {trustLabel}
          </span>
        </div>

        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(28px, 4vw, 38px)",
            fontWeight: 900,
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {skill.title}
        </h1>
        <p style={{ margin: "0 0 8px", color: "var(--color-text-secondary)" }}>by {skill.author}</p>
        <p style={{ margin: "0 0 20px", fontSize: 15, color: "var(--color-text-secondary)" }}>
          Роль в графе: {skill.graphRole}
        </p>

        <a
          href={skill.repository}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 32,
            fontWeight: 700,
            fontSize: 14,
            color: "#0f766e",
          }}
        >
          Репозиторий / источник <ExternalLink size={14} />
        </a>

        <Section title="ЧТО ДЕЛАЕТ">
          <p style={{ margin: 0, lineHeight: 1.65 }}>{skill.does}</p>
        </Section>

        <Section title="КОГДА ИСПОЛЬЗОВАТЬ">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {skill.whenToUse.map((item) => (
              <li key={item} style={{ lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="INSTALL">
          <PreBlock text={skill.install} />
          <div style={{ marginTop: 10 }}>
            <CopyButton label="Copy install" text={skill.install} />
          </div>
        </Section>

        <Section title="PROMPT / INSTRUCTION">
          <PreBlock text={skill.invoke} />
          <div style={{ marginTop: 10 }}>
            <CopyButton label="Copy invoke" text={skill.invoke} />
          </div>
        </Section>

        <Section title="КАК ПРАВИЛЬНО ПИСАТЬ">
          <div style={{ display: "grid", gap: 14 }}>
            {skill.howToWrite.map((rule) => (
              <div
                key={rule.bad}
                style={{
                  padding: 16,
                  background: "var(--color-bg-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 800, color: "#b45309", marginBottom: 6 }}>ПЛОХО</div>
                <p style={{ margin: "0 0 10px", fontSize: 14 }}>{rule.bad}</p>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#0f766e", marginBottom: 6 }}>ХОРОШО</div>
                <p style={{ margin: "0 0 10px", fontSize: 14, lineHeight: 1.55 }}>{rule.good}</p>
                <div style={{ fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
                  Почему: {rule.why}
                </div>
                <div style={{ marginTop: 10 }}>
                  <CopyButton label="Copy хороший" text={rule.good} />
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="EXAMPLES · BEFORE → AFTER">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 12,
            }}
          >
            <div style={{ padding: 16, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8, color: "var(--color-text-secondary)" }}>
                BEFORE
              </div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{skill.example.before}</p>
            </div>
            <div style={{ padding: 16, background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
              <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8, color: "#0f766e" }}>AFTER</div>
              <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{skill.example.after}</p>
            </div>
          </div>
        </Section>

        <Section title="РЕЗУЛЬТАТ">
          <p style={{ margin: 0, lineHeight: 1.65 }}>{skill.result}</p>
        </Section>

        <Section title="ОГРАНИЧЕНИЯ">
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {skill.limits.map((item) => (
              <li key={item} style={{ lineHeight: 1.5 }}>
                {item}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="СОВМЕСТИМОСТЬ">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {skill.agents.map((a) => (
              <span
                key={a}
                style={{
                  padding: "6px 10px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-primary)",
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                {a}
              </span>
            ))}
          </div>
        </Section>

        <Section title="RELATED SKILLS">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/ai-skills/${r.slug}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 14px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-bg-primary)",
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                {r.title} <ArrowRight size={14} />
              </Link>
            ))}
          </div>
        </Section>

        <Section title="ДИЗАЙН-СИСТЕМА">
          <p style={{ margin: "0 0 10px", lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
            Skill усиливает агента. Токены и DESIGN.md задают язык продукта — не ломайте их ради «вкуса Skill».
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            <Link
              href="/sandbox/design-system"
              style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}
            >
              Гайд по дизайн-системе →
            </Link>
            <Link
              href="/ai-skills#design-md"
              style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}
            >
              Шаблон DESIGN.md →
            </Link>
          </div>
        </Section>

        <Section title="STACK · RECIPE">
          <p style={{ margin: "0 0 10px", lineHeight: 1.55, color: "var(--color-text-secondary)" }}>
            Входит в <strong>{AI_SKILL_STACK.title}</strong>. Практический порядок — Recipe «{AI_SKILL_RECIPE.title}».
          </p>
          <Link
            href="/ai-skills#recipe"
            style={{ fontWeight: 700, color: "#0f766e", textDecoration: "none" }}
          >
            Открыть Recipe на хабе →
          </Link>
        </Section>
      </div>
    </div>
  );
}
