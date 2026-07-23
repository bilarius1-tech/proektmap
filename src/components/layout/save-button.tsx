"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";

export default function SaveButton({ entityType, entitySlug, isLoggedIn }: {
  entityType: string; entitySlug: string; isLoggedIn: boolean;
}) {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    fetch("/api/collection").then(r => r.json()).then(data => {
      if (Array.isArray(data)) {
        setSaved(data.some((d: any) => d.entityType === entityType && d.entitySlug === entitySlug));
      }
    }).catch(() => {});
  }, [entityType, entitySlug, isLoggedIn]);

  async function toggle() {
    if (!isLoggedIn) return;
    setLoading(true);
    if (saved) {
      await fetch("/api/collection", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entitySlug }),
      });
      setSaved(false);
    } else {
      await fetch("/api/collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, entitySlug }),
      });
      setSaved(true);
    }
    setLoading(false);
  }

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={toggle}
      disabled={loading}
      title={saved ? "Удалить из сохранённого" : "Сохранить в мою карту знаний"}
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        padding: "6px 14px", borderRadius: 0,
        border: saved ? "1px solid #ef4444" : "1px solid var(--color-border)",
        background: saved ? "#fef2f2" : "var(--color-bg-primary)",
        color: saved ? "#ef4444" : "var(--color-text-secondary)",
        cursor: "pointer", fontWeight: 600, fontSize: "var(--text-xs)",
        transition: "all 0.15s",
      }}
    >
      <Heart size={14} fill={saved ? "#ef4444" : "none"} />
      {saved ? "Сохранено" : "Сохранить"}
    </button>
  );
}
