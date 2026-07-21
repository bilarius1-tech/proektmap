"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";

export default function AdminMCPClient({ servers: initial }: any) {
  const router = useRouter();
  const [servers] = useState(initial || []);
  const [scanning, setScanning] = useState(false);

  async function scanGitHub() {
    if (!confirm("Сканировать GitHub (30 сек)?")) return;
    setScanning(true);
    try {
      const res = await fetch("/api/admin/mcp/parse-github", { method: "POST" });
      const data = await res.json();
      if (data.log) alert(data.log.join(String.fromCharCode(10)));
      else if (data.error) alert("Ошибка: " + data.error);
      router.refresh();
    } catch(e: any) { alert("Ошибка: " + e.message); }
    setScanning(false);
  }

  async function remove(id: string) {
    if (!confirm("Удалить?")) return;
    await fetch("/api/admin/mcp?id=" + id, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800 }}>🔌 MCP-серверы</h1>
        <button onClick={scanGitHub} disabled={scanning}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 20px", borderRadius: 0, background: "#24292e", color: "white", border: "none", cursor: "pointer", fontWeight: 600 }}>
          {scanning ? "⏳ Сканирую..." : "🔍 Сканировать GitHub"}
        </button>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ borderBottom: "2px solid var(--color-border)" }}>
            {["#","Сервер","Категория","Звёзды","Рейтинг","Активен",""].map(h => (
              <th key={h} style={{ textAlign: "left", padding: "8px 10px", fontWeight: 600 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {servers.map((s: any, i: number) => (
            <tr key={s.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
              <td style={{ padding: 8 }}>{i + 1}</td>
              <td style={{ padding: 8, fontWeight: 600 }}>{s.name}</td>
              <td style={{ padding: 8 }}>{s.category}</td>
              <td style={{ padding: 8 }}>{s.stars}</td>
              <td style={{ padding: 8 }}>{s.rating}/10</td>
              <td style={{ padding: 8 }}>{s.isActive ? "✅" : "⏸️"}</td>
              <td><button onClick={() => remove(s.id)} style={{ background: "none", border: "none", cursor: "pointer" }}><Trash2 size={14} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
