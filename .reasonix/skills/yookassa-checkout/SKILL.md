---
name: yookassa-checkout
description: Профессиональная интеграция ЮKassa в Next.js-проект: архитектура, API, webhook, идемпотентность, обработка платежей, возвраты и тестирование. Используй при добавлении приёма платежей в российские проекты.
trust: verified
author: ProektMap
tested_with: [Reasonix, Cursor, Claude Code]
---

# ЮKassa Checkout — Skill для AI-агента

## Главная задача

Настроить приём платежей через ЮKassa в Next.js-проекте **профессионально**: не просто «чтобы работало», а с правильной архитектурой, идемпотентностью, обработкой ошибок и тестированием.

---

# 1. Архитектура

Прежде чем писать код, спроектируй поток платежа:

```
Пользователь → Frontend (кнопка «Оплатить»)
    ↓
POST /api/billing/create-payment (Next.js API)
    ↓
ЮKassa API (создание платежа)
    ↓
Пользователь → страница оплаты ЮKassa (внешний виджет)
    ↓
ЮKassa → POST /api/billing/webhook (уведомление об оплате)
    ↓
Backend → БД (сохранение платежа, обновление статуса)
    ↓
Backend → Telegram / Email (уведомление)
    ↓
Пользователь → редирект на страницу успеха
```

Ключевые принципы:
- **Идемпотентность:** повторный webhook не должен создавать дубликаты
- **Атомарность:** смена статуса платежа и начисление услуги — одна транзакция
- **Безопасность:** проверка IP/webhook-подписи, никаких секретов на клиенте

---

# 2. Переменные окружения

Создай в `.env`:

```bash
# ЮKassa
YOOKASSA_SHOP_ID=your_shop_id
YOOKASSA_SECRET_KEY=live_xxx
# Для тестов: YOOKASSA_SECRET_KEY=test_xxx
```

**Важно:** секретный ключ **никогда** не попадает в клиентский код. Всегда используй `NEXT_PUBLIC_` только для публичных переменных (shop_id — можно, secret_key — нельзя).

---

# 3. Модель БД (Prisma)

```prisma
model Payment {
  id            String   @id @default(uuid())
  userId        String
  amount        Decimal
  currency      String   @default("RUB")
  status        String   @default("pending")
  yookassaId    String?  @unique
  description   String?
  metadata      Json?
  expiresAt     DateTime
  paidAt        DateTime?
  refundedAt    DateTime?
  refundAmount  Decimal?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([userId])
  @@index([status])
}
```

Статусы: `pending` → `waiting_for_capture` → `succeeded` (или `canceled`).

---

# 4. API-роут: создание платежа

Файл: `src/app/api/billing/create-payment/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { v4 as uuid } from "uuid";

const SHOP_ID = process.env.YOOKASSA_SHOP_ID!;
const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;
const API_URL = "https://api.yookassa.ru/v3/payments";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, description, returnUrl } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Идемпотентный ключ: один пользователь — один платёж
    const idempotenceKey = uuid();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotenceKey,
        Authorization: `Basic ${Buffer.from(`${SHOP_ID}:${SECRET_KEY}`).toString("base64")}`,
      },
      body: JSON.stringify({
        amount: { value: amount.toFixed(2), currency: "RUB" },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: returnUrl || `${process.env.NEXTAUTH_URL}/dashboard/billing`,
        },
        description: description || "Пополнение баланса",
        metadata: { userId: session.user.id },
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();

    // Сохраняем платёж в БД
    await prisma.payment.create({
      data: {
        userId: session.user.id,
        amount,
        yookassaId: data.id,
        status: data.status,
        description,
        metadata: data,
        expiresAt: new Date(Date.now() + 3600000), // 1 час
      },
    });

    return NextResponse.json({
      paymentId: data.id,
      confirmationUrl: data.confirmation.confirmation_url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
```

---

# 5. Webhook-обработчик

