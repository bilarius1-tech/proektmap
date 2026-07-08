"use client";
import ImagePicker from "@/components/media/image-picker";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Edit, Trash2, Eye, Send, CheckCircle, XCircle, FileText, ChevronLeft, ChevronRight, User } from "lucide-react";
import dynamic from "next/dynamic";

const RichEditor = dynamic(() => import("@/components/editor/rich-editor"), { ssr: false });

const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: "Черновик", color: "var(--color-text-tertiary)", bg: "var(--color-bg-secondary)" },
  published: { label: "Опубл.", color: "var(--color-accent)", bg: "var(--color-accent-light)" },
  archived: { label: "Архив", color: "var(--color-error)", bg: "var(--color-error-light)" },
};

export default function BlogAdminClient({ posts, categories, authors, pendingComments, total, page, perPage, currentAuthor, editPostId }: any) {
  const router = useRouter();
  const [items, setItems] = useState(posts);
  const [editId, setEditId] = useState<string | null>(null);
  // Auto-open editor if editPostId is provided
  if (editPostId && !editId) {
    const post = posts.find((p: any) => p.id === editPostId);
    if (post) { startEdit(post); }
  }
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"posts" | "comments">("posts");

  const empty = { title: "", slug: "", content: "", excerpt: "", coverImage: "", categoryId: "", tags: "", status: "draft", metaTitle: "", metaDesc: "" };
  const [form, setForm] = useState(empty);
  const totalPages = Math.ceil(total / perPage);

  function startEdit(p: any) {
    setEditId(p.id);
    setForm({ title: p.title, slug: p.slug, content: p.content || "", excerpt: p.excerpt || "", coverImage: p.coverImage || "", categoryId: p.categoryId || "", tags: p.tags || "", status: p.status, metaTitle: p.metaTitle || "", metaDesc: p.metaDesc || "" });
  }
  function startNew() { setEditId("new"); setForm(empty); }

  async function save() {
    setSaving(true);
    const url = editId === "new" ? "/api/admin/blog" : `/api/admin/blog/${editId}`;
    const method = editId === "new" ? "POST" : "PUT";
    if (!form.slug) form.slug = form.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить пост?")) return;
    await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setItems(items.filter((i: any) => i.id !== id));
    router.refresh();
  }

  function goPage(p: number) {
    const params = new URLSearchParams(window.location.search);
    if (p > 1) params.set("page", String(p)); else params.delete("page");
    if (currentAuthor) params.set("author", currentAuthor);
    router.push("/admin/blog?" + params.toString());
  }

  function goAuthor(id: string) {
    const params = new URLSearchParams();
    if (id) params.set("author", id);
    router.push("/admin/blog?" + params.toString());
  }

  const filtered = search ? items.filter((i: any) => i.title.toLowerCase().includes(search.toLowerCase())) : items;

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>📝 Блог</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>
            {total} постов · {categories.length} категорий · {pendingComments} коммент. на модерации
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/admin/blog/settings" style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", textDecoration: "none", fontSize: "var(--text-s)", color: "inherit" }}>⚙️ Настройки</a>
          <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
            <Plus size={16} /> Новый пост
          </button>
        </div>
      </div>

      {/* Toolbar: search + author filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: "var(--space-l)", flexWrap: "wrap", alignItems: "center" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по заголовку..."
          style={{ padding: "8px 14px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", width: 220 }} />
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          <button onClick={() => goAuthor("")} style={{
            padding: "6px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)",
            background: !currentAuthor ? "var(--color-accent)" : "white", color: !currentAuthor ? "white" : "var(--color-text-secondary)",
            fontSize: "var(--text-xs)", cursor: "pointer", fontWeight: !currentAuthor ? 700 : 500,
          }}>Все авторы</button>
          {authors.map((a: any) => (
            <button key={a.id} onClick={() => goAuthor(a.id)} style={{
              padding: "6px 12px", borderRadius: "var(--radius-full)", border: "1px solid var(--color-border)",
              background: currentAuthor === a.id ? "var(--color-accent)" : "white", color: currentAuthor === a.id ? "white" : "var(--color-text-secondary)",
              fontSize: "var(--text-xs)", cursor: "pointer", fontWeight: currentAuthor === a.id ? 700 : 500,
              display: "flex", alignItems: "center", gap: 4,
            }}><User size={12} />{a.name || a.email?.split("@")[0]}</button>
          ))}
        </div>
      </div>

      {/* Editor modal */}
      {editId && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-xl)", background: "white", borderRadius: "var(--radius-xl)", border: "1px solid var(--color-border)", boxShadow: "var(--shadow-l)" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800, marginBottom: "var(--space-l)" }}>{editId === "new" ? "Новый пост" : "Редактирование"}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Заголовок *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Slug</label>
              <div style={{ display: "flex", gap: 4 }}><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ flex: 1, padding: "10px 12px", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
                <button onClick={() => setForm({ ...form, slug: form.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").slice(0, 80) })} style={{ padding: "8px 12px", borderRadius: "var(--radius-s)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", cursor: "pointer", fontSize: "var(--text-xs)" }}>🔗</button></div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Категория</label>
              <select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })} style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="">Без категории</option>{categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Статус</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="draft">Черновик</option><option value="published">Опубликован</option><option value="archived">Архив</option>
              </select></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Теги</label>
              <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          </div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Обложка (URL или /uploads/...)</label>
            <div style={{ display: "flex", gap: 8 }}>
              <ImagePicker value={form.coverImage} onChange={url => setForm({ ...form, coverImage: url })} />
            </div>
          </div>

          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Краткое описание</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2} style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} /></div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Содержание</label>
            <RichEditor content={form.content} onChange={html => setForm({ ...form, content: html })} placeholder="Пишите статью..." /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving || !form.title} style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: "var(--radius-m)", background: form.title ? "var(--color-accent)" : "var(--color-border)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: form.title ? "pointer" : "default" }}>
              <Send size={14} /> {saving ? "Сохранение..." : "Сохранить"}</button>
            <button onClick={() => setEditId(null)} style={{ padding: "12px 24px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      {/* Posts table */}
      <div style={{ background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead><tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
            {["Заголовок", "Автор", "Категория", "Статус", "Дата", ""].map(h => <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {filtered.map((p: any) => {
              const s = STATUS_MAP[p.status] || STATUS_MAP.draft;
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                  <td style={{ padding: "10px 14px" }}>
                    <div style={{ fontWeight: 600, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</div>
                    <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{p.slug?.slice(0, 40)}</div>
                  </td>
                  <td style={{ padding: "10px 14px", fontSize: 11, color: "var(--color-text-secondary)" }}>{p.author?.name || "—"}</td>
                  <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)" }}>{p.category?.name || "—"}</td>
                  <td style={{ padding: "10px 14px" }}><span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 10, background: s.bg, color: s.color }}>{s.label}</span></td>
                  <td style={{ padding: "10px 14px", color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>{new Date(p.publishedAt || p.createdAt).toLocaleDateString("ru")}</td>
                  <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                    <button onClick={() => startEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}><Edit size={14} /></button>
                    <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: "var(--space-xl)" }}>
          <button onClick={() => goPage(page - 1)} disabled={page <= 1}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page <= 1 ? "default" : "pointer", opacity: page <= 1 ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
            <ChevronLeft size={14} /> Назад</button>
          <span style={{ display: "flex", alignItems: "center", fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>{page} / {totalPages}</span>
          <button onClick={() => goPage(page + 1)} disabled={page >= totalPages}
            style={{ display: "flex", alignItems: "center", gap: 4, padding: "8px 14px", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "white", cursor: page >= totalPages ? "default" : "pointer", opacity: page >= totalPages ? 0.4 : 1, fontSize: "var(--text-xs)" }}>
            Вперёд <ChevronRight size={14} /></button>
        </div>
      )}
    </div>
  );
}
