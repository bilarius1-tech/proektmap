"use client";

import { useState } from "react";
import { Crown, Check, ArrowRight, Shield } from "lucide-react";

export default function BillingClient({ isPro, isAdmin }: { isPro: boolean; isAdmin: boolean }) {
  const [loading, setLoading] = useState(false);

  async function startPayment() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-payment", { method: "POST" });
      const data = await res.json();
      if (data.confirmationUrl) window.location.href = data.confirmationUrl;
    } catch (e) {
      alert("Ошибка создания платежа. Попробуйте позже.");
    }
    setLoading(false);
  }

  if (isPro) {
    return (
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "var(--space-xl) var(--space-m)", textAlign: "center" }}>
        <Crown size={40} style={{ color: "var(--color-accent)", marginBottom: "var(--space-m)" }} />
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: 8 }}>
          {isAdmin ? "Админ — всё включено" : "Pro подписка активна"}
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          {isAdmin
            ? "Как администратор вы имеете неограниченный доступ ко всем функциям."
            : "Спасибо за поддержку! Все функции доступны. Подписка продлевается автоматически."}
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <h1 style={{ fontSize: "var(--text-xxxl)", fontWeight: 800, marginBottom: 8 }}>Pro подписка</h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)", lineHeight: 1.7 }}>
          Разблокируйте AI-консультанта и все Blueprint'ы
        </p>
      </div>

      <div style={{
        padding: "var(--space-xl)", borderRadius: "var(--radius-xl)",
        border: "2px solid var(--color-accent)", background: "var(--color-accent-light)",
        textAlign: "center", marginBottom: "var(--space-l)",
      }}>
        <div style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pro</div>
        <div style={{ fontSize: 48, fontWeight: 800, marginBottom: 4, lineHeight: 1 }}>
          300 <span style={{ fontSize: "var(--text-m)", fontWeight: 500 }}>₽/мес</span>
        </div>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-xs)", marginBottom: "var(--space-l)" }}>
          Можно отменить в любой момент
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "var(--space-l)", textAlign: "left" }}>
          {[
            "Неограниченный AI-консультант",
            "Все Blueprint'ы (11 этапов, 52 решения)",
            "Полная библиотека промптов",
            "Приоритетная поддержка",
          ].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--text-xs)" }}>
              <Check size={14} style={{ color: "var(--color-accent)", flexShrink: 0 }} />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <button onClick={startPayment} disabled={loading}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            width: "100%", padding: "14px", borderRadius: "var(--radius-m)",
            background: "var(--color-accent)", color: "white", border: "none",
            fontSize: "var(--text-s)", fontWeight: 700, cursor: "pointer",
          }}>
          <Crown size={16} /> {loading ? "Создание платежа..." : "Подключить Pro"}
          <ArrowRight size={16} />
        </button>

        <p style={{ marginTop: 12, fontSize: 10, color: "var(--color-text-tertiary)" }}>
          Оплата через ЮKassa. <a href="/offer" style={{ color: "var(--color-accent)" }}>Оферта</a> · <a href="/refund" style={{ color: "var(--color-accent)" }}>Возврат</a>
        </p>
      </div>
    </div>
  );
}
