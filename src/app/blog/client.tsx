"use client";
import { useState, useEffect } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Calendar, User, Tag, ChevronLeft, ChevronRight, MessageCircle, FolderOpen, Rocket, Bookmark } from "lucide-react";

export default function BlogPageClient({ posts, categories, total, page, perPage, currentCat }: any) {
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="blog-layout" style={{ display: "flex", minHeight: "calc(100dvh - 56px)", maxWidth: 1360, margin: "0 auto" }}>
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
          <div style={{ marginTop: "var(--space-m)", paddingTop: "var(--space-m)", borderTop: "1px solid var(--color-border-light)" }}>
            <a href="/blog/bookmarks" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: "var(--radius-s)", color: "var(--color-text-secondary)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 500 }}>
              <Bookmark size={14} />
              Мои закладки
            </a>
            <a href="/blog/suggest" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: "var(--radius-s)", color: "var(--color-accent)", textDecoration: "none", fontSize: "var(--text-s)", fontWeight: 600 }}>
              ✍️ Предложить статью
            </a>
          </div>
        </div>

        {/* Suggest article CTA */}
        <div style={{
          marginTop: "var(--space-xl)", padding: "var(--space-m)", background: "var(--color-accent-light)",
          borderRadius: "var(--radius-m)", border: "1px solid var(--color-accent)", textAlign: "center",
        }}>
          <div style={{ fontWeight: 700, fontSize: "var(--text-s)", color: "var(--color-accent)", marginBottom: 4 }}>✍️ Предложить статью</div>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", marginBottom: "var(--space-s)", lineHeight: 1.5 }}>
            Есть чем поделиться? Напишите статью и мы опубликуем её после модерации.
          </div>
          <a href="/blog/suggest" style={{ display: "inline-block", padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", textDecoration: "none", fontSize: "var(--text-xs)", fontWeight: 600 }}>
            Написать →
          </a>
        </div>
      </aside>

      {/* CENTER — posts */}
      <main style={{ flex: 1, padding: "var(--space-xl) var(--space-l)", maxWidth: 940 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>📝 Блог</h1>
        <div className="mobile-cat-menu" style={{ position: "relative", display: "none" }}>
          <button onClick={() => setMobileCatOpen(!mobileCatOpen)} style={{
            display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)",
            border: "1px solid var(--color-border)", background: "white", cursor: "pointer",
            fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)",
          }}>
            ☰ Категории
          </button>
          {mobileCatOpen && (
            <div style={{
              position: "absolute", top: "100%", right: 0, marginTop: 4, width: 200,
              background: "white", borderRadius: "var(--radius-s)", boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
              border: "1px solid var(--color-border)", zIndex: 50, overflow: "hidden",
            }}>
              <button onClick={() => { router.push("/blog"); setMobileCatOpen(false); }} style={{
                display: "block", width: "100%", padding: "10px 14px", border: "none", background: !currentCat ? "var(--color-accent-light)" : "white",
                color: !currentCat ? "var(--color-accent)" : "var(--color-text-secondary)",
                fontSize: "var(--text-xs)", fontWeight: !currentCat ? 700 : 500, cursor: "pointer", textAlign: "left",
              }}>Все посты</button>
              {categories.map((c: any) => (
                <button key={c.slug} onClick={() => { router.push(`/blog?cat=${c.slug}`); setMobileCatOpen(false); }} style={{
                  display: "block", width: "100%", padding: "10px 14px", border: "none", background: currentCat === c.slug ? "var(--color-accent-light)" : "white",
                  color: currentCat === c.slug ? "var(--color-accent)" : "var(--color-text-secondary)",
                  fontSize: "var(--text-xs)", fontWeight: currentCat === c.slug ? 700 : 500, cursor: "pointer", textAlign: "left",
                }}>{c.name}</button>
              ))}
            </div>
          )}
        </div>
      </div>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-xl)" }}>
          AI-инжиниринг, разработка, дизайн, SEO. Статьи от команды Карты роста.
        </p>

        <div className="blog-grid">
          {posts.map((p: any) => {
            const thumb = p.coverImage
              ? (p.coverImage.includes("/api/og") ? p.coverImage + "&mode=thumb" : p.coverImage)
              : `/api/og?mode=thumb&category=${encodeURIComponent(p.category?.name || "ProektMap")}&seed=${encodeURIComponent(p.slug)}`;
            return (
            <Link key={p.id} href={`/blog/${p.slug}`} className="blog-card" style={{
              display: "flex", flexDirection: "column", background: "white",
              borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit", overflow: "hidden",
            }}>
              <div style={{ width: "100%", aspectRatio: "16 / 9", flexShrink: 0, background: `url("${thumb}") center/cover` }} />
              <div style={{ padding: "var(--space-m)", display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600, alignSelf: "flex-start" }}>{p.category?.name || "Без категории"}</span>
                <h2 style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-l)", fontWeight: 700, margin: 0, lineHeight: 1.25, letterSpacing: "-0.01em" }}>{p.title}</h2>
                <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", lineHeight: 1.6, margin: 0 }}>{p.excerpt}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: "auto", paddingTop: "var(--space-s)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} />{new Date(p.publishedAt).toLocaleDateString("ru")}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {p.viewCount || 0}</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={12} />{p._count?.comments || 0}</span>
                </div>
              </div>
            </Link>
            );
          })}
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
  const [comments, setComments] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/blog/comments/recent").then(r => r.json()).then(d => setComments(d.comments || []));
  }, []);
  if (!comments.length) return (
    <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", lineHeight: 1.6 }}>
      Пока нет комментариев. Будьте первым!
    </div>
  );
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {comments.map((c: any) => (
        <a key={c.id} href={`/blog/${c.post?.slug || "#"}`} style={{ textDecoration: "none", color: "inherit" }}>
          <div style={{ fontSize: "var(--text-xs)", lineHeight: 1.5, color: "var(--color-text-secondary)", marginBottom: 2 }}>
            {c.content.slice(0, 80)}{c.content.length > 80 ? "..." : ""}
          </div>
          <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "flex", gap: 8 }}>
            <span style={{ fontWeight: 600 }}>{c.authorName}</span>
            <span>{new Date(c.createdAt).toLocaleDateString("ru")}</span>
          </div>
        </a>
      ))}
    </div>
  );
}
