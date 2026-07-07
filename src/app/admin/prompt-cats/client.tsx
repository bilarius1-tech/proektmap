"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, CheckCircle, XCircle, Code, Rocket, Palette, Search, Shield, Sparkles, Folder, GripVertical } from "lucide-react";

interface Category {
  id: string; name: string; slug: string; icon: string; sortOrder: number; isActive: boolean;
}

const ICONS = [
  { value: "code", label: "Код", icon: <Code size={16} /> },
  { value: "rocket", label: "Деплой", icon: <Rocket size={16} /> },
  { value: "palette", label: "Дизайн", icon: <Palette size={16} /> },
  { value: "search", label: "Поиск/SEO", icon: <Search size={16} /> },
  { value: "shield", label: "Безопасность", icon: <Shield size={16} /> },
  { value: "sparkles", label: "AI", icon: <Sparkles size={16} /> },
  { value: "folder", label: "Общее", icon: <Folder size={16} /> },
  { value: "file-text", label: "Документы", icon: <FileTextIcon /> },
  { value: "image", label: "Изображения", icon: <ImageIcon /> },
  { value: "video", label: "Видео", icon: <VideoIcon /> },
  { value: "music", label: "Аудио", icon: <MusicIcon /> },
  { value: "database", label: "База данных", icon: <DatabaseIcon /> },
  { value: "cloud", label: "Облако", icon: <CloudIcon /> },
  { value: "globe", label: "Интернет", icon: <GlobeIcon /> },
  { value: "zap", label: "Быстрое", icon: <ZapIcon /> },
  { value: "heart", label: "Избранное", icon: <HeartIcon /> },
  { value: "star", label: "Важное", icon: <StarIcon /> },
  { value: "check-circle", label: "Готовое", icon: <CheckCircle size={16} /> },
  { value: "alert-triangle", label: "Предупреждение", icon: <AlertTriangleIcon /> },
  { value: "help-circle", label: "Помощь", icon: <HelpCircleIcon /> },
];

function FileTextIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>; }
function ImageIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>; }
function VideoIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5"/><rect x="2" y="6" width="14" height="12" rx="2"/></svg>; }
function MusicIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>; }
function DatabaseIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/></svg>; }
function CloudIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>; }
function GlobeIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>; }
function ZapIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14Z"/></svg>; }
function HeartIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>; }
function StarIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>; }
function AlertTriangleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>; }
function HelpCircleIcon() { return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>; }

const ICON_MAP: Record<string, React.ReactNode> = {
  code: <Code size={16} />, rocket: <Rocket size={16} />, palette: <Palette size={16} />,
  search: <Search size={16} />, shield: <Shield size={16} />, sparkles: <Sparkles size={16} />,
  folder: <Folder size={16} />, "file-text": <FileTextIcon />, image: <ImageIcon />, video: <VideoIcon />,
  music: <MusicIcon />, database: <DatabaseIcon />, cloud: <CloudIcon />, globe: <GlobeIcon />,
  zap: <ZapIcon />, heart: <HeartIcon />, star: <StarIcon />, "check-circle": <CheckCircle size={16} />,
  "alert-triangle": <AlertTriangleIcon />, "help-circle": <HelpCircleIcon />,
};

type FormData = { name: string; icon: string };

export default function AdminCatsClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [items, setItems] = useState(categories);
  const [editId, setEditId] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const empty: FormData = { name: "", icon: "folder" };
  const [form, setForm] = useState<FormData>(empty);

  function startEdit(c: Category) { setEditId(c.id); setShowNew(false); setForm({ name: c.name, icon: c.icon }); }
  function startNew() { setEditId(null); setShowNew(true); setForm(empty); }

  async function save() {
    setSaving(true);
    const url = editId ? `/api/admin/prompt-cats/${editId}` : "/api/admin/prompt-cats";
    const res = await fetch(url, { method: editId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); setShowNew(false); }
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить категорию? Промпты этой категории останутся.")) return;
    await fetch(`/api/admin/prompt-cats/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
    router.refresh();
  }

  async function toggle(id: string, active: boolean) {
    await fetch(`/api/admin/prompt-cats/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isActive: !active }) });
    setItems(items.map(i => i.id === id ? { ...i, isActive: !active } : i));
    router.refresh();
  }

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>📁 Категории промптов</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{items.length} категорий · значки Lucide</p>
        </div>
        <button onClick={startNew} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
          <Plus size={16} /> Добавить
        </button>
      </div>

      {(showNew || editId) && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Название</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Код" style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Иконка</label>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                {ICONS.map(ic => (
                  <button key={ic.value} onClick={() => setForm({ ...form, icon: ic.value })} title={ic.label}
                    style={{ width: 36, height: 36, borderRadius: "var(--radius-s)", border: form.icon === ic.value ? "2px solid var(--color-accent)" : "1px solid var(--color-border)", background: form.icon === ic.value ? "var(--color-accent-light)" : "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: form.icon === ic.value ? "var(--color-accent)" : "var(--color-text-tertiary)" }}>
                    {ic.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>{saving ? "Сохранение..." : "Сохранить"}</button>
            <button onClick={() => { setEditId(null); setShowNew(false); }} style={{ padding: "10px 24px", borderRadius: "var(--radius-m)", background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {items.map(c => (
          <div key={c.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", padding: "var(--space-m)", background: "white", borderRadius: "var(--radius-m)", border: "1px solid var(--color-border-light)", opacity: c.isActive ? 1 : 0.5 }}>
            <GripVertical size={14} style={{ color: "var(--color-text-tertiary)", flexShrink: 0 }} />
            <span style={{ color: "var(--color-accent)", flexShrink: 0 }}>{ICON_MAP[c.icon] || <Folder size={16} />}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>{c.name}</div>
              <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{c.slug}</div>
            </div>
            <button onClick={() => toggle(c.id, c.isActive)} style={{ background: "none", border: "none", cursor: "pointer", color: c.isActive ? "var(--color-accent)" : "var(--color-text-tertiary)", padding: 6 }}>{c.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}</button>
            <button onClick={() => startEdit(c)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-tertiary)", padding: 6 }}><Pencil size={14} /></button>
            <button onClick={() => remove(c.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 6 }}><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
