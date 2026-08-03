import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = body.event;
    const payment = body.object;
    if (!payment) return NextResponse.json({ ok: true });

    const db = await getDb();

    if (event === "payment.succeeded" && payment.status === "succeeded") {
      const email = payment.metadata?.email;
      const amount = parseInt(String(payment.amount?.value || "300")) * 100; // копейки

      if (email) {
        const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
        if (user) {
          // Create payment record
          await db.payment.create({
            data: {
              userId: user.id,
              amount,
              currency: payment.amount?.currency || "RUB",
              status: "completed",
              method: "yookassa",
              externalId: payment.id,
              description: "Pro подписка — 1 месяц",
            },
          });

          // Create or update subscription
          const existing = await db.subscription.findFirst({
            where: { userId: user.id, status: "active" },
            orderBy: { createdAt: "desc" },
          });

          const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          if (existing) {
            await db.subscription.update({
              where: { id: existing.id },
              data: { status: "active", expiresAt, plan: "pro" },
            });
          } else {
            await db.subscription.create({
              data: {
                userId: user.id,
                plan: "pro",
                status: "active",
                startsAt: new Date(),
                expiresAt,
                autoRenew: payment.payment_method?.saved || false,
              },
            });
          }

          // Update user
          await db.user.update({
            where: { id: user.id },
            data: { subscription: "pro", subscriptionExpiresAt: expiresAt },
          });

          console.log("Pro activated for " + email);
        }
      }
    }

    if (event === "payment.canceled" && payment.id) {
      await db.payment.updateMany({
        where: { externalId: payment.id },
        data: { status: "failed" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook error:", e.message);
    return NextResponse.json({ ok: true });
  }
}
