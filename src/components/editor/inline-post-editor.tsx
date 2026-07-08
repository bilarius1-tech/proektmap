"use client";

import { useState } from "react";
import { X, Save } from "lucide-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const RichEditor = dynamic(() => import("@/components/editor/rich-editor"), { ssr: false });

export default function InlinePostEditor({ post, onClose }: { post: any; onClose: () => void }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: post.title || "",
    content: post.content || "",
    excerpt: post.excerpt || "",
    coverImage: post.coverImage || "",
    tags: post.tags || "",
    status: post.status || "published",
  });

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/blog/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      router.refresh();
      onClose();
    } else {
      alert("Ошибка сохранения");
    }
    setSaving(false);
  }

  return (
    <>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 500 }} onClick={onClose} />
      <div style={{
        position: "fixed", top: "5%", left: "50%", transform: "translateX(-50%)",
        width: "95%", maxWidth: 800, maxHeight: "90vh", overflow: "auto",
        background: "white", borderRadius: "var(--radius-xl)", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        zIndex: 501, padding: "var(--space-xl)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
          <h2 style={{ fontSize: "var(--text-xl)", fontWeight: 800 }}>✏️ Редактирование</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 8 }}><X size={20} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-m)" }}>
          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Заголовок</label>
            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Описание (excerpt)</label>
            <textarea value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} rows={2}
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Теги (через запятую)</label>
            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })}
              style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Содержание</label>
            <RichEditor content={form.content} onChange={(html: string) => setForm({ ...form, content: html })} />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={save} disabled={saving}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "12px 24px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
              <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={onClose} style={{ padding: "12px 24px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      </div>
    </>
  );
}
