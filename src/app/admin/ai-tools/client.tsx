"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, X, ExternalLink } from "lucide-react";

function transliterate(text: string): string {
  // Simple transliteration - remove special chars, keep alphanumeric
  let result = '';
  for (const ch of text) {
    // Only keep a-z, A-Z, 0-9, replace others with dash
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
      result += ch.toLowerCase();
    } else if (ch === ' ' || ch === '_' || ch === '-') {
      result += '-';
    }
    // Skip all other characters
  }
  // Clean up
  result = result.replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return result || 'tool';
}

  let result = '';
  for (const ch of text) {
    result += map[ch] || ch;
  }
  result = result.replace(/[^a-zA-Z0-9\-]/g, '').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  return result || 'tool';
}

export default function AdminAIToolsClient({ tools: initialTools }: any) {
  const router = useRouter();
  const [tools, setTools] = useState(initialTools || []);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(t?: any) {
    setEditing(t ? { ...t } : {
      name: "", slug: "", provider: "", type: "ide", description: "",
      pros: "[]", cons: "[]", pricing: "", pricingAmount: "", url: "", downloadUrl: "",
      russianUi: false, russianSupport: false, requiresVpn: false, requiresForeignCard: false,
      codeOwnership: true, rating: 7, bestFor: "",
      howToStart: "[]", faqItems: "[]", detailDescription: "",
      hiddenFeatures: "", ourTake: "", detailComparison: "",
      sortOrder: tools.length + 1, isActive: true,
    });
  }

  function updateField(field: string, value: any) {
    setEditing({ ...editing, [field]: value });
    // Auto-generate slug from name
    if (field === 'name' && (!editing.slug || editing.slug === transliterate(editing.name))) {
      setEditing((prev: any) => ({ ...prev, slug: transliterate(value) }));
    }
  }

  async function save() {
    setSaving(true);
    if (!editing.slug) {
      setEditing({ ...editing, slug: transliterate(editing.name) });
    }
    const method = editing.id ? "PATCH" : "POST";
    const res = await fetch("/api/admin/ai-tools", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    if (res.ok) { router.refresh(); setEditing(null); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить инструмент?")) return;
    await fetch("/api/admin/ai-tools?id=" + id, { method: "DELETE" });
    router.refresh();
  }

  const typeLabels: Record<string, string> = {
    ide: "💻 IDE",
    "no-code": "🧩 No-code",
    agent: "🤖 Агент",
    assistant: "💬 Ассистент",
  };

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>🛠️ AI-инструменты</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{tools.length} инструментов</p>
        </div>
        <button onClick={() => startEdit()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={14} /> Добавить
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            {["#","Название","Slug","Провайдер","Тип","Рейтинг","РУ","VPN","Банк","Цена","Активен",""].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 8px", color: "var(--color-text-tertiary)", fontWeight: 600, fontSize: 9 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tools.map((t: any, i: number) => (
            <tr key={t.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
              <td style={{ padding: "8px 8px", color: "var(--color-text-tertiary)" }}>{i + 1}</td>
              <td style={{ padding: "8px 8px", fontWeight: 600, cursor: "pointer", color: "var(--color-accent)" }} onClick={() => startEdit(t)}>{t.name}</td>
              <td style={{ padding: "8px 8px", color: "var(--color-text-secondary)", fontSize: 9, maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.slug}</td>
              <td style={{ padding: "8px 8px", color: "var(--color-text-secondary)" }}>{t.provider}</td>
              <td style={{ padding: "8px 8px" }}>{typeLabels[t.type] || t.type}</td>
              <td style={{ padding: "8px 8px" }}>{t.rating}/10</td>
              <td style={{ padding: "8px 8px" }}>{t.russianUi ? "✅" : "—"}</td>
              <td style={{ padding: "8px 8px" }}>{t.requiresVpn ? "🔐" : "🌍"}</td>
              <td style={{ padding: "8px 8px" }}>{t.requiresForeignCard ? "💳" : "—"}</td>
              <td style={{ padding: "8px 8px", color: "var(--color-accent)", fontWeight: 600 }}>{t.pricingAmount || t.pricing}</td>
              <td style={{ padding: "8px 8px" }}>{t.isActive ? "✅" : "⏸️"}</td>
              <td style={{ padding: "8px 8px" }}>
                <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(0,0,0,0.4)" }} onClick={() => setEditing(null)}>
          <div style={{ background: "var(--color-bg-primary)", borderRadius: 0, maxWidth: 700, width: "95%", maxHeight: "90vh", overflow: "auto", padding: "var(--space-l)", boxShadow: "0 8px 40px rgba(0,0,0,0.15)" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-m)" }}>
              <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700 }}>{editing.id ? "Редактировать" : "Новый инструмент"}</h2>
              <button onClick={() => setEditing(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={18} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 1 }}><Field label="Название" value={editing.name} onChange={(v: string) => updateField('name', v)} /></div>
                <div style={{ flex: 1 }}><Field label="Slug (авто)" value={editing.slug || ''} onChange={(v: string) => updateField('slug', v)} /></div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 1 }}><Field label="Провайдер" value={editing.provider} onChange={(v: string) => updateField('provider', v)} /></div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Тип</label>
                  <select value={editing.type} onChange={e => updateField('type', e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: 0, border: "1px solid var(--color-border)" }}>
                    <option value="ide">💻 IDE / Редактор</option>
                    <option value="no-code">🧩 No-code конструктор</option>
                    <option value="agent">🤖 AI-агент</option>
                    <option value="assistant">💬 AI-ассистент</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}><Field label="Рейтинг (1-10)" value={String(editing.rating)} onChange={(v: string) => updateField('rating', parseInt(v) || 7)} type="number" /></div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 1 }}><Field label="Цена (описание)" value={editing.pricing || ''} onChange={(v: string) => updateField('pricing', v)} /></div>
                <div style={{ flex: 1 }}><Field label="Цена (сумма)" value={editing.pricingAmount || ''} onChange={(v: string) => updateField('pricingAmount', v)} placeholder="0/мес или Бесплатно" /></div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 1 }}><Field label="URL сайта" value={editing.url || ''} onChange={(v: string) => updateField('url', v)} /></div>
                <div style={{ flex: 1 }}><Field label="URL скачивания" value={editing.downloadUrl || ''} onChange={(v: string) => updateField('downloadUrl', v)} placeholder="прямая ссылка" /></div>
              </div>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <div style={{ flex: 1 }}><Field label="Для кого (bestFor)" value={editing.bestFor || ''} onChange={(v: string) => updateField('bestFor', v)} /></div>
                <div style={{ flex: 1 }}><Field label="Описание" value={editing.description || ''} onChange={(v: string) => updateField('description', v)} /></div>
              </div>

              {/* Checkboxes */}
              <div style={{ display: "flex", gap: "var(--space-m)", flexWrap: "wrap" }}>
                {["russianUi","russianSupport","requiresVpn","requiresForeignCard","codeOwnership","isActive"].map(f => (
                  <label key={f} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "var(--text-xs)" }}>
                    <input type="checkbox" checked={editing[f]} onChange={e => updateField(f, e.target.checked)} />
                    {f === "russianUi" ? "🇷🇺 Русский UI" :
                     f === "russianSupport" ? "💬 Поддержка" :
                     f === "requiresVpn" ? "🔐 VPN" :
                     f === "requiresForeignCard" ? "💳 Иностранная карта" :
                     f === "codeOwnership" ? "📦 Код ваш" : "✅ Активен"}
                  </label>
                ))}
              </div>

              {/* Text areas */}
              <div>
                <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Скрытые возможности</label>
                <textarea value={editing.hiddenFeatures || ''} onChange={e => updateField('hiddenFeatures', e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: 0, border: "1px solid var(--color-border)", minHeight: 60, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Наша рекомендация</label>
                <textarea value={editing.ourTake || ''} onChange={e => updateField('ourTake', e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: 0, border: "1px solid var(--color-border)", minHeight: 60, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Чем отличается от других</label>
                <textarea value={editing.detailComparison || ''} onChange={e => updateField('detailComparison', e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: 0, border: "1px solid var(--color-border)", minHeight: 60, boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>Детальное описание</label>
                <textarea value={editing.detailDescription || ''} onChange={e => updateField('detailDescription', e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: 0, border: "1px solid var(--color-border)", minHeight: 80, boxSizing: "border-box" }} />
              </div>

              <button onClick={save} disabled={saving}
                style={{ marginTop: "var(--space-s)", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "10px", borderRadius: 0, background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
                <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, type = "text", placeholder = "" }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label style={{ fontSize: 10, color: "var(--color-text-tertiary)", display: "block", marginBottom: 2 }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-xs)", borderRadius: 0, border: "1px solid var(--color-border)", outline: "none", boxSizing: "border-box" }} />
    </div>
  );
}
