"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BlueprintForm { id?: string; title: string; slug: string; description: string; icon: string; difficulty: string; isPublished: boolean; sortOrder: number; }

export default function BPForm({ initial }: { initial?: any }) {
  const router = useRouter();
  const [form, setForm] = useState<BlueprintForm>({
    title: initial?.title || "", slug: initial?.slug || "", description: initial?.description || "",
    icon: initial?.icon || "Globe", difficulty: initial?.difficulty || "easy",
    isPublished: initial?.isPublished ?? false, sortOrder: initial?.sortOrder || 0, id: initial?.id,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title) { setMsg("Название обязательно"); return; }
    if (!form.slug) form.slug = form.title.toLowerCase().replace(/\s+/g, "-");
    setSaving(true);
    const method = form.id ? "PUT" : "POST";
    const res = await fetch("/api/admin/blueprints", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    if (d.error) setMsg(d.error); else { router.push("/admin/blueprints"); router.refresh(); }
    setSaving(false);
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/admin/blueprints" style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-xs)", color: "var(--color-text-secondary)", fontSize: "var(--text-s)", marginBottom: "var(--space-m)", textDecoration: "none" }}><ArrowLeft size={14} /> Назад</Link>
      <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-l)" }}>{form.id ? "Редактировать Blueprint" : "Новый Blueprint"}</h1>
      <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        <div><label style={lbl}>Название *</label><input className="input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-s)" }}>
          <div><label style={lbl}>Slug</label><input className="input" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} /></div>
          <div><label style={lbl}>Иконка (Lucide)</label><input className="input" value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })} /></div>
        </div>
        <div><label style={lbl}>Описание</label><textarea className="input" rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "var(--space-s)" }}>
          <div><label style={lbl}>Сложность</label><select className="input" value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}><option value="easy">Лёгкий</option><option value="medium">Средний</option><option value="hard">Сложный</option></select></div>
          <div><label style={lbl}>Порядок</label><input className="input" type="number" value={form.sortOrder} onChange={e => setForm({ ...form, sortOrder: parseInt(e.target.value) || 0 })} /></div>
          <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
            <label style={{ display: "flex", alignItems: "center", gap: "var(--space-xs)", cursor: "pointer", fontSize: "var(--text-s)" }}>
              <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} style={{ width: 16, height: 16, accentColor: "var(--color-accent)" }} />
              Опубликован
            </label>
          </div>
        </div>
        {msg && <div style={{ fontSize: "var(--text-s)", color: msg.includes("✅") ? "var(--color-accent)" : "var(--color-error)" }}>{msg}</div>}
        <div style={{ display: "flex", gap: "var(--space-s)" }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? "Сохранение..." : (form.id ? "Обновить" : "Создать")}</button>
          <Link href="/admin/blueprints" className="btn btn-secondary" style={{ textDecoration: "none" }}>Отмена</Link>
        </div>
      </form>
    </div>
  );
}
const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };
