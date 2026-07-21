"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2, X, Star } from "lucide-react";

export default function AdminMCPClient({ servers: initial }: any) {
  const router = useRouter();
  const [servers, setServers] = useState(initial || []);
  const [editing, setEditing] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  function startEdit(t?: any) {
    setEditing(t ? { ...t } : { name: "", slug: "", category: "", description: "", stars: 0, rating: 7, difficulty: "easy", russianDocs: false, requiresApiKey: false, isActive: true, isFeatured: false, sortOrder: servers.length + 1, pros: "[]", cons: "[]", howToUse: "[]", tags: "", githubUrl: "", longDescription: "" });
  }

  async function save() {
    setSaving(true);
    const method = editing.id ? "PATCH" : "POST";
    await fetch("/api/admin/mcp", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
    router.refresh();
    setEditing(null);
    setSaving(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить?")) return;
    await fetch(`/api/admin/mcp?id=${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div style={{ padding: "var(--space-xl)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800 }}>🔌 MCP-серверы</h1>
        <button onClick={() => startEdit()} style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: "var(--radius-s)", background: "var(--color-accent)", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
          <Plus size={14} /> Добавить
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            {["#","Название","Категория","Рейтинг","⭐ GitHub","🇷🇺","🔑 API","Сложность","Активен",""].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 10px", color: "var(--color-text-tertiary)", fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {servers.map((s: any, i: number) => (
            <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
              <td style={{ padding: 8 }}>{i + 1}</td>
              <td style={{ padding: 8, fontWeight: 600, cursor: "pointer", color: "var(--color-accent)" }} onClick={() => startEdit(s)}>{s.name}</td>
              <td style={{ padding: 8 }}>{s.category}</td>
              <td style={{ padding: 8 }}>{s.rating}/10</td>
              <td style={{ padding: 8 }}>{s.stars}</td>
              <td style={{ padding: 8 }}>{s.russianDocs ? "✅" : "—"}</td>
              <td style={{ padding: 8 }}>{s.requiresApiKey ? "🔑" : "🆓"}</td>
              <td style={{ padding: 8 }}>{s.difficulty}</td>
              <td style={{ padding: 8 }}>{s.isActive ? "✅" : "⏸️"}</td>
              <td style={{ padding: 8 }}><button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-error)" }}><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
