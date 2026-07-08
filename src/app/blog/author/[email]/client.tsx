"use client";

import Link from "next/link";
import { Calendar, Tag, ArrowLeft, User } from "lucide-react";

export default function AuthorPageClient({ author, posts }: any) {
  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-xl)" }}>
        <ArrowLeft size={14} /> Назад к блогу
      </Link>

      {/* Author card */}
      <div style={{
        display: "flex", gap: "var(--space-l)", padding: "var(--space-xl)", background: "white",
        borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border-light)", marginBottom: "var(--space-xl)",
        alignItems: "center", flexWrap: "wrap",
      }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%", flexShrink: 0,
          background: author.avatar ? `url(${author.avatar}) center/cover` : "var(--color-accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "white", fontSize: 28, fontWeight: 800,
        }}>
          {!author.avatar && (author.name || author.email).slice(0, 2).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: 4 }}>{author.name || author.email}</h1>
          {author.bio && <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{author.bio}</p>}
          <div style={{ display: "flex", gap: "var(--space-m)", marginTop: "var(--space-s)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            <span>{posts.length} постов</span>
            <span>{author.xp} XP</span>
          </div>
        </div>
      </div>

      {/* Posts list */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-l)" }}>Посты автора</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {posts.map((p: any) => (
          <Link key={p.id} href={`/blog/${p.slug}`} style={{
            display: "flex", gap: "var(--space-l)", padding: "var(--space-l)", background: "white",
            borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", textDecoration: "none", color: "inherit",
          }}>
            <div style={{
              width: 100, height: 80, borderRadius: "var(--radius-m)", flexShrink: 0,
              background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
              display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 18, fontWeight: 800,
            }}>
              {!p.coverImage && (p.category?.name || "📝").slice(0, 2)}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, color: "var(--color-accent)", marginBottom: 4 }}>{p.category?.name}</div>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)", marginBottom: 4 }}>{p.title}</div>
              <div style={{ display: "flex", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{new Date(p.publishedAt).toLocaleDateString("ru")}</span>
                <span>{p.viewCount} просмотров</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>Пока нет постов</div>}
    </div>
  );
}
