"use client";

import Link from "next/link";

export default function TagsClient({ tags }: { tags: { name: string; count: number }[] }) {
  const maxCount = tags[0]?.count || 1;

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>☁️ Теги</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-xl)" }}>
        {tags.length} тегов. Размер = популярность.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-s)", alignItems: "center" }}>
        {tags.map(t => {
          const ratio = t.count / maxCount;
          const size = 12 + Math.round(ratio * 24);
          return (
            <Link key={t.name} href={`/blog?tag=${encodeURIComponent(t.name)}`} style={{
              fontSize: size, fontWeight: 600, color: "var(--color-accent)", textDecoration: "none",
              padding: "4px 12px", borderRadius: "var(--radius-full)", background: "var(--color-accent-light)",
              opacity: 0.5 + ratio * 0.5,
            }}>
              {t.name}
              <span style={{ fontSize: 10, marginLeft: 4, opacity: 0.6 }}>{t.count}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
