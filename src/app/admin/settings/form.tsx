"use client";

import { useState } from "react";

export default function SettingsForm({ settings: initial }: { settings: any }) {
  const [form, setForm] = useState({ proPrice: initial?.proPrice || 300 });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const d = await res.json();
    setMsg(d.ok ? "✅ Сохранено" : "Ошибка");
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
      <div className="card">
        <h2 style={{ fontSize: "var(--text-l)", marginBottom: "var(--space-m)" }}>💰 Биллинг</h2>
        <div>
          <label style={lbl}>Цена Pro (₽/мес)</label>
          <input className="input" type="number" value={form.proPrice} onChange={e => setForm({ ...form, proPrice: parseInt(e.target.value) || 0 })} />
        </div>
      </div>
      {msg && <div style={{ fontSize: "var(--text-s)", color: msg.includes("✅") ? "var(--color-accent)" : "var(--color-error)" }}>{msg}</div>}
      <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>{saving ? "..." : "Сохранить"}</button>
    </form>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };
