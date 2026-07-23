"use client";

import { useState, useEffect } from "react";

export default function FavoritesIndicator({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    // Re-check on mount and periodically
    fetch("/api/collection").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setCount(d.length);
    });
  }, []);

  return (
    <a href="/dashboard/collection" title="Избранное" style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: "var(--radius-m)",
      border: "1px solid var(--color-border-light)",
      textDecoration: "none", fontSize: 14,
      color: count > 0 ? "var(--color-error)" : "var(--color-text-tertiary)",
      fontWeight: count > 0 ? 700 : 400,
    }}>
      {count > 0 ? "♥" : "♡"}
    </a>
  );
}
