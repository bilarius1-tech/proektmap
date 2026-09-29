"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import NavIcon, { NAV_ICON_NAMES, hasNavIcon } from "@/components/layout/nav-icon";
import { PROTECTED_MENU_IDS } from "@/lib/nav/sidebar-seed";

const PROTECTED = new Set<string>(PROTECTED_MENU_IDS);

interface MenuItem {
  id: string; label: string; href: string; parentId: string | null;
  sortOrder: number; isActive: boolean; icon: string | null; emoji: string | null; location: string; sourceType: string | null;
  children: MenuItem[];
}

export default function MenuEditor({ items: initialItems, blueprints, allBlueprints }: { items: MenuItem[]; blueprints?: any[]; allBlueprints?: any[] }) {
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

  async function handleDelete(item: MenuItem) {
    const message = PROTECTED.has(item.id)
      ? `«${item.label}» — постоянный пункт колонки. Удалить вместе с вложенными ссылками?`
      : `Удалить «${item.label}» и вложенные ссылки?`;
    if (!confirm(message)) return;
    await fetch("/api/admin/menu?id=" + item.id, { method: "DELETE" });
    location.reload();
  }

  async function handleReorder(orderedIds: string[]) {
    const updates = orderedIds.map((id, i) => ({ id, sortOrder: i }));
    await fetch("/api/admin/menu/reorder", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: updates }) });
    location.reload();
  }

  function startNew(parentId?: string) {
    setEditing({ label: "", href: "/", parentId: parentId || null, sortOrder: 0, isActive: true, icon: "", location: activeTab });
  }

  function startEdit(item: MenuItem) {
    setEditing({ ...item, emoji: item.emoji || "" });
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

      {/* Blueprints section */}
      {(blueprints && blueprints.length > 0) && (
        <div style={{ marginBottom: "var(--space-xl)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", marginBottom: "var(--space-m)" }}>
            <span style={{ fontSize: "var(--text-s)", fontWeight: 700 }}>🗺️ Blueprint'ы</span>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", background: "var(--color-accent-light)", padding: "2px 8px", borderRadius: "var(--radius-s)" }}>
              Авто-список из БД
            </span>
            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginLeft: "auto" }}>
              Изменяйте sortOrder и isPublished в{' '}
              <a href="/admin/blueprints" style={{ color: "var(--color-accent)", textDecoration: "underline" }}>админке Blueprint'ов</a>
            </span>
          </div>
          <div className="card" style={{ padding: "var(--space-s)" }}>
            {blueprints.map((bp: any, i: number) => (
              <div key={bp.id} style={{
                display: "flex", alignItems: "center", gap: "var(--space-s)",
                padding: "var(--space-s)", borderBottom: i < blueprints.length - 1 ? "1px solid var(--color-border-light)" : "none",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>📄</span>
                <span style={{ fontWeight: 600, flex: 1, fontSize: "var(--text-s)" }}>{bp.title}</span>
                <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>/blueprints/{bp.slug}</span>
                <span style={{ fontSize: 10, color: "var(--color-text-tertiary)", background: "var(--color-bg-tertiary)", padding: "2px 6px", borderRadius: "var(--radius-s)" }}>
                  sort: {bp.sortOrder}
                </span>
                {bp.isPublished ? (
                  <span style={{ fontSize: 10, color: "var(--color-accent)", fontWeight: 600 }}>✓ показ.</span>
                ) : (
                  <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>скрыт</span>
                )}
                <a href={'/admin/blueprints/' + bp.id} style={{
                  padding: "2px 10px", fontSize: 10, border: "1px solid var(--color-border)",
                  background: "var(--color-bg-secondary)", textDecoration: "none", color: "var(--color-text-secondary)",
                  fontWeight: 600,
                }}>
                  ✏️
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <NavIcon name={item.icon} size={16} />
              <span style={{ fontWeight: 600, flex: 1, fontSize: "var(--text-s)" }}>{item.label}</span>
              {item.id === "header-sitemap" && <span className="badge" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}>внизу колонки</span>}
              <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{item.href}</span>
              {!item.isActive && <span className="badge" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }}>скрыт</span>}
              <button onClick={() => startEdit(item)} className="btn btn-ghost" style={{ padding: 4 }}><Edit size={14} /></button>
              <button onClick={() => handleDelete(item)} className="btn btn-ghost" style={{ padding: 4, color: "var(--color-error)" }}><Trash2 size={14} /></button>
              <button onClick={() => startNew(item.id)} className="btn btn-ghost" style={{ padding: 4 }} title="Добавить подпункт"><Plus size={14} /></button>
            </div>

            {/* Children L2 + grandchildren L3 */}
            {item.children.length > 0 && (
              <div style={{ marginLeft: "var(--space-xl)", marginTop: "var(--space-xs)", display: "flex", flexDirection: "column", gap: 4 }}>
                {item.children.map(child => (
                  <div key={child.id}>
                    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-s)", background: "var(--color-bg-primary)", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)" }}>
                      <NavIcon name={child.icon} size={16} />
                      <span style={{ fontWeight: 500, flex: 1, fontSize: "var(--text-s)" }}>↳ {child.label}</span>
                      <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{child.href}</span>
                      <button onClick={() => startEdit(child)} className="btn btn-ghost" style={{ padding: 4 }}><Edit size={14} /></button>
                      <button onClick={() => handleDelete(child)} className="btn btn-ghost" style={{ padding: 4, color: "var(--color-error)" }}><Trash2 size={14} /></button>
                      <button onClick={() => startNew(child.id)} className="btn btn-ghost" style={{ padding: 4 }} title="Добавить пункт 3-го уровня"><Plus size={14} /></button>
                    </div>
                    {(child.children?.length || 0) > 0 && (
                      <div style={{ marginLeft: "var(--space-l)", marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                        {child.children!.map(g => (
                          <div key={g.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "8px 12px", background: "var(--color-bg-secondary)", border: "1px dashed var(--color-border-light)" }}>
                            <NavIcon name={g.icon} size={14} />
                            <span style={{ fontWeight: 500, flex: 1, fontSize: "var(--text-xs)" }}>↳↳ {g.label}</span>
                            <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{g.href}</span>
                            <button onClick={() => startEdit(g)} className="btn btn-ghost" style={{ padding: 4 }}><Edit size={12} /></button>
                            <button onClick={() => handleDelete(g)} className="btn btn-ghost" style={{ padding: 4, color: "var(--color-error)" }}><Trash2 size={12} /></button>
                          </div>
                        ))}
                      </div>
                    )}
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
              <div>
                <label style={lbl}>Родитель</label>
                <select className="input" value={editing.parentId || ""} onChange={e => setEditing({ ...editing, parentId: e.target.value || null })}>
                  <option value="">{activeTab === "header" ? "Корень колонки" : "Корень футера"}</option>
                  {parentOptions(currentItems, editing.id).map(option => (
                    <option key={option.id} value={option.id}>{"— ".repeat(option.depth)}{option.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={lbl}>Иконка</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <NavIcon name={editing.icon} size={18} />
                  <input className="input" list="nav-icon-names" value={editing.icon || ""} onChange={e => setEditing({ ...editing, icon: e.target.value })} placeholder="Users" />
                </div>
                <datalist id="nav-icon-names">
                  {NAV_ICON_NAMES.map(name => <option key={name} value={name} />)}
                </datalist>
                <p style={{ margin: "6px 0 0", fontSize: "var(--text-xs)", color: editing.icon && !hasNavIcon(editing.icon) ? "var(--color-error)" : "var(--color-text-tertiary)" }}>
                  {editing.icon && !hasNavIcon(editing.icon)
                    ? "Такого имени в наборе сайта нет — на колонке будет кружок."
                    : "Имя из списка, как на lucide.dev. Пустое поле — кружок."}
                </p>
              </div>
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

function findNode(nodes: MenuItem[], id: string): MenuItem | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const nested = findNode(node.children || [], id);
    if (nested) return nested;
  }
  return null;
}

function collectIds(node: MenuItem): string[] {
  return [node.id, ...(node.children || []).flatMap(collectIds)];
}

function parentOptions(nodes: MenuItem[], editingId?: string) {
  const blocked = new Set<string>();
  if (editingId) {
    const self = findNode(nodes, editingId);
    if (self) for (const id of collectIds(self)) blocked.add(id);
  }
  const options: { id: string; label: string; depth: number }[] = [];
  function walk(list: MenuItem[], depth: number) {
    if (depth > 1) return;
    for (const node of list) {
      if (!blocked.has(node.id)) options.push({ id: node.id, label: node.label, depth });
      if (node.children?.length) walk(node.children, depth + 1);
    }
  }
  walk(nodes, 0);
  return options;
}

const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };
