"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, GripVertical, X, Check, ExternalLink } from "lucide-react";
import { AI_CATEGORIES, getAICategory } from "@/lib/constants/ai-categories";

export default function AdminAIToolsClient({ tools: initialTools }: any) {
  const router = useRouter();
  const [tools, setTools] = useState(initialTools || []);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  function startEdit(t?: any) {
    setEditing(t ? { ...t, category: t.category || "coding-dev" } : {
      name: "", slug: "", provider: "", type: "ide", category: "coding-dev", description: "",
      pros: "[]", cons: "[]", pricing: "", url: "",
      russianUi: false, russianSupport: false, requiresVpn: false, codeOwnership: true,
      rating: 7, bestFor: "",
      howToStart: "[]", faqItems: "[]", detailDescription: "",
      sortOrder: tools.length + 1, isActive: true,
    });
  }

  async function save() {
    setSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    const res = await fetch("/api/admin/ai-tools", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { router.refresh(); setEditing(null); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить инструмент?")) return;
    await fetch(`/api/admin/ai-tools?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  const displayedTools = categoryFilter === "all" 
    ? tools 
    : tools.filter((t: any) => (t.category || "coding-dev") === categoryFilter);

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>🛠️ AI-инструменты</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{tools.length} инструментов в 14 направлениях</p>
        </div>
        <button onClick={() => startEdit()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-s)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Добавить
        </button>
      </div>

      {/* Category filter tabs */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 10, marginBottom: "var(--space-m)" }}>
        <button
          onClick={() => setCategoryFilter("all")}
          style={{
            padding: "6px 12px", borderRadius: 6, border: categoryFilter === "all" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)",
            background: categoryFilter === "all" ? "var(--color-accent-light)" : "var(--color-bg-primary)",
            color: categoryFilter === "all" ? "var(--color-accent)" : "var(--color-text-secondary)",
            fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
          }}
        >
          🌍 Все ({tools.length})
        </button>
        {AI_CATEGORIES.map(cat => {
          const count = tools.filter((t: any) => (t.category || "coding-dev") === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              style={{
                padding: "6px 12px", borderRadius: 6, border: categoryFilter === cat.id ? `1px solid ${cat.color}` : "1px solid var(--color-border)",
                background: categoryFilter === cat.id ? cat.bg : "var(--color-bg-primary)",
                color: categoryFilter === cat.id ? cat.color : "var(--color-text-secondary)",
                fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap"
              }}
            >
              {cat.emoji} {cat.shortLabel} {count > 0 ? `(${count})` : ""}
            </button>
          );
        })}
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            {["#","Название","Направление","Провайдер","Тип","Рейтинг","🇷🇺","VPN","💰","Активен",""].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--color-text-tertiary)", fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {displayedTools.map((t: any, i: number) => {
            const cat = getAICategory(t.category);
            return (
              <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "8px 10px", color: "var(--color-text-tertiary)" }}>{i + 1}</td>
                <td style={{ padding: "8px 10px", fontWeight: 600, cursor: "pointer", color: "var(--color-accent)" }} onClick={() => startEdit(t)}>
                  {t.name}
                </td>
                <td style={{ padding: "8px 10px" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 4, background: cat.bg, color: cat.color, border: `1px solid ${cat.border}`, fontSize: 11, fontWeight: 600 }}>
                    {cat.emoji} {cat.shortLabel}
                  </span>
                </td>
                <td style={{ padding: "8px 10px", color: "var(--color-text-secondary)" }}>{t.provider}</td>
                <td style={{ padding: "8px 10px" }}>{t.type === "ide" ? "💻 IDE" : t.type === "agent" ? "🤖 Агент" : "🧩 No-code"}</td>
                <td style={{ padding: "8px 10px" }}>{t.rating}/10</td>
                <td style={{ padding: "8px 10px" }}>{t.russianUi ? "✅" : "—"}</td>
                <td style={{ padding: "8px 10px" }}>{t.requiresVpn ? "🔐" : "🌐"}</td>
                <td style={{ padding: "8px 10px", color: "var(--color-accent)", fontWeight: 600 }}>{t.pricing}</td>
                <td style={{ padding: "8px 10px" }}>{t.isActive ? "✅" : "⏸️"}</td>
                <td style={{ padding: "8px 10px" }}>
                  <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.4)" }} onClick={() => setEditing(null)}>
          <div style={{ background: "var(--color-bg-primary)", borderRadius: "var(--radius-m)", maxWidth: 640, width: "90%", maxHeight: "90vh", overflow: "auto", padding: "var(--space-l)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700 }}>{editing.id ? "Редактировать" : "Новый инструмент"}</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 2 }}>
                  <Field label="Название" value={editing.name} onChange={(v: string) => setEditing({...editing, name: v})} />
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Slug" value={editing.slug || ""} onChange={(v: string) => setEditing({...editing, slug: v})} />
                </div>
              </div>

              {/* 14 Categories Select */}
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "var(--color-text-secondary)", display: "block", marginBottom: 4 }}>
                  📂 Направление (1 из 14 категорий)
                </label>
                <select
                  value={editing.category || "coding-dev"}
                  onChange={e => setEditing({...editing, category: e.target.value})}
                  style={{ width: "100%", padding: "10px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", background: "var(--color-surface, #fff)" }}
                >
                  {AI_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.emoji} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <Field label="Провайдер" value={editing.provider} onChange={(v: string) => setEditing({...editing, provider: v})} />
              
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Тип</label>
                  <select value={editing.type} onChange={e => setEditing({...editing, type: e.target.value})}
                    style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)" }}>
                    <option value="ide">💻 IDE / Редактор</option>
                    <option value="agent">🤖 AI-Агент</option>
                    <option value="no-code">🧩 No-code конструктор</option>
                    <option value="assistant">💬 Ассистент</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <Field label="Рейтинг (1-10)" value={String(editing.rating)} onChange={(v: string) => setEditing({...editing, rating: parseInt(v) || 7})} type="number" />
                </div>
              </div>
              <Field label="Цена" value={editing.pricing} onChange={(v: string) => setEditing({...editing, pricing: v})} />
              <Field label="URL" value={editing.url} onChange={(v: string) => setEditing({...editing, url: v})} />
              <Field label="Для чего (bestFor)" value={editing.bestFor} onChange={(v: string) => setEditing({...editing, bestFor: v})} />
              
              <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap" }}>
                {["russianUi","russianSupport","requiresVpn","codeOwnership","isActive"].map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)" }}>
                    <input type="checkbox" checked={editing[f]} onChange={e => setEditing({...editing, [f]: e.target.checked})} />
                    {f === "russianUi" ? "🇷🇺 UI" : f === "russianSupport" ? "💬 Поддержка" : f === "requiresVpn" ? "🔐 VPN" : f === "codeOwnership" ? "📦 Код ваш" : "✅ Активен"}
                  </label>
                ))}
              </div>

              <button onClick={save} disabled={saving}
                style={{ marginTop: "var(--space-s)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: "var(--radius-s)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
                <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}
