"use client";

import { useState } from "react";
import { Edit, Trash2, Plus, ExternalLink } from "lucide-react";
import DataTable from "@/components/admin/data-table";

export default function RefTable({ refs: initial }: { refs: any[] }) {
  const [refs, setRefs] = useState(initial);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!editing?.service || !editing?.url) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    await fetch("/api/admin/referrals", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm("Удалить?")) return;
    await fetch("/api/admin/referrals?id=" + id, { method: "DELETE" });
    location.reload();
  }

  return (
    <div>
      <div style={{ marginBottom: "var(--space-m)" }}>
        <button onClick={() => setEditing({ service: "", label: "", url: "", description: "", isActive: true })}
          className="btn btn-primary"><Plus size={16} /> Добавить</button>
      </div>

      <DataTable
        data={refs}
        searchFields={["service", "label"]}
        searchPlaceholder="Поиск по сервису..."
        columns={[
          { key: "service", header: "Сервис", render: (r: any) => <span style={{ fontWeight: 600, fontFamily: "var(--font-mono)", fontSize: "var(--text-xs)" }}>{r.service}</span> },
          { key: "label", header: "Название", render: (r: any) => <span>{r.label}</span> },
          { key: "url", header: "Ссылка", render: (r: any) => <a href={r.url} target="_blank" style={{ color: "var(--color-accent)", fontSize: "var(--text-xs)", display: "flex", alignItems: "center", gap: 4 }}><ExternalLink size={10} /> {r.url.slice(0, 50)}</a> },
          { key: "isActive", header: "Активна", render: (r: any) => r.isActive ? <span className="badge" style={{ background: "var(--color-accent-light)", color: "var(--color-accent)" }}>Да</span> : <span className="badge" style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-tertiary)" }}>Нет</span>, width: "70px" },
        ]}
        actions={(r: any) => (
          <>
            <button onClick={() => setEditing({ ...r })} className="btn btn-ghost" style={{ padding: "4px 8px" }}><Edit size={14} /></button>
            <button onClick={() => handleDelete(r.id)} className="btn btn-ghost" style={{ padding: "4px 8px", color: "var(--color-error)" }}><Trash2 size={14} /></button>
          </>
        )}
      />

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setEditing(null)}>
          <div onClick={e => e.stopPropagation()} style={{ background: "var(--color-bg-primary)", borderRadius: "var(--radius-xl)", width: "90%", maxWidth: 480, padding: "var(--space-xl)", boxShadow: "var(--shadow-l)" }}>
            <h2 style={{ fontSize: "var(--text-l)", marginBottom: "var(--space-l)" }}>{editing.id ? "Редактировать" : "Новая ссылка"}</h2>
            <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
              <div><label style={lbl}>Сервис (ключ) *</label><input className="input" value={editing.service || ""} onChange={e => setEditing({ ...editing, service: e.target.value })} placeholder="reg.ru" required /></div>
              <div><label style={lbl}>Название</label><input className="input" value={editing.label || ""} onChange={e => setEditing({ ...editing, label: e.target.value })} /></div>
              <div><label style={lbl}>Реферальная ссылка *</label><input className="input" value={editing.url || ""} onChange={e => setEditing({ ...editing, url: e.target.value })} placeholder="https://reg.ru/?ref=..." required /></div>
              <div><label style={lbl}>Описание</label><input className="input" value={editing.description || ""} onChange={e => setEditing({ ...editing, description: e.target.value })} /></div>
              <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "var(--text-s)" }}>
                <input type="checkbox" checked={editing.isActive ?? true} onChange={e => setEditing({ ...editing, isActive: e.target.checked })} /> Активна
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
