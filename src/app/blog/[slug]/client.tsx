"use client";
import ContentHtml from "./content-html";
import { useEffect, useState } from "react";

import { Calendar, User, Tag, Eye, MessageCircle, ArrowLeft, Send, Bookmark, Rocket, Clock, List, Share2, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";

function formatDate(d: string) {
  return new Date(d).toLocaleDateString("ru", { day: "numeric", month: "long", year: "numeric" });
}

export default function PostPageClient({ post, relatedPosts, readMore, isAdmin: serverIsAdmin, readingTime, tocHeadings, linkedSkills, linkedSolutions }: any) {
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    if (serverIsAdmin) { setIsAdmin(true); return; }
    fetch("/api/auth/check").then(r => r.json()).then(d => {
      if (d.role === "admin") setIsAdmin(true);
    });
  }, [serverIsAdmin]);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentForm, setCommentForm] = useState({ authorName: "", authorEmail: "", content: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Impact score
  const [impact, setImpact] = useState({ impactScore: post.impactScore || 0, viewCount: post.viewCount || 0, bookmarkCount: post.bookmarkCount || 0, projectUseCount: post.projectUseCount || 0, likeCount: post.likeCount || 0, dislikeCount: post.dislikeCount || 0 });
  const [userActions, setUserActions] = useState<string[]>([]);
  const [impactLoading, setImpactLoading] = useState(false);
  useEffect(() => {
    fetch(`/api/blog/${post.id}/impact`).then(r => r.json()).then(d => {
      if (d.impactScore !== undefined) {
        setImpact({ impactScore: d.impactScore, viewCount: d.viewCount, bookmarkCount: d.bookmarkCount, projectUseCount: d.projectUseCount, likeCount: d.likeCount || 0, dislikeCount: d.dislikeCount || 0 });
        setUserActions(d.userInteractions || []);
      }
    });
  }, [post.id]);

  async function toggleImpact(type: string) {
    setImpactLoading(true);
    const res = await fetch(`/api/blog/${post.id}/impact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (res.status === 401) { setImpactLoading(false); return; }
    const d = await res.json();
    setImpact({ impactScore: d.impactScore, viewCount: d.viewCount, bookmarkCount: d.bookmarkCount, projectUseCount: d.projectUseCount, likeCount: d.likeCount || 0, dislikeCount: d.dislikeCount || 0 });
    setUserActions(d.userInteractions || []);
    setImpactLoading(false);
  }

  async function submitComment() {
    if (!commentForm.authorName || !commentForm.content) return;
    setSubmitting(true);
    await fetch("/api/blog/comment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...commentForm, postId: post.id }) });
    setSubmitting(false);
    setSubmitted(true);
  }

  const [tocOpen, setTocOpen] = useState(false);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", display: "flex", gap: "var(--space-xl)", alignItems: "flex-start" }}>
      {/* TOC sidebar — desktop */}
      {tocHeadings?.length > 2 && (
        <aside className="blog-toc-sidebar" style={{
          width: 220, minWidth: 180, position: "sticky", top: 80, maxHeight: "calc(100dvh - 120px)", overflowY: "auto",
          padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)",
          fontSize: "var(--text-xs)", lineHeight: 1.6,
        }}>
          <div style={{ fontWeight: 700, marginBottom: "var(--space-s)", display: "flex", alignItems: "center", gap: 6, color: "var(--color-text-secondary)" }}>
            <List size={14} /> Содержание
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {tocHeadings.map((h: any, i: number) => (
              <a key={i} href={`#${h.id}`} style={{
                display: "block", padding: "3px 0 3px " + ((h.level - 1) * 12) + "px",
                color: h.level === 2 ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                textDecoration: "none", fontWeight: h.level === 2 ? 600 : 400,
                borderLeft: h.level === 2 ? "2px solid transparent" : "none",
                transition: "color 0.15s",
              }}
              onMouseEnter={e => (e.target as any).style.color = "var(--color-accent)"}
              onMouseLeave={e => (e.target as any).style.color = h.level === 2 ? "var(--color-text-primary)" : "var(--color-text-secondary)"}
              >{h.text}</a>
            ))}
          </nav>
        </aside>
      )}

      {/* Mobile TOC toggle */}
      {tocHeadings?.length > 2 && (
        <div className="blog-toc-mobile" style={{ display: "none" }}>
          <button onClick={() => setTocOpen(!tocOpen)} style={{
            display: "flex", alignItems: "center", gap: 6, padding: "8px 16px",
            borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)",
            background: "white", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600,
            color: "var(--color-text-secondary)", marginBottom: "var(--space-m)", width: "100%",
          }}>
            <List size={14} /> Содержание {tocOpen ? "▲" : "▼"}
          </button>
          {tocOpen && (
            <nav style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: "var(--space-m)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border)" }}>
              {tocHeadings.map((h: any, i: number) => (
                <a key={i} href={`#${h.id}`} onClick={() => setTocOpen(false)} style={{
                  display: "block", padding: "4px 0 4px " + ((h.level - 1) * 12) + "px",
                  color: h.level === 2 ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                  textDecoration: "none", fontWeight: h.level === 2 ? 600 : 400, fontSize: "var(--text-xs)",
                }}>{h.level === 2 ? "— " : "· "}{h.text}</a>
              ))}
            </nav>
          )}
        </div>
      )}

      {/* Main content column */}
      <div style={{ flex: 1, minWidth: 0 }}>
      <Link href="/blog" style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", textDecoration: "none", marginBottom: "var(--space-l)" }}>
        <ArrowLeft size={14} /> Назад к блогу
      </Link>
      {isAdmin && <a href={`/admin/blog?edit=${post.id}`} style={{ fontSize: "var(--text-xs)", color: "var(--color-accent)", textDecoration: "none", marginLeft: "var(--space-m)" }} title="Редактировать в админке">✏️</a>}

      {post.category && (
        <div style={{ marginBottom: "var(--space-s)" }}>
          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-accent-light)", color: "var(--color-accent)", fontWeight: 600 }}>{post.category.name}</span>
        </div>
      )}

      <h1 className="blog-post-title" style={{ fontFamily: "var(--font-heading)", fontWeight: 800, lineHeight: 1.1, letterSpacing: "-0.02em", marginBottom: "var(--space-m)" }}>{post.title}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", flexWrap: "wrap", marginBottom: "var(--space-xl)", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><User size={14} />{post.author ? <Link href={`/blog/author/${post.author.email}`} style={{ color: "inherit", textDecoration: "none" }}>{post.author.name}</Link> : "Аноним"}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} />{formatDate(post.publishedAt)}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} />≈ {readingTime || 1} мин</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={14} />{post.viewCount}</span>
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={14} />{post.comments?.length || 0}</span>
        {post.tags && post.tags.split(",").map((t: string) => (
          <span key={t} style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>
            <Tag size={10} />{t.trim()}
          </span>
        ))}
        <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
          <button onClick={() => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(post.title);
            window.open(`https://t.me/share/url?url=${url}&text=${title}`, "_blank", "width=600,height=400");
          }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, display: "flex", alignItems: "center", gap: 3, fontSize: 10 }} title="Поделиться в Telegram">
            <span style={{ fontWeight: 700, color: "#2AABEE" }}>TG</span>
          </button>
          <button onClick={() => {
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(post.title);
            window.open(`https://vk.com/share.php?url=${url}&title=${title}`, "_blank", "width=600,height=400");
          }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4, display: "flex", alignItems: "center", gap: 3, fontSize: 10 }} title="Поделиться ВКонтакте">
            <span style={{ fontWeight: 700, color: "#0077FF" }}>VK</span>
          </button>
          <button onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Ссылка скопирована!");
          }} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 4 }} title="Скопировать ссылку">
            <Share2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ fontSize: "var(--text-s)", lineHeight: 1.8, color: "var(--color-text-primary)",  marginBottom: "var(--space-xl)" }}>
        <ContentHtml content={post.content} tocHeadings={tocHeadings} />
      </div>

      {/* Impact Score */}
      <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-l)", marginBottom: "var(--space-xl)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-l)", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)" }}>
            <span style={{ fontSize: 28, lineHeight: 1 }}>{impact.impactScore >= 80 ? '🔥' : impact.impactScore >= 40 ? '⭐' : '💡'}</span>
            <div>
              <div style={{ fontSize: "var(--text-xl)", fontWeight: 800, color: "var(--color-accent)", lineHeight: 1 }}>Impact {impact.impactScore}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>практическая ценность</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--space-l)", fontSize: "var(--text-xs)", color: "var(--color-text-secondary)", flexWrap: "wrap" }}>
            <span title="Просмотры">{'👁'} {impact.viewCount}</span>
            <span title="Сохранения">{'🔖'} {impact.bookmarkCount}</span>
            <span title="Использований в проектах">{'🚀'} {impact.projectUseCount}</span>
          </div>
          <div style={{ display: "flex", gap: "var(--space-s)", marginLeft: "auto" }}>
            <button
              onClick={() => toggleImpact("bookmark")}
              title="Добавить в закладки — сохраняется в Личном кабинете"
              disabled={impactLoading}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "8px 16px", borderRadius: "var(--radius-m)",
                background: userActions.includes("bookmark") ? "var(--color-accent)" : "var(--color-bg-secondary)",
                color: userActions.includes("bookmark") ? "white" : "var(--color-text-secondary)",
                border: userActions.includes("bookmark") ? "none" : "1px solid var(--color-border)",
                fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Bookmark size={14} fill={userActions.includes("bookmark") ? "white" : "none"} />
              {userActions.includes("bookmark") ? "Сохранено" : "Сохранить"}
            </button>
            <button
              onClick={() => toggleImpact("project_use")}
              title="Отметить что использовали этот материал в своём проекте"
              disabled={impactLoading}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "8px 16px", borderRadius: "var(--radius-m)",
                background: userActions.includes("project_use") ? "var(--color-accent)" : "var(--color-bg-secondary)",
                color: userActions.includes("project_use") ? "white" : "var(--color-text-secondary)",
                border: userActions.includes("project_use") ? "none" : "1px solid var(--color-border)",
                fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              <Rocket size={14} />
              {userActions.includes("project_use") ? "Использую" : "Использовал в проекте"}
            </button>
            <button
              onClick={() => toggleImpact("like")}
              disabled={impactLoading}
              title="Понравилась статья"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "8px 12px", borderRadius: "var(--radius-m)",
                background: userActions.includes("like") ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
                color: userActions.includes("like") ? "var(--color-accent)" : "var(--color-text-secondary)",
                border: userActions.includes("like") ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
                fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
              }}
            >
              <ThumbsUp size={14} fill={userActions.includes("like") ? "var(--color-accent)" : "none"} />
              {impact.likeCount > 0 && impact.likeCount}
            </button>
            <button
              onClick={() => toggleImpact("dislike")}
              disabled={impactLoading}
              title="Не понравилась статья"
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "8px 12px", borderRadius: "var(--radius-m)",
                background: userActions.includes("dislike") ? "var(--color-error-light)" : "var(--color-bg-secondary)",
                color: userActions.includes("dislike") ? "var(--color-error)" : "var(--color-text-secondary)",
                border: userActions.includes("dislike") ? "1px solid var(--color-error)" : "1px solid var(--color-border)",
                fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
              }}
            >
              <ThumbsDown size={14} fill={userActions.includes("dislike") ? "var(--color-error)" : "none"} />
            </button>
          </div>
        </div>
      </div>

      {/* Linked Skills & Solutions */}
      {(linkedSkills?.length > 0 || linkedSolutions?.length > 0) && (
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-l)", marginBottom: "var(--space-l)" }}>
          <div style={{ display: "flex", gap: "var(--space-xl)", flexWrap: "wrap" }}>
            {linkedSkills?.length > 0 && (
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "var(--space-s)", textTransform: "uppercase", letterSpacing: "0.05em" }}>⚡ Навыки из статьи</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {linkedSkills.map((s: any) => (
                    <a key={s.slug} href={`/skills/${s.slug}`} style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "6px 12px", borderRadius: "var(--radius-full)",
                      background: "var(--color-accent-light)", color: "var(--color-accent)",
                      fontSize: "var(--text-xs)", fontWeight: 600, textDecoration: "none",
                      border: "1px solid transparent", transition: "border-color 0.15s",
                    }}>{s.title}</a>
                  ))}
                </div>
              </div>
            )}
            {linkedSolutions?.length > 0 && (
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: "var(--text-xs)", fontWeight: 700, color: "var(--color-text-secondary)", marginBottom: "var(--space-s)", textTransform: "uppercase", letterSpacing: "0.05em" }}>🚀 Решения</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {linkedSolutions.map((s: any) => (
                    <a key={s.slug} href={`/solutions/${s.slug}`} style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      padding: "6px 12px", borderRadius: "var(--radius-full)",
                      background: "var(--color-bg-secondary)", color: "var(--color-text-primary)",
                      fontSize: "var(--text-xs)", fontWeight: 500, textDecoration: "none",
                      border: "1px solid var(--color-border)", transition: "border-color 0.15s",
                    }}>{s.title}</a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Related posts */}
      {relatedPosts?.length > 0 && (
        <div style={{ borderTop: "1px solid var(--color-border)", paddingTop: "var(--space-xl)" }}>
          <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-l)" }}>📖 Похожие статьи</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "var(--space-m)" }}>
            {relatedPosts.map((rp: any) => (
              <a key={rp.id} href={`/blog/${rp.slug}`} style={{ padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", textDecoration: "none", color: "inherit" }}>
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
      </div>{/* end main content column */}
    </div>
  );
}
