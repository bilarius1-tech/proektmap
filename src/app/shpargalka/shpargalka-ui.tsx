"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Check, Copy, MessageSquareText, Route, Wand2 } from "lucide-react";
import { SHPARGALKA_TEACHING, getPack, type ShpargalkaPrompt } from "@/lib/shpargalka";
import { PACK_ICONS } from "./pack-icons";

export function chipStyle(active: boolean): CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "8px 14px",
    minHeight: 44,
    border: active ? "2px solid #0f766e" : "1px solid var(--color-border)",
    background: active ? "rgba(15,118,110,0.1)" : "var(--color-bg-primary)",
    color: active ? "#0f766e" : "var(--color-text-secondary)",
    fontWeight: 700,
    fontSize: 13,
    cursor: "pointer",
    fontFamily: "var(--font-body)",
  };
}

export function CopyButton({ text, label = "Копировать" }: { text: string; label?: string }) {
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
        minHeight: 40,
        border: "1px solid #0f766e",
        background: ok ? "rgba(15,184,128,0.12)" : "var(--color-bg-primary)",
        color: ok ? "#0f766e" : "#0f766e",
        fontSize: 13,
        fontWeight: 700,
        cursor: "pointer",
        fontFamily: "var(--font-body)",
      }}
    >
      {ok ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {ok ? "Скопировано" : label}
    </button>
  );
}

export function ContourScheme() {
  const card = (
    href: string,
    icon: ReactNode,
    title: string,
    when: string,
  ) => (
    <Link
      href={href}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 16,
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-primary)",
        textDecoration: "none",
        color: "inherit",
        minHeight: 140,
      }}
    >
      <div style={{ color: "#0f766e" }}>{icon}</div>
      <div style={{ fontWeight: 800, fontSize: 15 }}>{title}</div>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>{when}</p>
    </Link>
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))",
        gap: 12,
      }}
    >
      {card("/shpargalka", <MessageSquareText size={22} aria-hidden />, "Чат за 2 минуты", "Готовый шаблон: скопировали, подставили скобки, отправили в ChatGPT.")}
      {card("/ai-skills", <Wand2 size={22} aria-hidden />, "Skill для агента", "Нужны вкус, правила и установка пакета — не один промпт.")}
      {card("/resheniya", <Route size={22} aria-hidden />, "Готовый маршрут", "Хотите продукт с этапами и проверкой, а не черновик в чате.")}
    </div>
  );
}

export function TeachingBlock() {
  const { howToWrite, example, adaptTemplate } = SHPARGALKA_TEACHING;
  return (
    <section
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-primary)",
        padding: 20,
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.04em", color: "#0f766e", marginBottom: 8 }}>
        КАК ПОЛЬЗОВАТЬСЯ ШАБЛОНОМ
      </div>
      <h2 style={{ margin: "0 0 16px", fontFamily: "var(--font-heading)", fontSize: 22, fontWeight: 800 }}>
        Плохой запрос ломает даже хороший шаблон
      </h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div style={{ padding: 14, background: "#fef2f2", borderLeft: "3px solid #991b1b" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#991b1b", marginBottom: 6 }}>ПЛОХО</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{howToWrite.bad}</p>
        </div>
        <div style={{ padding: 14, background: "#ecfdf5", borderLeft: "3px solid #0f766e" }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: "#0f766e", marginBottom: 6 }}>ХОРОШО</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{howToWrite.good}</p>
        </div>
      </div>
      <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--color-text-secondary)", lineHeight: 1.55 }}>
        Почему: {howToWrite.why}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: 12,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-text-tertiary)", marginBottom: 6 }}>БЫЛО</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55, color: "var(--color-text-secondary)" }}>{example.before}</p>
        </div>
        <div>
          <div style={{ fontSize: 11, fontWeight: 800, color: "var(--color-text-tertiary)", marginBottom: 6 }}>СТАЛО</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.55 }}>{example.after}</p>
        </div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Копируемый шаблон: как адаптировать любой промпт из каталога</div>
        <CopyButton text={adaptTemplate} label="Копировать адаптацию" />
      </div>
    </section>
  );
}

export function PromptCard({ prompt }: { prompt: ShpargalkaPrompt }) {
  const [open, setOpen] = useState(false);
  const [showBad, setShowBad] = useState(false);
  const pack = getPack(prompt.pack);
  const Icon = pack ? PACK_ICONS[pack.icon] : null;

  return (
    <article
      style={{
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-primary)",
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        {pack && (
          <Link
            href={`/shpargalka/${pack.slug}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 8px",
              background: "rgba(15,118,110,0.1)",
              color: "#0f766e",
              fontSize: 11,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            {Icon ? <Icon size={12} aria-hidden /> : null}
            {pack.title}
          </Link>
        )}
        <span
          style={{
            padding: "3px 8px",
            background: "var(--color-bg-secondary)",
            color: "var(--color-text-secondary)",
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {prompt.task}
        </span>
      </div>
      <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em", lineHeight: 1.3 }}>
        {prompt.title}
      </h3>
      <pre
        style={{
          margin: 0,
          padding: 12,
          background: "#0f172a",
          color: "#e2e8f0",
          fontSize: 12.5,
          lineHeight: 1.55,
          whiteSpace: "pre-wrap",
          maxHeight: open ? 480 : 132,
          overflow: "auto",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        }}
      >
        {prompt.body}
      </pre>
      <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: "var(--color-text-secondary)" }}>
        {prompt.why}
      </p>
      {prompt.bad && (
        <div>
          <button
            type="button"
            onClick={() => setShowBad((v) => !v)}
            style={{
              border: "none",
              background: "none",
              padding: 0,
              color: "#991b1b",
              fontSize: 12,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {showBad ? "Скрыть плохой запрос" : "Показать плохой запрос"}
          </button>
          {showBad && (
            <p style={{ margin: "6px 0 0", fontSize: 13, color: "#991b1b" }}>{prompt.bad}</p>
          )}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 4 }}>
        <CopyButton text={prompt.body} />
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          style={{
            ...chipStyle(false),
            minHeight: 40,
            fontWeight: 600,
          }}
        >
          {open ? "Свернуть" : "Показать целиком"}
        </button>
        {prompt.relatedHref && (
          <Link
            href={prompt.relatedHref}
            style={{ fontSize: 13, fontWeight: 700, color: "#0f766e", textDecoration: "none" }}
          >
            {prompt.relatedLabel || "Дальше в ProektMap"} →
          </Link>
        )}
      </div>
    </article>
  );
}
