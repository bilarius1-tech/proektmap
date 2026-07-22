"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Search, X, Save, Edit3 } from "lucide-react";

const LEVELS = ["beginner", "intermediate", "advanced"];
const CATEGORIES = ["AI и LLM", "Разработка", "Базы данных", "Git", "Дизайн", "SEO", "SaaS", "Деплой"];

export default function AdminGlossaryClient({ terms: initial }: any) {
  const router = useRouter();
  const [terms] = useState(initial || []);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 20;

  const filtered = terms.filter((t: any) => {
    if (search && !t.term.toLowerCase().includes(search.toLowerCase()) && !t.definition.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    return true;
  });

  const paged = filtered.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filtered.length / perPage);

  function startEdit(t?: any) {
    setEditing(t ? { ...t } : { term: "", slug: "", definition: "", simpleExplanation: "", level: "beginner", category: "AI и LLM", relatedTerms: "", isPublished: true, sortOrder: (terms.length || 0) + 1 });
  }

  function updateField(field: string, value: any) {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    await fetch("/api/admin/glossary", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    router.refresh();
    setEditing(null);
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить термин?")) return;
    await fetch("/api/admin/glossary?id=" + id, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>📖 Глоссарий</h1>
        <button onClick={() => startEdit()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
          <Plus size={14} /> Добавить
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 200px", maxWidth: 300 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input placeholder="Поиск..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", padding: "8px 8px 8px 32px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
          style={{ padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
          <option value="all">Все категории</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", alignSelf: "center" }}>{filtered.length} терминов</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr style={{ borderBottom: "2px solid var(--color-border)" }}>
          {["#","Термин","Категория","Уровень","Опубликован",""].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {paged.map((t: any, i: number) => (
            <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border-light)", cursor: "pointer" }} onClick={() => startEdit(t)}>
              <td style={{ padding: 8 }}>{(page - 1) * perPage + i + 1}</td>
              <td style={{ padding: 8, fontWeight: 600, color: "var(--color-accent)" }}>{t.term}</td>
              <td style={{ padding: 8, color: "var(--color-text-secondary)" }}>{t.category}</td>
              <td style={{ padding: 8 }}>{t.level === "beginner" ? "🟢" : t.level === "intermediate" ? "🟡" : "🔴"}</td>
              <td style={{ padding: 8 }}>{t.isPublished ? "✅" : "⏸️"}</td>
              <td style={{ padding: 8 }} onClick={e => e.stopPropagation()}><button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)" }}><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 24 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            style={{ padding: "8px 16px", borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", cursor: page === 1 ? "default" : "pointer", opacity: page === 1 ? 0.4 : 1, fontWeight: 600, fontSize: "var(--text-xs)" }}>← Назад</button>
          <div style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                style={{ width: 36, height: 36, borderRadius: 0, border: page === i + 1 ? "2px solid var(--color-accent)" : "1px solid var(--color-border)", background: page === i + 1 ? "var(--color-accent-light)" : "var(--color-bg-primary)", color: page === i + 1 ? "var(--color-accent)" : "var(--color-text-secondary)", fontWeight: 700, fontSize: "var(--text-xs)", cursor: "pointer" }}>{i + 1}</button>
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            style={{ padding: "8px 16px", borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", cursor: page === totalPages ? "default" : "pointer", opacity: page === totalPages ? 0.4 : 1, fontWeight: 600, fontSize: "var(--text-xs)" }}>Вперёд →</button>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginLeft: 12 }}>{page} из {totalPages}</span>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.4)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-bg-primary)", borderRadius: 0, maxWidth: 600, width: "90%", maxHeight: "90vh", overflow: "auto", padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editing.id ? "Редактировать" : "Новый термин"}</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 2 }}><Field label="Термин" value={editing.term} onChange={(v: string) => { updateField("term", v); updateField("slug", v.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-+|-+$/g, "")); }} /></div>
                <div style={{ flex: 1 }}><Field label="Slug" value={editing.slug} onChange={(v: string) => updateField("slug", v)} /></div>
              </div>
              <Field label="Определение" value={editing.definition} onChange={(v: string) => updateField("definition", v)} textarea />
              <Field label="Простое объяснение" value={editing.simpleExplanation} onChange={(v: string) => updateField("simpleExplanation", v)} textarea />
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Категория</label>
                  <select value={editing.category || "AI и LLM"} onChange={e => updateField("category", e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Уровень</label>
                  <select value={editing.level} onChange={e => updateField("level", e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
                    <option value="beginner">🟢 Новичок</option>
                    <option value="intermediate">🟡 Практик</option>
                    <option value="advanced">🔴 Продвинутый</option>
                  </select>
                </div>
              </div>
              <Field label="Связанные термины (через запятую)" value={editing.relatedTerms} onChange={(v: string) => updateField("relatedTerms", v)} />
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                  <input type="checkbox" checked={editing.isPublished} onChange={e => updateField("isPublished", e.target.checked)} />
                  ✅ Опубликован
                </label>
              </div>
              <button onClick={save} disabled={saving}
                style={{ marginTop: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: 10, borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
                <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, textarea, type = "text" }: any) {
  const style: any = { width: "100%", padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", outline: "none", boxSizing: "border-box" };
  return (
    <div>
      <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...style, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={style} />
      }
    </div>
  );
}
