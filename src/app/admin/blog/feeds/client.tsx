"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Play, Pause } from "lucide-react";

export default function FeedsClient({ feeds }: any) {
  const router = useRouter();
  const [items, setItems] = useState(feeds);
  const [saving, setSaving] = useState(false);
  const empty = { name: "", url: "", type: "json", category: "AI-инжиниринг", language: "en" };
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  async function add() {
    setSaving(true);
    const res = await fetch("/api/admin/blog-feeds", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setShowForm(false); setForm(empty); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить источник?")) return;
    await fetch(`/api/admin/blog-feeds/${id}`, { method: "DELETE" });
    setItems(items.filter((i: any) => i.id !== id));
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/admin/blog-feeds/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !active }) });
    setItems(items.map((i: any) => i.id === id ? { ...i, isActive: !active } : i));
    router.refresh();
  }

  async function triggerAutoPublish() {
    setSaving(true);
    const res = await fetch("/api/blog/auto-publish", { method: "POST" });
    const data = await res.json();
    alert(`Создано черновиков: ${data.results?.filter((r: any) => r.status === "draft").length || 0}`);
    router.refresh();
    setSaving(false);
  }

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>📡 Источники новостей</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{items.length} источников для авто-публикации</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={triggerAutoPublish} disabled={saving}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
            <Play size={14} /> Запустить сбор
          </button>
          <button onClick={() => setShowForm(!showForm)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>
            <Plus size={14} /> Добавить
          </button>
        </div>
      </div>

      {showForm && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Название</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Hacker News" style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>URL</label><input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Тип</label><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}><option value="json">JSON</option><option value="xml">XML / RSS</option></select></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Категория</label><input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="AI-инжиниринг" style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Язык</label><select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}><option value="en">EN</option><option value="ru">RU</option><option value="zh">ZH</option></select></div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={add} disabled={saving || !form.name || !form.url}
              style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>Добавить</button>
            <button onClick={() => setShowForm(false)} style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {items.map((f: any) => (
          <div key={f.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", opacity: f.isActive ? 1 : 0.5 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{f.name}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)", fontFamily: "var(--font-mono)" }}>{f.url.slice(0, 80)}</div>
            </div>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>{f.type.toUpperCase()}</span>
            <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "var(--color-bg-secondary)" }}>{f.language.toUpperCase()}</span>
            {f.lastFetched && <span style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>↻ {new Date(f.lastFetched).toLocaleDateString("ru")}</span>}
            <button onClick={() => toggle(f.id, f.isActive)} title={f.isActive ? "Активен" : "На паузе"}
              style={{ background: "none", border: "none", cursor: "pointer", color: f.isActive ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 4 }}>
              {f.isActive ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button onClick={() => remove(f.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
