"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export default function CopyTextButton({
  text,
  label = "Копировать",
  accent = "#ea580c",
  variant = "solid",
}: {
  text: string;
  label?: string;
  accent?: string;
  variant?: "solid" | "ghost";
}) {
  const [ok, setOk] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setOk(true);
      window.setTimeout(() => setOk(false), 1800);
    } catch {
      /* ignore */
    }
  }

  const solid = variant === "solid";

  return (
    <button
      type="button"
      onClick={copy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "10px 14px",
        minHeight: 48,
        border: solid ? "none" : `1px solid ${accent}55`,
        cursor: "pointer",
        background: ok ? "rgba(15,184,128,0.14)" : solid ? accent : "var(--color-bg-primary)",
        color: ok ? "#0f766e" : solid ? "#fff" : accent,
        fontWeight: 800,
        fontSize: 13,
        fontFamily: "var(--font-body)",
      }}
    >
      {ok ? <Check size={14} aria-hidden /> : <Copy size={14} aria-hidden />}
      {ok ? "Скопировано" : label}
    </button>
  );
}
