"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, User, Tag, ChevronLeft, ChevronRight } from "lucide-react";

export default function BlogPageClient({ posts, categories, total, page, perPage, currentCat }: any) {
  const router = useRouter();
  const totalPages = Math.ceil(total / perPage);

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📝 Блог</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-l)" }}>
        AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.
      </p>

      {/* Categories */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: "var(--space-xl)" }}>
        <button onClick={() => router.push("/blog")} style={{
          padding: "6px 14px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)",
          background: !currentCat ? "var(--color-accent)" : "white", color: !currentCat ? "white" : "var(--color-text-secondary)",
          fontSize: "var(--text-xs)", cursor: "pointer", fontWeight: !currentCat ? 700 : 500,
        }}>Все</button>
        {categories.map((c: any) => (
          <button key={c.slug} onClick={() => router.push(`/blog?cat=${c.slug}`)} style={{
            padding: "6px 14px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)",
            background: currentCat === c.slug ? "var(--color-accent)" : "white", color: currentCat === c.slug ? "white" : "var(--color-text-secondary)",
            fontSize: "var(--text-xs)", cursor: "pointer", fontWeight: currentCat === c.slug ? 700 : 500,
          }}>{c.name}</button>
        ))}
      </div>

      {/* Posts grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-l)" }}>
        {posts.map((p: any) => (
          <Link key={p.id} href={`/blog/${p.slug}`} style={{
            display: "flex", flexDirection: "column", padding: "var(--space-l)", background: "white",
            borderRadius: "var(--radius-l)", border: "1px solid var(--color-border-light)", textDecoration: "none", color: "inherit",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "var(--space-s)" }}>
              <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600 }}>
                {p.category?.name || "Без категории"}
              </span>
            </div>
            <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-s)", lineHeight: 1.3 }}>{p.title}</h2>
            <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, flex: 1 }}>{p.excerpt}</p>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", marginTop: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={12} />{p.author?.name || "Аноним"}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{new Date(p.publishedAt).toLocaleDateString("ru")}</span>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>Пока нет статей</div>}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "var(--space-xl)" }}>
          <button onClick={() => router.push(`/blog?page=${page-1}${currentCat ? '&cat='+currentCat : ''}`)} disabled={page <= 1}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
            <ChevronLeft size={14} /> Назад
          </button>
          <span style={{ display: "flex", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{page} / {totalPages}</span>
          <button onClick={() => router.push(`/blog?page=${page+1}${currentCat ? '&cat='+currentCat : ''}`)} disabled={page >= totalPages}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
            Вперёд <ChevronRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
