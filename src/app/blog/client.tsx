"use client";
import { useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, User, Tag, ChevronLeft, ChevronRight, MessageCircle, FolderOpen } from "lucide-react";

export default function BlogPageClient({ posts, categories, total, page, perPage, currentCat }: any) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="blog-layout" style={{ display: "flex", minHeight: "calc(100dvh - 56px)", maxWidth: 1200, margin: "0 auto" }}>
      {/* LEFT SIDEBAR — categories */}
      <aside className="blog-sidebar" style={{
        width: 220, minWidth: 220, padding: "var(--space-xl) var(--space-m)",
        borderRight: "1px solid var(--color-border-light)", position: "sticky", top: 56, height: "calc(100dvh - 56px)", overflowY: "auto",
      }}>
        <h3 style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-m)" }}>
          <FolderOpen size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
          Категории
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <button onClick={() => router.push("/blog")} style={{
            padding: "8px 12px", borderRadius: "var(--radius-s)", border: "none", background: !currentCat ? "var(--color-accent-light)" : "transparent",
            color: !currentCat ? "var(--color-accent)" : "var(--color-text-secondary)", cursor: "pointer", textAlign: "left",
            fontSize: "var(--text-s)", fontWeight: !currentCat ? 700 : 500,
          }}>Все посты</button>
          {categories.map((c: any) => (
            <button key={c.slug} onClick={() => router.push(`/blog?cat=${c.slug}`)} style={{
              padding: "8px 12px", borderRadius: "var(--radius-s)", border: "none", background: currentCat === c.slug ? "var(--color-accent-light)" : "transparent",
              color: currentCat === c.slug ? "var(--color-accent)" : "var(--color-text-secondary)", cursor: "pointer", textAlign: "left",
              fontSize: "var(--text-s)", fontWeight: currentCat === c.slug ? 700 : 500,
            }}>{c.name}</button>
          ))}
        </div>

        {/* Ad banner placeholder */}
        <div style={{
          marginTop: "var(--space-xl)", padding: "var(--space-m)", background: "var(--color-bg-secondary)",
          borderRadius: "var(--radius-m)", border: "1px dashed var(--color-border)", textAlign: "center",
          fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)",
        }}>
          📢 Место для баннера
        </div>
      </aside>

      {/* CENTER — posts */}
      <main style={{ flex: 1, padding: "var(--space-xl) var(--space-l)", maxWidth: 700 }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📝 Блог</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-xl)" }}>
          AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
          {posts.map((p: any) => (
            <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card" style={{
              display: "flex", gap: "var(--space-l)", padding: "var(--space-l)", background: "white",
              borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit",
            }}>
              {/* Cover image placeholder */}
              <div className="blog-card-image" style={{
                width: 160, height: 120, borderRadius: "var(--radius-s)", flexShrink: 0,
                background: p.coverImage ? `url(${p.coverImage}) center/cover` : "linear-gradient(135deg, var(--color-accent-light), var(--color-accent))",
                display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 28, fontWeight: 800,
              }}>
                {!p.coverImage && (p.category?.name || "📝").slice(0, 2)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600 }}>{p.category?.name || "Без категории"}</span>
                </div>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, marginBottom: 4, lineHeight: 1.2, letterSpacing: "-0.01em" }}>{p.title}</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-s)" }}>{p.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={12} />{<Link href={`/blog/author/${p.author?.email}`} style={{color:"inherit",textDecoration:"none"}}>{p.author?.name || "Аноним"}</Link>}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{new Date(p.publishedAt).toLocaleDateString("ru")}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={12} />{(p._count?.comments || 0)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {posts.length === 0 && <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>Пока нет статей</div>}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "var(--space-xl)" }}>
            <button onClick={() => router.push(`/blog?page=${page - 1}${currentCat ? "&cat=" + currentCat : ""}`)} disabled={page <= 1}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
              <ChevronLeft size={14} /> Назад</button>
            <span style={{ display: "flex", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{page} / {totalPages}</span>
            <button onClick={() => router.push(`/blog?page=${page + 1}${currentCat ? "&cat=" + currentCat : ""}`)} disabled={page >= totalPages}
              style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
              Вперёд <ChevronRight size={14} /></button>
          </div>
        )}
      </main>

      {/* RIGHT SIDEBAR — recent comments + ad */}
      <aside className="blog-sidebar" style={{
        width: 260, minWidth: 260, padding: "var(--space-xl) var(--space-m)",
        borderLeft: "1px solid var(--color-border-light)", position: "sticky", top: 56, height: "calc(100dvh - 56px)", overflowY: "auto",
      }}>
        <h3 style={{ fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "var(--space-m)" }}>
          <MessageCircle size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: 6 }} />
          Обсуждения
        </h3>
        <RecentComments />

        <div style={{
          marginTop: "var(--space-xl)", padding: "var(--space-m)", background: "var(--color-accent-light)",
          borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)", textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)", marginBottom: 4 }}>🚀 Карта роста</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-s)" }}>
            AI-инженерный навигатор. Научись создавать проекты с помощью AI.
          </div>
          <Link href="/corporate-website" style={{ display: "inline-block", padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600 }}>
            Попробовать
          </Link>
        </div>
      </aside>
    </div>
  );
}

function RecentComments() {
  // Static placeholder — real data would come from API
  return (
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
      Пока нет комментариев. Будьте первым!
    </div>
  );
}
