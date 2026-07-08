"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Plus, X, Save } from "lucide-react";

export default function SkillsTable({ skills }: { skills: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(skills);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const empty = { title: "", description: "", skillMd: "", difficulty: "easy", xpReward: 15, isPublished: true };
  const [form, setForm] = useState(empty);

  function startEdit(s: any) { setEditId(s.id); setForm({ title: s.title, description: s.description, skillMd: s.skillMd, difficulty: s.difficulty || "easy", xpReward: s.xpReward || 15, isPublished: s.isPublished }); }
  function startNew() { setEditId("new"); setForm(empty); }

  async function save() {
    setSaving(true);
    const url = editId === "new" ? "/api/admin/skills" : `/api/admin/skills/${editId}`;
    const method = editId === "new" ? "POST" : "PUT";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить навык?")) return;
    await fetch(`/api/admin/skills/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
    router.refresh();
  }

  const filtered = search ? items.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.slug.includes(search)) : items;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)", flexWrap: "wrap", gap: 8 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию..."
          style={{ padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", width: 220 }} />
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Добавить навык
        </button>
      </div>

      {(editId) && (
        <div style={{ marginBottom: "var(--space-m)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-m)" }}>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{editId === "new" ? "Новый навык" : "Редактирование"}</div>
            <button onClick={() => setEditId(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={16} /></button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Название *</label>
              <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Описание</label>
              <input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
            </div>
          </div>
          <div style={{ marginBottom: "var(--space-m)" }}>
            <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>SKILL.md (Markdown)</label>
            <textarea value={form.skillMd} onChange={e => setForm({ ...form, skillMd: e.target.value })} rows={8}
              style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", fontFamily: "var(--font-mono)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} />
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={save} disabled={saving || !form.title}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: form.title ? "var(--color-accent)" : "var(--color-border)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: form.title ? "pointer" : "default" }}>
              <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={() => setEditId(null)} style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Название", "Slug", "Описание", "Статус", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "10px 14px", fontWeight: 600 }}>{s.title}</td>
                <td style={{ padding: "10px 14px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--color-text-tertiary)" }}>{s.slug}</td>
                <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)", maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{ padding: "2px 8px", borderRadius: 99, fontSize: 10, background: s.isPublished ? "var(--color-accent-light)" : "var(--color-bg-tertiary)", color: s.isPublished ? "var(--color-accent)" : "var(--color-text-tertiary)" }}>
                    {s.isPublished ? "Опубл." : "Черновик"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                  <button onClick={() => startEdit(s)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}><Edit size={14} /></button>
                  <button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
