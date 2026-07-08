"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash2, Save, X, Search, Shield, User, Ban, CheckCircle } from "lucide-react";

export default function UsersClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [items, setItems] = useState(users);
  const [editId, setEditId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const empty = { name: "", email: "", role: "user", subscription: "free", status: "junior", skills: "", bio: "" };
  const [form, setForm] = useState(empty);

  function startEdit(u: any) {
    setEditId(u.id);
    setForm({ name: u.name || "", email: u.email, role: u.role || "user", subscription: u.subscription || "free", status: u.status || "junior", skills: u.skills || "", bio: u.bio || "" });
  }

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/users/${editId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (res.ok) { router.refresh(); setEditId(null); }
    setSaving(false);
  }

  async function remove(id: string, email: string) {
    if (!confirm(`Удалить пользователя ${email}? Все его посты останутся.`)) return;
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
    setItems(items.filter(i => i.id !== id));
    router.refresh();
  }

  async function toggleRole(id: string, role: string) {
    const newRole = role === "admin" ? "user" : "admin";
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role: newRole }) });
    setItems(items.map(i => i.id === id ? { ...i, role: newRole } : i));
    router.refresh();
  }

  async function toggleSub(id: string, sub: string) {
    const newSub = sub === "pro" ? "free" : "pro";
    await fetch(`/api/admin/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ subscription: newSub }) });
    setItems(items.map(i => i.id === id ? { ...i, subscription: newSub } : i));
    router.refresh();
  }

  const filtered = search ? items.filter(i => i.email?.toLowerCase().includes(search.toLowerCase()) || i.name?.toLowerCase().includes(search.toLowerCase())) : items;

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>👥 Пользователи</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>{items.length} пользователей</p>
        </div>
        <div style={{ position: "relative", width: 260 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--color-text-tertiary)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по email или имени..."
            style={{ width: "100%", padding: "8px 8px 8px 32px", fontSize: "var(--text-xs)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} />
        </div>
      </div>

      {/* Edit modal */}
      {editId && (
        <div style={{ marginBottom: "var(--space-l)", padding: "var(--space-l)", background: "var(--color-bg-secondary)", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "var(--space-m)" }}>
            <div style={{ fontWeight: 700, fontSize: "var(--text-s)" }}>Редактирование пользователя</div>
            <button onClick={() => setEditId(null)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4 }}><X size={16} /></button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-m)", marginBottom: "var(--space-m)" }}>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Имя</label><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Email</label><input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Роль</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="user">User</option><option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Подписка</label>
              <select value={form.subscription} onChange={e => setForm({ ...form, subscription: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="free">Free</option><option value="pro">Pro</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Статус</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }}>
                <option value="junior">Junior</option><option value="middle">Middle</option><option value="senior">Senior</option><option value="architect">Architect</option>
              </select>
            </div>
            <div><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>Навыки</label><input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none" }} /></div>
          </div>
          <div style={{ marginBottom: "var(--space-m)" }}><label style={{ display: "block", fontSize: "var(--text-xs)", fontWeight: 600, marginBottom: 4 }}>О себе</label><textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={2} style={{ width: "100%", padding: "8px 12px", fontSize: "var(--text-s)", borderRadius: "var(--radius-s)", border: "1px solid var(--color-border)", outline: "none", resize: "vertical" }} /></div>

          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={save} disabled={saving} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)", color: "white", border: "none", fontSize: "var(--text-s)", fontWeight: 600, cursor: "pointer" }}>
              <Save size={14} /> {saving ? "Сохранение..." : "Сохранить"}
            </button>
            <button onClick={() => setEditId(null)} style={{ padding: "10px 20px", borderRadius: "var(--radius-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", fontSize: "var(--text-s)", cursor: "pointer" }}>Отмена</button>
          </div>
        </div>
      )}

      {/* Users table */}
      <div style={{ background: "white", borderRadius: "var(--radius-l)", border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Email", "Имя", "Роль", "Подписка", "Статус", "Статей", "Дата", ""].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                      background: u.avatar ? `url(${u.avatar}) center/cover` : "var(--color-bg-secondary)",
                    }} />
                    <span style={{ fontWeight: 600 }}>{u.email}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)" }}>{u.name || "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <button onClick={() => toggleRole(u.id, u.role)} title="Сменить роль"
                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, border: "none", cursor: "pointer",
                      background: u.role === "admin" ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
                      color: u.role === "admin" ? "var(--color-accent)" : "var(--color-text-tertiary)", fontSize: 10, fontWeight: 600 }}>
                    {u.role === "admin" ? <Shield size={12} /> : <User size={12} />}
                    {u.role}
                  </button>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <button onClick={() => toggleSub(u.id, u.subscription)} title="Сменить подписку"
                    style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 99, border: "none", cursor: "pointer",
                      background: u.subscription === "pro" ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
                      color: u.subscription === "pro" ? "var(--color-accent)" : "var(--color-text-tertiary)", fontSize: 10, fontWeight: 600 }}>
                    {u.subscription === "pro" ? "Pro" : "Free"}
                  </button>
                </td>
                <td style={{ padding: "10px 14px", fontSize: 10, color: "var(--color-text-tertiary)" }}>{u.status || "junior"}</td>
                <td style={{ padding: "10px 14px", color: "var(--color-text-secondary)" }}>{u._count?.posts || 0}</td>
                <td style={{ padding: "10px 14px", fontSize: 10, color: "var(--color-text-tertiary)", whiteSpace: "nowrap" }}>
                  {new Date(u.createdAt).toLocaleDateString("ru")}
                </td>
                <td style={{ padding: "10px 14px", whiteSpace: "nowrap" }}>
                  <button onClick={() => startEdit(u)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-text-secondary)", padding: 4 }}><Edit size={14} /></button>
                  <button onClick={() => remove(u.id, u.email)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)", padding: 4 }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
