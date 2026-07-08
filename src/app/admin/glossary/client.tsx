"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Search } from "lucide-react";

const LEVELS = ["survival", "vibe", "modern", "senior", "jargon"];
const LEVEL_LABELS: Record<string, string> = { survival: "Выживание", vibe: "Вайбкодинг", modern: "Современный AI", senior: "Старший", jargon: "Жаргон" };

export default function AdminGlossaryClient({ terms }: any) {
  const router = useRouter();
  const [items, setItems] = useState(terms);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const empty = { term: "", slug: "", definition: "", simpleExplanation: "", example: "", vibeUsage: "", level: "survival", category: "general", relatedTerms: "" };
  const [form, setForm] = useState(empty);

  function startEdit(t: any) { setEditId(t.id); setForm({ term: t.term, slug: t.slug, definition: t.definition, simpleExplanation: t.simpleExplanation || "", example: t.example || "", vibeUsage: t.vibeUsage || "", level: t.level, category: t.category, relatedTerms: t.relatedTerms || "" }); }
  function startNew() { setEditId("new"); setForm(empty); }

  async function save() {
    setSaving(true);
    const url = editId === "new" ? "/api/admin/glossary" : `/api/admin/glossary/${editId}`;
    const method = editId === "new" ? "POST" : "PUT";
    if (!form.slug) form.slug = form.term.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-");
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); }
    setSaving(false);
  }

  async function remove(id: string) { if (!confirm("Удалить?")) return; await fetch(`/api/admin/glossary/${id}`, { method: "DELETE" }); setItems(items.filter((i: any) => i.id !== id)); router.refresh(); }
  async function toggle(id: string, pub: boolean) { await fetch(`/api/admin/glossary/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isPublished: !pub }) }); setItems(items.map((i: any) => i.id === id ? { ...i, isPublished: !pub } : i)); router.refresh(); }

  const filtered = search ? items.filter((i: any) => i.term.toLowerCase().includes(search.toLowerCase()) || i.definition.toLowerCase().includes(search.toLowerCase())) : items;

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div><h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>📖 Глоссарий</h1><p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{items.length} терминов</p></div>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}><Plus size={16} /> Добавить</button>
      </div>

      <div style={{ marginBottom: "var(--space-m)" }}>
        <div style={{ position: "relative", width: 260 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
            style={{ width: "100%", padding: "8px 8px 8px 32px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
      </div>

      {editId && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Термин *</label><input value={form.term} onChange={e => setForm({ ...form, term: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Slug</label><input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          </div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Определение *</label><textarea value={form.definition} onChange={e => setForm({ ...form, definition: e.target.value })} rows={2} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} /></div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Простое объяснение</label><input value={form.simpleExplanation} onChange={e => setForm({ ...form, simpleExplanation: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Пример</label><input value={form.example} onChange={e => setForm({ ...form, example: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Уровень</label><select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>{LEVELS.map(l => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}</select></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Как говорят</label><input value={form.vibeUsage} onChange={e => setForm({ ...form, vibeUsage: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Связанные (slug через запятую)</label><input value={form.relatedTerms} onChange={e => setForm({ ...form, relatedTerms: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving || !form.term} style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: form.term ? "var(--color-accent)" : "var(--color-border)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: form.term ? "pointer" : "default" }}>{saving ? "Сохранение..." : "Сохранить"}</button>
            <button onClick={() => setEditId(null)} style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {filtered.map((t: any) => (
          <div key={t.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", opacity: t.isPublished ? 1 : 0.5 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{t.term}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", marginTop: 2 }}>{t.simpleExplanation || t.definition.slice(0, 80)}</div>
            </div>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)", flexShrink: 0 }}>{LEVEL_LABELS[t.level]}</span>
            <button onClick={() => toggle(t.id, t.isPublished)} style={{ background: "none", border: "none", cursor: "pointer", color: t.isPublished ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 4 }}>{t.isPublished ? <CheckCircle size={14} /> : <XCircle size={14} />}</button>
            <button onClick={() => startEdit(t)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}><Edit size={14} /></button>
            <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
