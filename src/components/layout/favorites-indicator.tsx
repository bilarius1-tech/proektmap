"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function FavoritesIndicator({ initialCount }: { initialCount: number }) {
  const { status } = useSession();
  const [count, setCount] = useState(initialCount);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/collection")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (Array.isArray(d)) setCount(d.length);
      })
      .catch(() => {});
  }, [status]);

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
