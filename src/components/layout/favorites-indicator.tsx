"use client";

import { useState, useEffect } from "react";

export default function FavoritesIndicator({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    fetch("/api/collection").then(r => r.json()).then(d => {
      if (Array.isArray(d)) setCount(d.length);
    });
  }, []);

  const active = count > 0;

  return (
    <a
      href="/dashboard/collection"
      title="Избранное"
      className={`flex items-center justify-center w-[36px] h-[36px] rounded-m border border-border-light no-underline text-s ${
        active ? "text-error font-bold" : "text-text-tertiary"
      }`}
    >
      {active ? "♥" : "♡"}
    </a>
  );
}
