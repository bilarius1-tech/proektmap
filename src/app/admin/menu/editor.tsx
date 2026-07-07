"use client";

import { useState, useRef } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";

interface MenuItem {
  id: string; label: string; href: string; parentId: string | null;
  sortOrder: number; isActive: boolean; icon: string | null; location: string;
  children: MenuItem[];
}

export default function MenuEditor({ items: initialItems }: { items: MenuItem[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Partial<MenuItem> | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"header" | "footer">("header");
  const [dragItem, setDragItem] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState<string | null>(null);

  const headerItems = items.filter(i => i.location === "header" && !i.parentId);
  const footerItems = items.filter(i => i.location === "footer" && !i.parentId);
  const currentItems = activeTab === "header" ? headerItems : footerItems;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing || !editing.label) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/admin/menu", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...editing, location: activeTab }) });
    location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить пункт меню?")) return;
    await fetch("/api/admin/menu?id=" + id, { method: "DELETE" });
    location.reload();
  }

  async function handleReorder(orderedIds: string[]) {
    const updates = orderedIds.map((id, i) => ({ id, sortOrder: i }));
    await fetch("/api/admin/menu/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: updates }) });
    location.reload();
  }

  function startNew(parentId?: string) {
    setEditing({ label: "", href: "/", parentId: parentId || null, sortOrder: 0, isActive: true, location: activeTab });
  }

  function startEdit(item: MenuItem) {
    setEditing({ ...item });
  }

  function onDragStart(e: React.DragEvent, id: string) {
    setDragItem(id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    setDragOver(id);
  }

  function onDrop(e: React.DragEvent, targetId: string) {
    e.preventDefault();
    if (!dragItem || dragItem === targetId) return;
    const reordered = [...currentItems];
    const fromIdx = reordered.findIndex(i => i.id === dragItem);
    const toIdx = reordered.findIndex(i => i.id === targetId);
    if (fromIdx === -1 || toIdx === -1) return;
    const [moved] = reordered.splice(fromIdx, 1);
    reordered.splice(toIdx, 0, moved);
    handleReorder(reordered.map(i => i.id));
    setDragItem(null);
    setDragOver(null);
  }

  return (
    <div>
      {/* Tabs: Header / Footer */}
      <div style={{ display: "flex", gap: 0, marginBottom: "var(--space-m)", borderBottom: "2px solid var(--color-border-light)" }}>
        {(["header", "footer"] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: "8px 18px", border: "none", background: "transparent", cursor: "pointer",
            color: activeTab === tab ? "var(--color-accent)" : "var(--color-text-tertiary)",
            borderBottom: activeTab === tab ? "2px solid var(--color-accent)" : "2px solid transparent",
            fontWeight: 700, fontSize: "var(--text-s)", marginBottom: -2,
          }}>
            {tab === "header" ? "Главное меню" : "Футер"}
          </button>
        ))}
      </div>

      {/* Add button */}
      <div style={{ marginBottom: "var(--space-m)" }}>
        <button onClick={() => startNew()} className="btn btn-primary"><Plus size={16} /> Добавить в {activeTab === "header" ? "меню" : "футер"}</button>
      </div>

      {/* Drag-and-drop list */}
      <div className="card" style={{ padding: "var(--space-l)" }}>
        {currentItems.length === 0 && (
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)", textAlign: "center" }}>Меню пусто</p>
        )}

        {currentItems.map((item, i) => (
          <div key={item.id} style={{ marginBottom: i < currentItems.length - 1 ? "var(--space-s)" : 0 }}>
            <div
              draggable
              onDragStart={e => onDragStart(e, item.id)}
              onDragOver={e => onDragOver(e, item.id)}
              onDrop={e => onDrop(e, item.id)}
              onDragEnd={() => { setDragItem(null); setDragOver(null); }}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-s)",
                background: dragOver === item.id ? "var(--color-accent-light)" : dragItem === item.id ? "var(--color-bg-tertiary)" : "var(--color-bg-secondary)",
                borderRadius: "var(--radius-m)", border: dragOver === item.id ? "2px dashed var(--color-accent)" : "1px solid var(--color-border-light)",
                cursor: "grab", transition: "background 0.15s, border 0.15s",
                opacity: dragItem === item.id ? 0.5 : 1,
              }}>
              <GripVertical size={14} color="var(--color-text-tertiary)" style={{ cursor: "grab" }} />
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
                Отображать
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
