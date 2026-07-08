import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const settings = await db.siteSettings.findUnique({ where: { id: "main" } });
  
  const shopId = settings?.yookassaShopId || "";
  const secretKey = settings?.yookassaSecretKey || "";
  const price = settings?.proPrice || 300;
  const email = (session.user as any).email || "";

  if (!shopId || !secretKey) {
    return NextResponse.json({ error: "ЮKassa не настроена. Добавьте shopId и secretKey в админке.", confirmationUrl: null }, { status: 400 });
  }

  try {
    const idempotenceKey = `pro-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    
    const res = await fetch("https://api.yookassa.ru/v3/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Basic " + Buffer.from(`${shopId}:${secretKey}`).toString("base64"),
        "Idempotence-Key": idempotenceKey,
      },
      body: JSON.stringify({
        amount: {
          value: String(price) + ".00",
          currency: "RUB",
        },
        capture: true,
        confirmation: {
          type: "redirect",
          return_url: "https://proektmap.ru/dashboard?paid=1",
        },
        description: "Pro подписка на Карту роста — 1 месяц",
        metadata: { email },
        receipt: {
          customer: { email },
          items: [{
            description: "Pro подписка на Карту роста",
            quantity: "1",
            amount: { value: String(price) + ".00", currency: "RUB" },
            vat_code: 1,
            payment_mode: "full_prepayment",
            payment_subject: "service",
          }],
        },
      }),
    });

    const data = await res.json();

    if (data.status === "pending" && data.confirmation?.confirmation_url) {
      return NextResponse.json({ confirmationUrl: data.confirmation.confirmation_url, paymentId: data.id });
    }

    return NextResponse.json({ error: data.description || "Ошибка создания платежа", confirmationUrl: null }, { status: 400 });
  } catch (e: any) {
    console.error("Payment error:", e.message);
    return NextResponse.json({ error: "Ошибка соединения с ЮKassa", confirmationUrl: null }, { status: 500 });
  }
}
