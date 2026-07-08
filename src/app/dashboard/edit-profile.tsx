"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save } from "lucide-react";

const STATUSES = [
  { value: "junior", label: "🌱 Junior — учусь, делаю первые проекты" },
  { value: "middle", label: "⚡ Middle — уверенно строю проекты с AI" },
  { value: "senior", label: "🔥 Senior — сложные проекты, архитектура" },
  { value: "architect", label: "👑 Architect — строю SaaS, учу других" },
];

export default function EditProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name || "",
    bio: user.bio || "",
    skills: user.skills || "",
    status: user.status || "junior",
    website: user.website || "",
    publicProfile: user.publicProfile || false,
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/user/profile", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); alert("✅ Профиль обновлён"); }
    setSaving(false);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-m)" }}>
        <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, margin: 0 }}>👤 Публичный профиль</h2>
        <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer" }}>
          <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Имя</label>
          <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Статус</label>
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
            {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "var(--space-m)" }}>
        <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>О себе</label>
        <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2} placeholder="Пару слов о себе..."
          style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Навыки (через запятую)</label>
          <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Next.js, AI, SaaS"
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
        <div>
          <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Сайт</label>
          <input value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} placeholder="https://..."
            style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
      </div>

      <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-s)", cursor: "pointer" }}>
        <input type="checkbox" checked={form.publicProfile} onChange={e => setForm({ ...form, publicProfile: e.target.checked })}
          style={{ width: 18, height: 18 }} />
        Показывать профиль на странице специалистов
      </label>
    </div>
  );
}