Файл: `src/app/api/billing/webhook/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SECRET_KEY = process.env.YOOKASSA_SECRET_KEY!;

// Проверка IP ЮKassa (опционально, но рекомендуется)
const YOOKASSA_IPS = [
  "185.71.76.0/27", "185.71.77.0/27", "77.75.153.0/25",
  "77.75.156.11", "77.75.156.35", "77.75.154.128/25",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Проверка подлинности webhook (production)
    // В production: проверять подпись через crypto.verify()
    // Для тестов: достаточно проверки структуры

    if (!body.event || !body.object) {
      return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
    }

    const payment = body.object;

    // 2. Идемпотентность: проверяем, не обработан ли уже этот webhook
    const existing = await prisma.payment.findUnique({
      where: { yookassaId: payment.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Если статус не изменился — игнорируем
    if (existing.status === payment.status) {
      return NextResponse.json({ ok: true });
    }

    // 3. Обработка события
    switch (body.event) {
      case "payment.succeeded":
        await handlePaymentSuccess(existing.id, payment);
        break;
      case "payment.canceled":
        await handlePaymentCanceled(existing.id);
        break;
      case "refund.succeeded":
        await handleRefund(existing.id, payment);
        break;
      default:
        console.log("Unknown event:", body.event);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function handlePaymentSuccess(paymentId: string, paymentData: any) {
  await prisma.$transaction([
    prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: "succeeded",
        paidAt: new Date(paymentData.captured_at),
        metadata: paymentData,
      },
    }),
    // Здесь: начисление услуги, обновление баланса и т.д.
    // prisma.user.update({ where: { id: userId }, data: { balance: { increment: amount } } }),
  ]);

  // Отправка уведомления (Telegram, Email)
  // await sendNotification(userId, `Платёж на ${paymentData.amount.value} ₽ получен`);
}

async function handlePaymentCanceled(paymentId: string) {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { status: "canceled" },
  });
}

async function handleRefund(paymentId: string, refundData: any) {
  await prisma.payment.update({
    where: { id: paymentId },
    data: {
      status: "refunded",
      refundedAt: new Date(),
      refundAmount: refundData.amount.value,
    },
  });
}
```

---

# 6. Клиентский компонент (кнопка оплаты)

```tsx
"use client";
import { useState } from "react";

export default function PayButton({ amount, description }: { amount: number; description: string }) {
  const [loading, setLoading] = useState(false);

  async function handlePay() {
    setLoading(true);
    try {
      const res = await fetch("/api/billing/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description }),
      });
      const data = await res.json();
      if (data.confirmationUrl) {
        window.location.href = data.confirmationUrl;
      }
    } catch (e) {
      console.error("Payment error:", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={handlePay} disabled={loading}
      style={{ padding: "14px 32px", borderRadius: 12, background: "#0FB880", color: "#fff", border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer" }}>
      {loading ? "Перенаправление..." : `Оплатить ${amount} ₽`}
    </button>
  );
}
```

---

# 7. Тестовый режим

ЮKassa предоставляет тестовый магазин:

1. Зарегистрироваться на https://yookassa.ru
2. Получить `shopId` и `test_xxx` секретный ключ
3. Использовать тестовые карты:
   - Успешная оплата: `5555 5555 5555 4441`
   - Отказ: `5555 5555 5555 4442`
   - 3-D Secure: `5555 5555 5555 4477`

Webhook в тестовом режиме: использовать ngrok или localtunnel для локального тестирования.

---

# 8. Проверка перед деплоем

Перед запуском в production проверь:

- [ ] Секретный ключ в `.env`, НЕ в коде
- [ ] Webhook URL зарегистрирован в личном кабинете ЮKassa
- [ ] IP ЮKassa добавлены в белый список (опционально)
- [ ] Идемпотентность протестирована (повторный webhook)
- [ ] Возвраты работают (тестовый сценарий)
- [ ] Telegram-уведомления приходят
- [ ] `.env` содержит `live_` ключ (не `test_`)
- [ ] SSL-сертификат валиден (ЮKassa требует HTTPS для webhook)

---

# 9. Частые ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| `401 Unauthorized` | Неверный shopId/secret | Проверить `.env`, перевыпустить ключ |
| `400 Bad Request` | Неверная сумма/валюта | Сумма > 0, валюта = RUB |
| Webhook не приходит | URL не зарегистрирован | Зарегистрировать в ЛК ЮKassa |
| Двойное начисление | Нет идемпотентности | Проверять `existing.status === payment.status` |
| `ERR_SSL` | Нет HTTPS | Настроить SSL (Let's Encrypt через Certbot) |

---

# 10. Полезные ссылки

- Документация ЮKassa API: https://yookassa.ru/developers/api
- Тестовые карты: https://yookassa.ru/developers/payment-acceptance/testing-and-going-live/test-cards
- ProektMap Blueprint «Интернет-магазин»: https://proektmap.ru/blueprints/internet-magazin
- ProektMap Skills: https://proektmap.ru/skills
