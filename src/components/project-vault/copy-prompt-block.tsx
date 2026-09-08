"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

type Props = {
  text: string;
  accent?: string;
  title?: string;
  description?: string;
};

export default function CopyPromptBlock({
  text,
  accent = "#0f766e",
  title = "Скопировать промпт",
  description = "Вставьте в новый чат Cursor. Замените плейсхолдеры NEW_* на имя, slug и URL нового проекта.",
}: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div
      style={{
        padding: "18px 18px 16px",
        background: "var(--color-bg-primary)",
        border: "1px solid var(--color-border)",
        borderLeft: `4px solid ${accent}`,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 10,
        }}
      >
        <div>
          <strong
            style={{
              display: "block",
              fontFamily: "var(--font-heading)",
              fontSize: 16,
              marginBottom: 4,
            }}
          >
            {title}
          </strong>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              lineHeight: 1.5,
              color: "var(--color-text-secondary)",
              maxWidth: 480,
            }}
          >
            {description}
          </p>
        </div>
        <button
          type="button"
          onClick={copy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
            padding: "10px 14px",
            border: "none",
            cursor: "pointer",
            background: accent,
            color: "#1a2a2a",
            fontWeight: 800,
            fontSize: 13,
            fontFamily: "var(--font-body)",
            borderRadius: "var(--radius-s, 8px)",
          }}
        >
          {copied ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
          {copied ? "Скопировано" : "Скопировать промпт"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          maxHeight: 220,
          overflow: "auto",
          padding: "12px 14px",
          fontSize: 11,
          lineHeight: 1.45,
          background: "var(--color-bg-secondary)",
          border: "1px solid var(--color-border)",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
          color: "var(--color-text-secondary)",
        }}
      >
        {text}
      </pre>
    </div>
  );
}
