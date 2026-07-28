"use client";
import Link from "next/link";
import { ArrowLeft, Bookmark, Calendar, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

export default function BookmarksClient({ bookmarks }: { bookmarks: any[] }) {
  const [items, setItems] = useState(bookmarks);

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к блогу
      </Link>

      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-xxl)", marginBottom: "var(--space-l)", display: "flex", alignItems: "center", gap: 10 }}>
        <Bookmark size={28} /> Мои закладки
      </h1>

      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>
          <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>📑</div>
          <p>У вас пока нет сохранённых статей.</p>
          <p style={{ marginTop: "var(--space-s)" }}>Нажмите <strong>🔖 Сохранить</strong> под любой статьёй, чтобы добавить её сюда.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
          {items.map((bm: any) => {
            const p = bm.post;
            if (!p) return null;
            return (
              <div key={bm.id} style={{ display: "flex", gap: "var(--space-m)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/blog/${p.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ fontSize: 10, color: "var(--color-accent)", marginBottom: 4 }}>{p.category?.name}</div>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, lineHeight: 1.3 }}>{p.title}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 6 }}>{p.excerpt?.slice(0, 120)}</div>
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{formatDate(p.publishedAt)}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} />{p.viewCount}</span>
                  </div>
                </div>
                <button onClick={() => {
                  fetch(`/api/blog/${p.id}/impact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "bookmark" }) });
                  setItems(items.filter(i => i.id !== bm.id));
                }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, alignSelf: "flex-start" }} title="Убрать из закладок">
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
