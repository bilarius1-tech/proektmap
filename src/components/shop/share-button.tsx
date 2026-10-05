"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

export default function ShareButton({ title, text }: { title: string; text: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    const payload = { title, text, url };
    if (navigator.share) {
      try {
        await navigator.share(payload);
        return;
      } catch {
        return;
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={share}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 14px",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
        fontWeight: 700,
        cursor: "pointer",
        minHeight: 44,
      }}
    >
      <Share2 size={16} />
      {copied ? "Ссылка скопирована" : "Поделиться"}
    </button>
  );
}
