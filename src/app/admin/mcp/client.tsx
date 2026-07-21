"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Search, X, Save } from "lucide-react";

export default function AdminMCPClient({ servers: initial }: any) {
  const router = useRouter();
  const [servers] = useState(initial || []);
  const [scanning, setScanning] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const filtered = servers.filter((s: any) => {
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !(s.category||"").toLowerCase().includes(search.toLowerCase())) return false;
    if (categoryFilter !== "all" && s.category !== categoryFilter) return false;
    return true;
  });

  const categories = [...new Set(servers.map((s: any) => s.category))];

  async function scanGitHub() {
    if (!confirm("Сканировать GitHub (30 сек)?")) return;
    setScanning(true);
    try {
      const res = await fetch("/api/admin/mcp/parse-github", { method: "POST" });
      const data = await res.json();
      if (data.log) alert(data.log.join(String.fromCharCode(10)));
      else if (data.error) alert("Ошибка: " + data.error);
      router.refresh();
    } catch(e: any) { alert("Ошибка: " + e.message); }
    setScanning(false);
  }

  function startEdit(s?: any) {
    setEditing(s ? { ...s } : { name: "", slug: "", category: "", description: "", longDescription: "", tags: "", stars: 0, rating: 7, difficulty: "easy", russianDocs: false, requiresApiKey: false, isActive: true, isFeatured: false, pros: "[]", cons: "[]", howToUse: "[]" });
  }

  function updateField(field: string, value: any) {
    setEditing((prev: any) => ({ ...prev, [field]: value }));
  }

  async function save() {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    await fetch("/api/admin/mcp", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    router.refresh();
    setEditing(null);
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить?")) return;
    await fetch("/api/admin/mcp?id=" + id, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>🔌 MCP-серверы</h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => startEdit()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
            <Plus size={14} /> Добавить
          </button>
          <button onClick={scanGitHub} disabled={scanning}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "#24292e", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
            {scanning ? "⏳ Сканирую..." : "🔍 GitHub"}
          </button>
        </div>
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
          {categories.map((c: any) => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)", alignSelf: "center" }}>{filtered.length} из {servers.length}</span>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead><tr style={{ borderBottom: "2px solid var(--color-border)" }}>
          {["#","Сервер","Категория","⭐","Рейтинг","🇷🇺","Активен",""].map(h => <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{h}</th>)}
        </tr></thead>
        <tbody>
          {filtered.map((s: any, i: number) => (
            <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)", cursor: "pointer" }} onClick={() => startEdit(s)}>
              <td style={{ padding: 8 }}>{i + 1}</td>
              <td style={{ padding: 8, fontWeight: 600, color: "var(--color-accent)" }}>{s.name}</td>
              <td style={{ padding: 8 }}>{s.category}</td>
              <td style={{ padding: 8 }}>{s.stars}</td>
              <td style={{ padding: 8 }}>{s.rating}/10</td>
              <td style={{ padding: 8 }}>{s.russianDocs ? "✅" : "—"}</td>
              <td style={{ padding: 8 }}>{s.isActive ? "✅" : "⏸️"}</td>
              <td style={{ padding: 8 }} onClick={e => e.stopPropagation()}><button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)" }}><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>

      {editing && (
        <div onClick={() => setEditing(null)} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.4)" }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-bg-primary)", borderRadius: 0, maxWidth: 600, width: "90%", maxHeight: "90vh", overflow: "auto", padding: 24, boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>{editing.id ? "Редактировать" : "Новый сервер"}</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Название" value={editing.name} onChange={(v: string) => updateField("name", v)} />
              <Field label="Slug" value={editing.slug} onChange={(v: string) => updateField("slug", v)} />
              <Field label="Категория" value={editing.category} onChange={(v: string) => updateField("category", v)} />
              <Field label="Описание" value={editing.description} onChange={(v: string) => updateField("description", v)} textarea />
              <Field label="Теги" value={editing.tags} onChange={(v: string) => updateField("tags", v)} />
              <div style={{ display: "flex", gap: 10 }}>
                <Field label="Звёзды" value={String(editing.stars)} onChange={(v: string) => updateField("stars", parseInt(v)||0)} type="number" />
                <Field label="Рейтинг" value={String(editing.rating)} onChange={(v: string) => updateField("rating", parseInt(v)||7)} type="number" />
              </div>
              <select value={editing.difficulty} onChange={e => updateField("difficulty", e.target.value)}
                style={{ flex: 1, padding: "8px 12px", fontSize: 12, borderRadius: 0, border: "1px solid var(--color-border)", background: "var(--color-bg-primary)" }}>
                <option value="easy">🟢 Новичок</option>
                <option value="medium">🟡 Средне</option>
                <option value="hard">🔴 Сложно</option>
              </select>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                {["russianDocs","requiresApiKey","isActive","isFeatured"].map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12 }}>
                    <input type="checkbox" checked={editing[f]} onChange={e => updateField(f, e.target.checked)} />
                    {f === "russianDocs" ? "🇷🇺 Рус. док." : f === "requiresApiKey" ? "🔑 API ключ" : f === "isActive" ? "✅ Активен" : "⭐ Избранный"}
                  </label>
                ))}
              </div>
              <Field label="GitHub URL" value={editing.githubUrl} onChange={(v: string) => updateField("githubUrl", v)} />
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
