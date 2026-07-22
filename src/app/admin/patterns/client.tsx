"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Search, X, Save, Edit3 } from "lucide-react";

const CATEGORIES = ["Сайты и лендинги", "SaaS и сервисы", "Боты и автоматизация", "Игры", "Мобильные приложения"];

export default function AdminPatternsClient({ patterns: initial }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const filtered = (initial || []).filter((p: any) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
    return true;
  });

  function startEdit(p?: any) {
    setEditing(p ? { ...p } : {
      title: "", slug: "", category: "Сайты и лендинги", description: "", difficulty: "beginner",
      timeToBuild: "2 дня", outcome: "{}", entities: "[]", stack: "[]", architecture: "[]",
      evolution: "[]", mistakes: "[]", isPublished: false, isFeatured: false, sortOrder: (initial?.length || 0) + 1
    });
  }

  function updateField(field: string, value: any) {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    await fetch("/api/admin/patterns", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    router.refresh();
    setEditing(null);
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить паттерн?")) return;
    await fetch("/api/admin/patterns?id=" + id, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>📦 Паттерны сборки</h1>
        <button onClick={() => startEdit()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
          <Plus size={14} /> Добавить
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
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
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", alignSelf: "center" }}>{filtered.length} из {(initial || []).length}</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr style={{ borderBottom: "2px solid var(--color-border)" }}>
          {["#","Название","Категория","Сложность","Срок","Опубликован","Избранный",""].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {filtered.map((p: any, i: number) => (
            <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border-light)", cursor: "pointer" }} onClick={() => startEdit(p)}>
              <td style={{ padding: 8 }}>{i + 1}</td>
              <td style={{ padding: 8, fontWeight: 600, color: "var(--color-accent)" }}>{p.title}</td>
              <td style={{ padding: 8, color: "var(--color-text-secondary)" }}>{p.category || "—"}</td>
              <td style={{ padding: 8 }}>{p.difficulty === "beginner" ? "🟢" : p.difficulty === "intermediate" ? "🟡" : "🔴"}</td>
              <td style={{ padding: 8, color: "var(--color-text-secondary)" }}>{p.timeToBuild}</td>
              <td style={{ padding: 8 }}>{p.isPublished ? "✅" : "⏸️"}</td>
              <td style={{ padding: 8 }}>{p.isFeatured ? "⭐" : "—"}</td>
              <td style={{ padding: 8 }} onClick={e => e.stopPropagation()}><button onClick={() => remove(p.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)" }}><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.4)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-bg-primary)", borderRadius: 0, maxWidth: 700, width: "90%", maxHeight: "90vh", overflow: "auto", padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editing.id ? "Редактировать" : "Новый паттерн"}</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Field label="Название" value={editing.title} onChange={(v: string) => updateField("title", v)} style={{ flex: 2 }} />
                <Field label="Slug" value={editing.slug} onChange={(v: string) => updateField("slug", v)} style={{ flex: 1 }} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Категория</label>
                  <select value={editing.category || ""} onChange={e => updateField("category", e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Сложность</label>
                  <select value={editing.difficulty} onChange={e => updateField("difficulty", e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
                    <option value="beginner">🟢 Новичок</option>
                    <option value="intermediate">🟡 Практик</option>
                    <option value="advanced">🔴 Профи</option>
                  </select>
                </div>
                <Field label="Срок" value={editing.timeToBuild} onChange={(v: string) => updateField("timeToBuild", v)} style={{ flex: 1 }} />
              </div>
              <Field label="Описание" value={editing.description} onChange={(v: string) => updateField("description", v)} textarea />
              <Field label="Outcome (JSON)" value={editing.outcome} onChange={(v: string) => updateField("outcome", v)} textarea />
              <Field label="Стек (JSON)" value={editing.stack} onChange={(v: string) => updateField("stack", v)} textarea />
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {["isPublished","isFeatured"].map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                    <input type="checkbox" checked={editing[f]} onChange={e => updateField(f, e.target.checked)} />
                    {f === "isPublished" ? "✅ Опубликован" : "⭐ Избранный"}
                  </label>
                ))}
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

function Field({ label, value, onChange, textarea, type = "text", style: extraStyle }: any) {
  const baseStyle: any = { width: "100%", padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)", outline: "none", boxSizing: "border-box", ...extraStyle };
  return (
    <div style={extraStyle ? { flex: extraStyle.flex } : {}}>
      <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} rows={3} style={{ ...baseStyle, resize: "vertical" }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} style={baseStyle} />
      }
    </div>
  );
}
