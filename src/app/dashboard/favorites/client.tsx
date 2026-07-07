"use client";

import { Heart, Trash2, ArrowRight } from "lucide-react";
import { useState } from "react";

interface Favorite {
  id: string; decisionId: string; createdAt: string;
  decision: { id: string; title: string; slug: string; stage: { title: string; slug: string } | null };
}

export default function FavoritesClient({ favorites }: { favorites: Favorite[] }) {
  const [items, setItems] = useState(favorites);

  async function remove(decisionId: string) {
    await fetch("/api/favorites", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ decisionId }) });
    setItems(items.filter(i => i.decisionId !== decisionId));
  }

  function goTo(f: Favorite) {
    const stage = f.decision.stage?.slug;
    window.location.href = `/corporate-website${stage ? "?stage=" + stage : ""}#${f.decision.slug}`;
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

  // Group by stage
  const grouped: Record<string, Favorite[]> = {};
  for (const f of items) {
    const key = f.decision.stage?.title || "Без этапа";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>
        <Heart size={22} style={{ display: "inline", color: "var(--color-error)", marginRight: 8, verticalAlign: "middle" }} />
        Избранное
        <span style={{ fontSize: "var(--text-s)", fontWeight: 400, color: "var(--color-text-tertiary)", marginLeft: 8 }}>{items.length}</span>
      </h1>

      {Object.entries(grouped).map(([stageTitle, favs]) => (
        <div key={stageTitle} style={{ marginBottom: "var(--space-l)" }}>
          <div style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "var(--space-s)" }}>
            {stageTitle}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
            {favs.map(f => (
              <div key={f.id} onClick={() => goTo(f)} style={{
                display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)",
                background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", cursor: "pointer",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 2 }}>{f.decision.title}</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    {new Date(f.createdAt).toLocaleDateString("ru")}
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); remove(f.decisionId); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 6 }}>
                  <Trash2 size={14} />
                </button>
                <ArrowRight size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
