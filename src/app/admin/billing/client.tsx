'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, Check, X, RefreshCw, Calendar, Mail, Clock } from "lucide-react";

export default function BillingClient({ users }: { users: any[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const proCount = users.filter(u => u.subscription === "pro").length;
  const freeCount = users.filter(u => u.subscription === "free").length;

  async function togglePro(userId: string, currentStatus: string) {
    setSaving(userId);
    const newStatus = currentStatus === "pro" ? "free" : "pro";
    const expiresAt = newStatus === "pro" ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null;
    await fetch("/api/admin/billing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, subscription: newStatus, subscriptionExpiresAt: expiresAt }),
    });
    setMessage(`${newStatus === "pro" ? "Pro активирован" : "Pro отключён"} для пользователя`);
    setTimeout(() => setMessage(""), 3000);
    setSaving(null);
    router.refresh();
  }

  function formatDate(d: string | null) {
    if (!d) return "—";
    const date = new Date(d);
    const now = new Date();
    const days = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (days < 0) return "Истекла " + Math.abs(days) + " дн. назад";
    if (days === 0) return "Сегодня";
    return date.toLocaleDateString("ru") + " (" + days + " дн.)";
  }

  return (
    <div style={{ padding: "var(--space-xl)", fontFamily: "var(--font-body)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, fontFamily: "var(--font-heading)" }}>Биллинг</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>
            {users.length} пользователей · <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>{proCount} Pro</span> · {freeCount} Free
          </p>
        </div>
      </div>

      {message && (
        <div style={{ padding: "var(--space-m)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", marginBottom: "var(--space-l)", fontSize: "var(--text-xs)", fontWeight: 600 }}>
          {message}
        </div>
      )}

      <div style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--text-xs)", fontFamily: "var(--font-body)" }}>
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)", borderBottom: "1px solid var(--color-border)" }}>
              {["Email", "Имя", "Статус", "Подписка", "Истекает", "Роль", "Действие"].map(h => (
                <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 600, color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border-light)" }}>
                <td style={{ padding: "10px 14px", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <Mail size={12} style={{ color: "var(--color-text-tertiary)" }} />
                    <span>{u.email}</span>
                  </div>
                </td>
                <td style={{ padding: "10px 14px" }}>{u.name || "—"}</td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "2px 8px", fontSize: 10, fontWeight: 600,
                    background: u.status === "senior" ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
                    color: u.status === "senior" ? "var(--color-accent)" : "var(--color-text-tertiary)",
                    borderRadius: 0,
                  }}>{u.status === "senior" ? "Senior" : u.status === "junior" ? "Junior" : u.status || "—"}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "2px 10px", fontSize: 10, fontWeight: 700,
                    background: u.subscription === "pro" ? "var(--color-accent-light)" : "var(--color-bg-secondary)",
                    color: u.subscription === "pro" ? "var(--color-accent)" : "var(--color-text-tertiary)",
                    borderRadius: 0, display: "flex", alignItems: "center", gap: 4, width: "fit-content",
                  }}>
                    {u.subscription === "pro" && <Crown size={10} />}
                    {u.subscription === "pro" ? "Pro" : "Free"}
                  </span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "var(--color-text-secondary)" }}>
                    <Calendar size={10} style={{ color: "var(--color-text-tertiary)" }} />
                    {u.subscription === "pro" ? formatDate(u.subscriptionExpiresAt) : "—"}
                  </div>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <span style={{
                    padding: "2px 8px", fontSize: 10, fontWeight: 600,
                    background: u.role === "admin" ? "#fef3c7" : "var(--color-bg-secondary)",
                    color: u.role === "admin" ? "#92400e" : "var(--color-text-tertiary)",
                    borderRadius: 0,
                  }}>{u.role === "admin" ? "Админ" : "Пользователь"}</span>
                </td>
                <td style={{ padding: "10px 14px" }}>
                  <button onClick={() => togglePro(u.id, u.subscription)}
                    disabled={saving === u.id}
                    style={{
                      padding: "6px 14px", border: "1px solid " + (u.subscription === "pro" ? "#ef4444" : "var(--color-accent)"),
                      background: "transparent", color: u.subscription === "pro" ? "#ef4444" : "var(--color-accent)",
                      cursor: "pointer", fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)", borderRadius: 0,
                      display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap",
                    }}>
                    {saving === u.id ? <RefreshCw size={10} style={{ animation: "spin 1s linear infinite" }} /> :
                     u.subscription === "pro" ? <><X size={10} /> Отключить</> : <><Crown size={10} /> Активировать</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
