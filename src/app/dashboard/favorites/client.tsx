"use client";

import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Favorite {
  id: string; decisionId: string; createdAt: string;
  decision: { id: string; title: string; slug: string; stage: { title: string; slug: string } | null };
}

export default function FavoritesClient({ favorites }: { favorites: Favorite[] }) {
  const router = useRouter();
  const [items, setItems] = useState(favorites);

  async function remove(decisionId: string) {
    await fetch("/api/favorites", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decisionId }) });
    setItems(items.filter(i => i.decisionId !== decisionId));
  }

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: 600, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", textAlign: "center" }}>
        <Heart size={40} style={{ color: "var(--color-text-tertiary)", marginBottom: "var(--space-m)" }} />
        <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: 8 }}>Избранное пусто</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
          Нажимайте ♡ на карточках решений чтобы сохранять их здесь.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>
        <Heart size={22} style={{ display: "inline", color: "var(--color-error)", marginRight: 8 }} />
        Избранное
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {items.map(f => (
          <div key={f.id} style={{
            display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)",
            background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{f.decision.title}</div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                {f.decision.stage?.title || ""} · {new Date(f.createdAt).toLocaleDateString("ru")}
              </div>
            </div>
            <button onClick={() => router.push(`/corporate-website?stage=${f.decision.stage?.slug}`)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-accent)", padding: 6 }}>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => remove(f.decisionId)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 6 }}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
