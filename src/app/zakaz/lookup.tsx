"use client";

import { useState } from "react";
import Link from "next/link";

type Found = {
  token: string;
  status: string;
  amount: number;
  title: string;
  createdAt: string;
};

const STATUS: Record<string, string> = {
  paid: "оплачен",
  pending: "ждёт оплату",
  canceled: "отменён",
};

export default function OrderLookup() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Found[] | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function search(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/shop/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Не удалось найти заказы");
        setOrders(null);
      } else {
        setOrders(data.orders || []);
      }
    } catch {
      setError("Нет связи с сайтом");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "40px 20px 72px" }}>
      <p style={{ margin: "0 0 8px", fontSize: 13 }}>
        <Link href="/books" style={{ color: "var(--color-accent)", textDecoration: "none" }}>Книги</Link>
      </p>
      <h1 style={{ margin: "0 0 12px", fontSize: 36 }}>Найти заказ</h1>
      <p style={{ margin: "0 0 20px", lineHeight: 1.6, color: "var(--color-text-secondary)" }}>
        Письмо с файлом не отправляется. Введите email из чека — появятся ссылки на страницы заказов.
      </p>
      <form onSubmit={search} style={{ display: "grid", gap: 10, maxWidth: 420 }}>
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
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 16px",
            background: "var(--color-accent)",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            cursor: "pointer",
            minHeight: 48,
          }}
        >
          {loading ? "Ищу" : "Найти"}
        </button>
      </form>
      {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}
      {orders && orders.length === 0 && <p>Заказов с этим email нет.</p>}
      {orders && orders.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10, marginTop: 24 }}>
          {orders.map((order) => (
            <li key={order.token} style={{ border: "1px solid var(--color-border)", padding: 14 }}>
              <Link href={`/zakaz/${order.token}`} style={{ color: "inherit", fontWeight: 700, textDecoration: "none" }}>
                {order.title}
              </Link>
              <p style={{ margin: "6px 0 0", color: "var(--color-text-secondary)", fontSize: 14 }}>
                {order.amount} ₽ · {STATUS[order.status] || order.status} · {new Date(order.createdAt).toLocaleString("ru-RU")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
