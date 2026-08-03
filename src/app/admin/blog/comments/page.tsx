"use client";

import { useState, useEffect } from "react";
import { Check, X, Trash2, RefreshCw, MessageCircle } from "lucide-react";

export default function CommentsModeration() {
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => { fetchComments(); }, []);

  async function fetchComments() {
    setLoading(true);
    const res = await fetch("/api/admin/blog/comments");
    if (res.ok) setComments(await res.json());
    setLoading(false);
  }

  async function approve(id: string) {
    await fetch("/api/admin/blog/comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "approved" }) });
    setComments(prev => prev.filter(c => c.id !== id));
    setMsg("✅ Одобрено");
    setTimeout(() => setMsg(""), 2000);
  }

  async function reject(id: string) {
    await fetch("/api/admin/blog/comments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "rejected" }) });
    setComments(prev => prev.filter(c => c.id !== id));
    setMsg("❌ Отклонено");
    setTimeout(() => setMsg(""), 2000);
  }

  async function remove(id: string) {
    if (!confirm("Удалить комментарий навсегда?")) return;
    await fetch("/api/admin/blog/comments?id=" + id, { method: "DELETE" });
    setComments(prev => prev.filter(c => c.id !== id));
    setMsg("🗑️ Удалено");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: 0 }}>💬 Модерация комментариев</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{comments.length} ожидают проверки</p>
        </div>
        <button onClick={fetchComments} className="btn btn-ghost" style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <RefreshCw size={14} /> Обновить
        </button>
      </div>

      {msg && <div style={{ padding: "var(--space-s) var(--space-m)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", marginBottom: "var(--space-m)", fontSize: "var(--text-xs)", fontWeight: 600 }}>{msg}</div>}

      {loading ? <div style={{ color: "var(--color-text-tertiary)", textAlign: "center", padding: "var(--space-xl)" }}>Загрузка...</div> :
       comments.length === 0 ? <div style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--color-text-tertiary)" }}>✅ Всё чисто! Комментариев на модерации нет.</div> :
       comments.map(c => (
        <div key={c.id} style={{ padding: "var(--space-l)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", marginBottom: "var(--space-m)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "var(--space-s)" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{c.authorName}</div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{c.authorEmail} · {new Date(c.createdAt).toLocaleDateString("ru")}</div>
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", background: "#fef3c7", padding: "2px 8px", borderRadius: "var(--radius-s)" }}>на модерации</div>
          </div>
          <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "var(--space-s)" }}>{c.content}</div>
          {c.post && (
            <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: "var(--space-s)" }}>
              📝 {c.post.title}
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => approve(c.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 16px", background: "var(--color-accent)", color: "white", border: "none", borderRadius: "var(--radius-m)", cursor: "pointer", fontSize: "var(--text-xs)", fontWeight: 600 }}>
              <Check size={14} /> Одобрить
            </button>
            <button onClick={() => reject(c.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 16px", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", cursor: "pointer", fontSize: "var(--text-xs)" }}>
              <X size={14} /> Отклонить
            </button>
            <button onClick={() => remove(c.id)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 16px", background: "transparent", color: "var(--color-error)", border: "none", cursor: "pointer", fontSize: "var(--text-xs)", marginLeft: "auto" }}>
              <Trash2 size={14} /> Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
