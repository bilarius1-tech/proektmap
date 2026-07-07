"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CookieConsent() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookie-consent");
    if (!accepted) setVisible(true);
    setMounted(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  }

  // Держим одинаковый рендер на сервере и клиенте — null
  if (!mounted || !visible) return null;

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "var(--color-bg-primary)", borderTop: "1px solid var(--color-border)",
      padding: "var(--space-m) var(--space-l)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: "var(--space-m)", flexWrap: "wrap", boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
      fontSize: "var(--text-xs)",
    }}>
      <div style={{ flex: 1, minWidth: 200, color: "var(--color-text-secondary)", lineHeight: 1.6 }}>
        🍪 Мы используем cookies для авторизации и аналитики (Яндекс.Метрика).
        Продолжая использовать сайт, вы соглашаетесь с{" "}
        <a href="/privacy" style={{ color: "var(--color-accent)", fontWeight: 600 }}>Политикой конфиденциальности</a>.
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <button onClick={accept} style={{
          padding: "8px 20px", borderRadius: "var(--radius-m)", background: "var(--color-accent)",
          color: "white", border: "none", fontSize: "var(--text-xs)", fontWeight: 600, cursor: "pointer",
        }}>
          Принять
        </button>
      </div>
    </div>
  );
}
