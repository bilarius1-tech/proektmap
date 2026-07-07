"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, CheckCircle, XCircle } from "lucide-react";

interface Variable {
  id: string; name: string; label: string; description: string;
  example: string; category: string; sortOrder: number; isActive: boolean;
}

const CATEGORIES = ["общее", "код", "деплой", "дизайн", "seo", "право", "ai"];

type FormData = { name: string; label: string; description: string; example: string; category: string };

export default function AdminVarsClient({ variables }: { variables: Variable[] }) {
  const router = useRouter();
  const [items, setItems] = useState(variables);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const empty: FormData = { name: "", label: "", description: "", example: "", category: "общее" };
  const [form, setForm] = useState<FormData>(empty);

  function startEdit(v: Variable) { setEditId(v.id); setShowNew(false); setForm({ name: v.name, label: v.label, description: v.description, example: v.example, category: v.category }); }
  function startNew() { setEditId(null); setShowNew(true); setForm(empty); }

  async function save() {
    setSaving(true);
    const url = editId ? `/api/admin/prompt-vars/${editId}` : "/api/admin/prompt-vars";
    const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); setShowNew(false); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить переменную?")) return;
    await fetch(`/api/admin/prompt-vars/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/admin/prompt-vars/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !active }) });
    setItems(items.map(i => i.id === id ? { ...i, isActive: !active } : i));
    router.refresh();
  }

  const cats = CATEGORIES;

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>🔤 Переменные промптов</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{items.length} переменных · подсказки для новичков</p>
        </div>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      {(showNew || editId) && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Имя ({"{{name}}"})</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="project" style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Категория</label><select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>{cats.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
          </div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Название (как показывать)</label><input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} placeholder="Название проекта" style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Описание</label><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} /></div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Пример</label><input value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} placeholder="Сайт стоматологии ДентаЛюкс" style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>{saving ? "Сохранение..." : "Сохранить"}</button>
            <button onClick={() => { setEditId(null); setShowNew(false); }} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {items.map(v => (
          <div key={v.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", opacity: v.isActive ? 1 : 0.5 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <code style={{ background: "var(--color-accent-light)", padding: "1px 6px", borderRadius: 4, fontWeight: 700, color: "var(--color-accent)", fontSize: 11 }}>{"{{" + v.name + "}}"}</code>
                <span style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{v.label}</span>
              </div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: 2 }}>{v.description} {v.example && <span style={{ color: "var(--color-accent)" }}>Пример: {v.example}</span>}</div>
            </div>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)", flexShrink: 0 }}>{v.category}</span>
            <button onClick={() => toggle(v.id, v.isActive)} style={{ background: "none", border: "none", cursor: "pointer", color: v.isActive ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 6 }}>{v.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}</button>
            <button onClick={() => startEdit(v)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 6 }}><Pencil size={14} /></button>
            <button onClick={() => remove(v.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 6 }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
