"use client";

import { useState } from "react";

export default function SettingsForm({ settings: initial }: { settings: any }) {
  const [form, setForm] = useState({
    proPrice: initial?.proPrice || 300,
    yookassaShopId: initial?.yookassaShopId || "",
    yookassaSecretKey: initial?.yookassaSecretKey || "",
  });
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
    <form onSubmit={handleSave} style={{ maxWidth: 560, display: "flex", flexDirection: "column", gap: "var(--space-l)" }}>
      {/* YooKassa */}
      <div className="card">
        <h2 style={{ fontSize: "var(--text-l)", marginBottom: "var(--space-m)" }}>💳 ЮKassa</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
          <div>
            <label style={lbl}>ID магазина</label>
            <input className="input" value={form.yookassaShopId} onChange={e => setForm({ ...form, yookassaShopId: e.target.value })} placeholder="123456" />
          </div>
          <div>
            <label style={lbl}>Секретный ключ</label>
            <input className="input" type="password" value={form.yookassaSecretKey} onChange={e => setForm({ ...form, yookassaSecretKey: e.target.value })} placeholder="live_..." />
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="card">
        <h2 style={{ fontSize: "var(--text-l)", marginBottom: "var(--space-m)" }}>💰 Биллинг</h2>
        <div>
          <label style={lbl}>Цена Pro (₽/мес)</label>
          <input className="input" type="number" value={form.proPrice} onChange={e => setForm({ ...form, proPrice: parseInt(e.target.value) || 0 })} />
          <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginTop: 4 }}>Меняется везде: на главной, в биллинге, в платежной форме</div>
        </div>
      </div>

      {msg && <div style={{ fontSize: "var(--text-s)", color: msg.includes("✅") ? "var(--color-accent)" : "var(--color-error)" }}>{msg}</div>}
      <button type="submit" className="btn btn-primary" disabled={saving} style={{ alignSelf: "flex-start" }}>{saving ? "..." : "Сохранить настройки"}</button>
    </form>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: "var(--text-xs)", fontWeight: 600, color: "var(--color-text-secondary)", marginBottom: "var(--space-2xs)" };
