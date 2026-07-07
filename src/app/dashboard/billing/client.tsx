"use client";

import { useState } from "react";
import { Zap, Shield, Rocket, Sparkles, Heart } from "lucide-react";

export default function BillingClient({ isPro, price, userEmail }: { isPro: boolean; price: number; userEmail: string }) {
  const [loading, setLoading] = useState(false);

  if (isPro) {
    return (
      <div style={{ textAlign: "center", padding: "var(--space-xxl) var(--space-m)" }}>
        <div style={{ fontSize: 48, marginBottom: "var(--space-m)" }}>🚀</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-xs)" }}>Вы Pro</h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-xl)" }}>Все функции открыты. Спасибо что поддерживаете проект!</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "var(--space-xl) var(--space-m)" }}>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: "var(--space-xl)" }}>
        <div style={{ fontSize: 40, marginBottom: "var(--space-m)" }}>🎓</div>
        <h1 style={{ fontSize: "var(--text-xxl)", fontWeight: 800, marginBottom: "var(--space-s)" }}>
          Станьте AI-инженером
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-m)", lineHeight: 1.6, maxWidth: 400, margin: "0 auto" }}>
          Вы проходите путь. Вы строите проекты. Вы растёте.
          Поддержите проект — и получите неограниченный доступ.
        </p>
      </div>

      {/* Price card */}
      <div className="card" style={{ textAlign: "center", padding: "var(--space-xl)", border: "2px solid var(--color-accent)", marginBottom: "var(--space-l)" }}>
        <div style={{ fontSize: "var(--text-s)", color: "var(--color-text-tertiary)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "var(--space-s)" }}>Pro</div>
        <div style={{ fontSize: 48, fontWeight: 800, color: "var(--color-accent)", marginBottom: "var(--space-xs)" }}>
          {price} ₽
          <span style={{ fontSize: "var(--text-m)", fontWeight: 400, color: "var(--color-text-tertiary)" }}>/мес</span>
        </div>
        <p style={{ fontSize: "var(--text-s)", color: "var(--color-text-secondary)", marginBottom: "var(--space-l)" }}>
          Один платёж. Все функции. Навсегда.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-s)", marginBottom: "var(--space-l)", textAlign: "left" }}>
          {[
            { icon: <Zap size={16} />, text: "Безлимитный AI-консультант на каждом шаге" },
            { icon: <Shield size={16} />, text: "Премиум Blueprint'ы (SaaS, Игры, Мобильные)" },
            { icon: <Rocket size={16} />, text: "Сертификат AI-инженера после прохождения" },
            { icon: <Sparkles size={16} />, text: "Библиотека готовых промптов (скоро)" },
          ].map((f, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-s)", fontSize: "var(--text-s)", color: "var(--color-text-secondary)" }}>
              <span style={{ color: "var(--color-accent)" }}>{f.icon}</span> {f.text}
            </div>
          ))}
        </div>

        <button onClick={() => setLoading(true)} disabled={loading}
          className="btn btn-primary" style={{ padding: "14px 32px", fontSize: "var(--text-m)", width: "100%", justifyContent: "center" }}>
          {loading ? "⏳" : "🚀"} {loading ? "Перенаправляем..." : `Поддержать проект за ${price} ₽`}
        </button>

        <div style={{ marginTop: "var(--space-m)", display: "flex", alignItems: "center", justifyContent: "center", gap: "var(--space-xs)", color: "var(--color-text-tertiary)", fontSize: "var(--text-xs)" }}>
          <Heart size={12} /> Первые 7 дней бесплатно — отмена в один клик
        </div>
      </div>
    </div>
  );
}
