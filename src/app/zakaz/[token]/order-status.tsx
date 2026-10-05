"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OrderView = {
  status: string;
  amount: number;
  email: string;
  items: { title: string; priceRub: number }[];
};

export default function OrderStatus({ token, initial }: { token: string; initial: OrderView }) {
  const [order, setOrder] = useState(initial);

  useEffect(() => {
    if (order.status !== "pending") return;
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      const res = await fetch("/api/shop/order/" + token);
      if (res.ok) {
        const data = (await res.json()) as OrderView;
        setOrder(data);
        if (data.status !== "pending") clearInterval(timer);
      }
      if (tries > 20) clearInterval(timer);
    }, 3000);
    return () => clearInterval(timer);
  }, [order.status, token]);

  const item = order.items[0];

  return (
    <article style={{ display: "grid", gap: 16, maxWidth: 640 }}>
      <p style={{ margin: 0, color: "var(--color-text-secondary)" }}>{order.email}</p>
      <h1 style={{ margin: 0, fontSize: 32, lineHeight: 1.2 }}>{item?.title || "Заказ"}</h1>
      <p style={{ margin: 0, fontSize: 18, fontWeight: 700 }}>{order.amount} ₽</p>
      {order.status === "paid" && (
        <a
          href={`/api/shop/download/${token}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 18px",
            background: "var(--color-accent)",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            minHeight: 52,
            maxWidth: 280,
          }}
        >
          Скачать файл
        </a>
      )}
      {order.status === "pending" && (
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Платёж ещё не подтверждён. Если вы уже оплатили, эта страница обновится сама. Сохраните адрес: повторно письмо не придёт.
        </p>
      )}
      {order.status === "canceled" && (
        <p style={{ margin: 0 }}>
          Оплата отменена. Можно вернуться к товару и создать новый заказ.
        </p>
      )}
      <Link href="/books" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
        К книгам
      </Link>
      <Link href="/zakaz" style={{ color: "var(--color-accent)", fontWeight: 600 }}>
        Найти другой заказ
      </Link>
    </article>
  );
}
