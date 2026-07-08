"use client";

import { useState } from "react";
import { Calendar, User, Tag, Eye, MessageCircle, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

export default function PostPageClient({ post, relatedPosts, readMore }: any) {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentForm, setCommentForm] = useState({ authorName: "", authorEmail: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function submitComment() {
    if (!commentForm.authorName || !commentForm.content) return;
    setSubmitting(true);
    await fetch("/api/blog/comment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...commentForm, postId: post.id }) });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div style={{ maxWidth: 760, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к блогу
      </Link>

      {post.category && (
        <div style={{ marginBottom: "var(--space-s)" }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600 }}>{post.category.name}</span>
        </div>
      )}

      <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, lineHeight: 1.2, marginBottom: "var(--space-m)" }}>{post.title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", flexWrap: "wrap", marginBottom: "var(--space-xl)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={14} />{post.author ? <Link href={`/blog/author/${post.author.email}`} style={{ color: "inherit", textDecoration: "none" }}>{post.author.name}</Link> : "Аноним"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} />{formatDate(post.publishedAt)}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={14} />{post.viewCount}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={14} />{post.comments?.length || 0}</span>
        {post.tags && post.tags.split(",").map((t: string) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>
            <Tag size={10} />{t.trim()}
          </span>
        ))}
      </div>

      <div style={{ fontSize: "var(--text-s)", lineHeight: 1.9, color: "var(--color-text-primary)", whiteSpace: "pre-wrap", marginBottom: "var(--space-xl)" }}>
        {post.content}
      </div>

      {/* Related posts */}
      {relatedPosts?.length > 0 && (
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xl)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-l)" }}>📖 Похожие статьи</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-m)" }}>
            {relatedPosts.map((rp: any) => (
              <a key={rp.id} href={`/blog/${rp.slug}`} style={{ padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", textDecoration: "none", color: "inherit" }}>
                <div style={{ fontSize: 10, color: "var(--color-accent)", marginBottom: 4 }}>{rp.category?.name}</div>
                <div style={{ fontWeight: 600, fontSize: "var(--text-s)", lineHeight: 1.4 }}>{rp.title}</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Read more */}
      {readMore && (
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xl)", marginTop: "var(--space-xl)", textAlign: "center" }}>
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Читать дальше</div>
          <a href={`/blog/${readMore.slug}`} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: 4, color: "var(--color-accent)" }}>{readMore.title}</div>
            <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>{readMore.excerpt?.slice(0, 150)}</div>
          </a>
        </div>
      )}

      {/* Comments */}
      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xl)", marginTop: "var(--space-xl)" }}>
        <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-l)" }}>Комментарии ({post.comments?.length || 0})</h2>
        {post.comments?.map((c: any) => (
          <div key={c.id} style={{ padding: "var(--space-m)", marginBottom: "var(--space-s)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "var(--text-xs)" }}>
              <span style={{ fontWeight: 700 }}>{c.authorName}</span>
              <span style={{ color: "var(--color-text-tertiary)" }}>{formatDate(c.createdAt)}</span>
            </div>
            <div style={{ fontSize: "var(--text-xs)", lineHeight: 1.6 }}>{c.content}</div>
            {c.replies?.map((r: any) => (
              <div key={r.id} style={{ marginTop: "var(--space-s)", marginLeft: "var(--space-l)", padding: "var(--space-s)", background: "white", borderRadius: "var(--radius-s)", fontSize: "var(--text-xs)" }}>
                <div style={{ fontWeight: 700, marginBottom: 2 }}>{r.authorName}</div>
                <div>{r.content}</div>
              </div>
            ))}
          </div>
        ))}

        {!submitted ? (
          <div style={{ marginTop: "var(--space-l)" }}>
            {!showCommentForm ? (
              <button onClick={() => setShowCommentForm(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
                <MessageCircle size={14} /> Написать комментарий
              </button>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
                <input value={commentForm.authorName} onChange={e => setCommentForm({ ...commentForm, authorName: e.target.value })} placeholder="Ваше имя *" style={{ padding: "10px 12px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", fontSize: "var(--text-s)" }} />
                <input value={commentForm.authorEmail} onChange={e => setCommentForm({ ...commentForm, authorEmail: e.target.value })} placeholder="Email (не публикуется)" style={{ padding: "10px 12px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", fontSize: "var(--text-s)" }} />
                <textarea value={commentForm.content} onChange={e => setCommentForm({ ...commentForm, content: e.target.value })} placeholder="Ваш комментарий *" rows={4} style={{ padding: "10px 12px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", fontSize: "var(--text-s)", resize: "vertical" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={submitComment} disabled={submitting || !commentForm.authorName || !commentForm.content} style={{ display: "flex", alignItems: "center", gap: 4, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
                    <Send size={14} /> {submitting ? "Отправка..." : "Отправить"}
                  </button>
                  <button onClick={() => setShowCommentForm(false)} style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", borderRadius: "var(--radius-m)", fontSize: "var(--text-s)", fontWeight: 600, color: "var(--color-accent)", marginTop: "var(--space-l)" }}>
            ✅ Спасибо! Комментарий отправлен на модерацию.
          </div>
        )}
      </div>
    </div>
  );
}
