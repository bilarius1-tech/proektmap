"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, ArrowUp, ArrowDown, GripVertical } from "lucide-react";

interface MenuItem {
  id: string; label: string; href: string; parentId: string | null;
  sortOrder: number; isActive: boolean; icon: string | null;
  children: MenuItem[];
}

export default function MenuEditor({ items: initialItems }: { items: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editing.label) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/admin/menu", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить пункт меню?")) return;
    await fetch("/api/admin/menu?id=" + id, { method: "DELETE" });
    location.reload();
  }

  function startNew(parentId?: string) {
    setEditing({ label: "", href: "/", parentId: parentId || null, sortOrder: 0, isActive: true });
  }

  function startEdit(item: MenuItem) {
    setEditing({ ...item });
  }

  const parents = items.filter(i => !i.parentId);

  return (
    <div>
      {/* Add root item */}
      <div style={{ marginBottom: "var(--space-m)" }}>
        <button onClick={() => startNew()} className="btn btn-primary"><Plus size={16} /> Добавить пункт</button>
      </div>

      {/* Tree */}
      <div className="card" style={{ padding: "var(--space-l)" }}>
        {parents.length === 0 && (
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)", textAlign: "center" }}>Меню пусто. Добавьте первый пункт.</p>
        )}

        {parents.map((item, i) => (
          <div key={item.id} style={{ marginBottom: i < parents.length - 1 ? "var(--space-m)" : 0 }}>
            {/* Parent */}
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-s)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
              <GripVertical size={14} color="var(--color-text-tertiary)" />
              <span style={{ fontWeight: 600, flex: 1, fontSize: "var(--text-s)" }}>{item.label}</span>
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{item.href}</span>
              {!item.isActive && <span className="badge" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }}>скрыт</span>}
              <button onClick={() => startEdit(item)} className="btn btn-ghost" style={{ padding: 4 }}><Edit size={14} /></button>
              <button onClick={() => handleDelete(item.id)} className="btn btn-ghost" style={{ padding: 4, color: "var(--color-error)" }}><Trash2 size={14} /></button>
              <button onClick={() => startNew(item.id)} className="btn btn-ghost" style={{ padding: 4 }} title="Добавить подпункт"><Plus size={14} /></button>
            </div>

            {/* Children */}
            {item.children.length > 0 && (
              <div style={{ marginLeft: "var(--space-xl)", marginTop: "var(--space-xs)", display: "flex", flexDirection: "column", gap: 4 }}>
                {item.children.map(child => (
                  <div key={child.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-s)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
                    <span style={{ fontWeight: 500, flex: 1, fontSize: "var(--text-s)" }}>↳ {child.label}</span>
                    <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{child.href}</span>
                    <button onClick={() => startEdit(child)} className="btn btn-ghost" style={{ padding: 4 }}><Edit size={14} /></button>
                    <button onClick={() => handleDelete(child.id)} className="btn btn-ghost" style={{ padding: 4, color: "var(--color-error)" }}><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setEditing(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-bg-primary)", borderRadius: "var(--radius-xl)", width: "90%", maxWidth: 480, padding: "var(--space-xl)", boxShadow: "var(--shadow-l)" }}>
            <h2 style={{ fontSize: "var(--text-l)", marginBottom: "var(--space-l)" }}>{editing.id ? "Редактировать" : "Новый пункт"}</h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              <div><label style={lbl}>Название *</label><input className="input" value={editing.label || ""} onChange={e => setEditing({ ...editing, label: e.target.value })} required /></div>
              <div><label style={lbl}>Ссылка *</label><input className="input" value={editing.href || ""} onChange={e => setEditing({ ...editing, href: e.target.value })} placeholder="/page" required /></div>
              <div><label style={lbl}>Порядок</label><input className="input" type="number" value={editing.sortOrder || 0} onChange={e => setEditing({ ...editing, sortOrder: parseInt(e.target.value) || 0 })} /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "var(--text-s)" }}>
                <input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} />
                Отображать в меню
              </label>
              <div style={{ display: "flex", gap: "var(--space-s)" }}>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "..." : "Сохранить"}</button>
                <button type="button" onClick={() => setEditing(null)} className="btn btn-secondary">Отмена</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };
