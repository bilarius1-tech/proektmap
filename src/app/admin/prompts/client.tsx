"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Prompt {
  id: string; title: string; slug: string; category: string;
  description: string | null; content: string; tags: string;
  useCount: number; isActive: boolean;
}

const CATEGORIES = ["Код", "Деплой", "Дизайн", "SEO", "Право", "AI"];

export default function AdminPromptsClient({ prompts }: { prompts: Prompt[] }) {
  const router = useRouter();
  const [items, setItems] = useState(prompts);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const empty = { title: "", category: "Код", description: "", content: "", tags: "" };

  type FormData = { title: string; category: string; description: string; content: string; tags: string };
  const [form, setForm] = useState<FormData>(empty);

  function startEdit(p: Prompt) { setEditId(p.id); setShowNew(false); setForm({ title: p.title, category: p.category, description: p.description || "", content: p.content, tags: p.tags }); }
  function startNew() { setEditId(null); setShowNew(true); setForm(empty); }

  async function save() {
    setSaving(true);
    const url = editId ? `/api/admin/prompts/${editId}` : "/api/admin/prompts";
    const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); setShowNew(false); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/admin/prompts/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/admin/prompts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !active }) });
    setItems(items.map(i => i.id === id ? { ...i, isActive: !active } : i));
    router.refresh();
  }

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>📚 Библиотека промптов</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{items.length} промптов · форк vibe-coding-cn (22k ⭐)</p>
        </div>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      {(showNew || editId) && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Название</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Категория</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Описание</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Теги (через запятую)</label><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Текст промпта</label><textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>{saving ? "Сохранение..." : "Сохранить"}</button>
            <button onClick={() => { setEditId(null); setShowNew(false); }} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {items.map(p => (
          <div key={p.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", opacity: p.isActive ? 1 : 0.5 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{p.title}</div>
              <div style={{ display: "flex", gap: 8, marginTop: 4, alignItems: "center" }}>
                <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>{p.category}</span>
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{p.useCount} исп.</span>
              </div>
            </div>
            <button onClick={() => toggle(p.id, p.isActive)} style={{ background: "none", border: "none", cursor: "pointer", color: p.isActive ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 6 }}>{p.isActive ? <CheckCircle size={16} /> : <XCircle size={16} />}</button>
            <button onClick={() => startEdit(p)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 6 }}><Pencil size={16} /></button>
            <button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 6 }}><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
