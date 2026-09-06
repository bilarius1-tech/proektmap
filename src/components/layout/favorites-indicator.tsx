"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FavoritesIndicator({ initialCount }: { initialCount: number }) {
  const { status } = useSession();
  const [count, setCount] = useState(initialCount);

  function refresh() {
    if (status !== "authenticated") return;
    fetch("/api/collection")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setCount(d.length);
      })
      .catch(() => {});
  }

  useEffect(() => {
    refresh();
    function onChanged() {
      refresh();
    }
    window.addEventListener("collection:changed", onChanged);
    return () => window.removeEventListener("collection:changed", onChanged);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  if (status !== "authenticated") return null;

  const active = count > 0;

  return (
    <a
      href="/dashboard/collection"
      title="Мои закладки"
      aria-label={`Закладки${active ? `: ${count}` : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "var(--radius-m)",
        border: "1px solid var(--color-border-light)",
        textDecoration: "none",
        fontSize: "var(--text-s)",
        color: active ? "var(--color-error, #ef4444)" : "var(--color-text-tertiary)",
        fontWeight: active ? 700 : 400,
        position: "relative",
      }}
    >
      {active ? "♥" : "♡"}
      {active && (
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 16,
            height: 16,
            padding: "0 4px",
            borderRadius: 999,
            background: "var(--color-error, #ef4444)",
            color: "#fff",
            fontSize: 10,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: 1,
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </a>
  );
}
