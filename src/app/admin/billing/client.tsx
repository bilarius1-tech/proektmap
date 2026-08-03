'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Crown, RefreshCw, Calendar, Clock, CreditCard, TrendingUp, Users, DollarSign } from "lucide-react";

export default function BillingClient({ users, subscriptions, payments }: { users: any[]; subscriptions: any[]; payments: any[] }) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  const proUsers = users.filter((u: any) => u.subscription === "pro");
  const activeSubs = subscriptions.filter((s: any) => s.status === "active");
  const totalRevenue = payments.filter((p: any) => p.status === "completed").reduce((s: number, p: any) => s + p.amount, 0) / 100;

  async function togglePro(userId: string, current: string) {
    setSaving(userId);
    const newSub = current === "pro" ? "free" : "pro";
    await fetch("/api/admin/billing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, subscription: newSub }) });
    setMsg(newSub === "pro" ? "✅ Pro активирован" : "❌ Pro отключён");
    setTimeout(() => setMsg(""), 3000);
    setSaving(null); router.refresh();
  }

  async function addManualPayment(userId: string) {
    const amount = prompt("Сумма в рублях:");
    if (!amount) return;
    setSaving(userId);
    await fetch("/api/admin/billing/payment", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId, amount: parseInt(amount) * 100, method: "manual", status: "completed" }) });
    setMsg("✅ Платёж добавлен");
    setTimeout(() => setMsg(""), 3000);
    setSaving(null); router.refresh();
  }

  const lab: any = { display: "block", fontSize: 10, fontWeight: 600, color: "var(--color-text-tertiary)", textTransform: "uppercase", marginBottom: 4 };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 800, margin: 0 }}>💳 Биллинг</h1>
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-s)" }}>Подписки, платежи, статусы</p>
        </div>
      </div>

      {msg && <div style={{ padding: "var(--space-s) var(--space-m)", background: "var(--color-accent-light)", border: "1px solid var(--color-accent)", marginBottom: "var(--space-m)", fontSize: "var(--text-xs)", fontWeight: 600 }}>{msg}</div>}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "var(--space-m)", marginBottom: "var(--space-xl)" }}>
        <StatBox icon={<Users size={18} />} label="Всего пользователей" value={users.length} />
        <StatBox icon={<Crown size={18} />} label="Pro-пользователей" value={proUsers.length} color="var(--color-accent)" />
        <StatBox icon={<Calendar size={18} />} label="Активных подписок" value={activeSubs.length} />
        <StatBox icon={<DollarSign size={18} />} label="Выручка" value={`${totalRevenue} ₽`} color="var(--color-accent)" />
      </div>

      {/* Users with subscriptions */}
      <h2 style={{ fontSize: "var(--text-l)", fontWeight: 700, marginBottom: "var(--space-m)" }}>Пользователи</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)" }}>
        {users.map((u: any) => {
          const sub = subscriptions.find((s: any) => s.userId === u.id);
          const userPayments = payments.filter((p: any) => p.userId === u.id);
          const isPro = u.subscription === "pro";
          return (
            <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "var(--space-m)", padding: "var(--space-m)", background: "var(--color-bg-primary)", border: `1px solid ${isPro ? "var(--color-accent)" : "var(--color-border)"}`, borderRadius: "var(--radius-m)", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 180 }}>
                <div style={{ fontWeight: 600, fontSize: "var(--text-s)" }}>{u.name || u.email}</div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{u.email}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ padding: "4px 12px", borderRadius: "var(--radius-full)", fontSize: 11, fontWeight: 600, background: isPro ? "var(--color-accent-light)" : "var(--color-bg-secondary)", color: isPro ? "var(--color-accent)" : "var(--color-text-tertiary)" }}>
                  {isPro ? "PRO" : "Free"}
                </span>
                {sub?.expiresAt && <span style={{ fontSize: 11, color: "var(--color-text-tertiary)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {new Date(sub.expiresAt).toLocaleDateString("ru")}</span>}
                {sub?.autoRenew && <span style={{ fontSize: 10, color: "var(--color-accent)" }}>Авто</span>}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{userPayments.length} платежей · {userPayments.filter((p: any) => p.status === "completed").reduce((s: number, p: any) => s + p.amount, 0) / 100} ₽</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => togglePro(u.id, u.subscription)} disabled={saving === u.id} className="btn btn-ghost" style={{ fontSize: 11, padding: "4px 12px" }}>
                  {saving === u.id ? "..." : isPro ? "Отключить Pro" : "Дать Pro"}
                </button>
                <button onClick={() => addManualPayment(u.id)} disabled={saving === u.id} className="btn btn-ghost" style={{ fontSize: 11, padding: "4px 12px" }}>
                  + Платёж
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatBox({ icon, label, value, color }: any) {
  return (
    <div style={{ padding: "var(--space-m)", background: "var(--color-bg-primary)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-m)", display: "flex", alignItems: "center", gap: "var(--space-m)" }}>
      <div style={{ color: color || "var(--color-text-secondary)" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "var(--text-l)", fontWeight: 800, fontFamily: "var(--font-heading)", color: color || "inherit" }}>{value}</div>
        <div style={{ fontSize: 10, color: "var(--color-text-tertiary)" }}>{label}</div>
      </div>
    </div>
  );
}
