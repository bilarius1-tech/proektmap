"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Bookmark, Trash2, Eye, Calendar } from "lucide-react";

export default function CollectionClient({ items, postMap }: { items: any[]; postMap: Record<string, any> }) {
  const [list, setList] = useState(items);

  async function remove(entitySlug: string) {
    await fetch("/api/collection", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ entityType: "blog_post", entitySlug }) });
    setList(list.filter(i => i.entitySlug !== entitySlug));
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/dashboard" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> В личный кабинет
      </Link>
      <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "var(--text-xxl)", marginBottom: "var(--space-l)", display: "flex", alignItems: "center", gap: 10 }}>
        <Bookmark size={28} /> Мои закладки
      </h1>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>
          <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>📑</div>
          <p>У вас пока нет сохранённых статей.</p>
          <p style={{ marginTop: "var(--space-s)" }}>Нажмите <strong>🔖 Сохранить</strong> под любой статьёй в блоге.</p>
          <Link href="/blog" style={{ display: "inline-block", marginTop: "var(--space-m)", padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600 }}>Перейти в блог</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
          {list.map((item: any) => {
            const post = postMap[item.entitySlug];
            if (!post) return null;
            return (
              <div key={item.id} style={{ display: "flex", gap: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={`/blog/${post.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4, lineHeight: 1.3 }}>{post.title}</div>
                    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.5, marginBottom: 6 }}>{post.excerpt?.slice(0, 120)}</div>
                  </Link>
                  <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ru") : ""}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} />{post.viewCount}</span>
                  </div>
                </div>
                <button onClick={() => remove(item.entitySlug)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, alignSelf: "flex-start" }} title="Убрать из закладок">
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
