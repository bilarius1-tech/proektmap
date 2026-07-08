import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("YooKassa webhook:", JSON.stringify(body).slice(0, 200));

    // YooKassa sends event-based notifications
    const event = body.event; // "payment.succeeded", "payment.canceled", etc.
    const payment = body.object;

    if (event === "payment.succeeded" && payment?.status === "succeeded") {
      const email = payment.metadata?.email;
      if (email) {
        const db = await getDb();
        await db.user.updateMany({
          where: { email: email.toLowerCase() },
          data: { subscription: "pro" },
        });
        console.log(`✅ Pro activated for ${email}`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    console.error("Webhook error:", e.message);
    return NextResponse.json({ ok: true }); // Always return 200 to YooKassa
  }
}
