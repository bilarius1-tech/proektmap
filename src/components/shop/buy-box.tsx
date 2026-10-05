"use client";

import { useState } from "react";

export default function BuyBox({
  productId,
  priceRub,
  defaultEmail = "",
}: {
  productId: string;
  priceRub: number;
  defaultEmail?: string;
}) {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function pay() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      const data = await res.json();
      if (!res.ok || !data.confirmationUrl) {
        setError(data.error || "Не удалось перейти к оплате");
        setLoading(false);
        return;
      }
      window.location.href = data.confirmationUrl;
    } catch {
      setError("Нет связи с сайтом");
      setLoading(false);
    }
  }

  return (
    <form
      id="buy"
      onSubmit={(event) => {
        event.preventDefault();
        pay();
      }}
      style={{ display: "grid", gap: 10, maxWidth: 420 }}
    >
      <label style={{ display: "grid", gap: 6, fontSize: 14, fontWeight: 600 }}>
        Email для чека
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          style={{
            padding: "12px 14px",
            border: "1px solid var(--color-border)",
            background: "var(--color-bg-primary)",
            color: "var(--color-text-primary)",
            fontSize: 16,
          }}
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "14px 18px",
          background: "var(--color-accent)",
          color: "#fff",
          border: "none",
          fontWeight: 700,
          cursor: "pointer",
          minHeight: 52,
        }}
      >
        {loading ? "Перехожу к оплате" : `Купить здесь · ${priceRub} ₽`}
      </button>
      {error && <p style={{ margin: 0, color: "var(--color-error)", fontSize: 14 }}>{error}</p>}
      <p style={{ margin: 0, fontSize: 13, color: "var(--color-text-secondary)", lineHeight: 1.5 }}>
        После оплаты откроется страница заказа со ссылкой на скачивание. Сохраните её: письмо с файлом не отправляется.
      </p>
    </form>
  );
}
