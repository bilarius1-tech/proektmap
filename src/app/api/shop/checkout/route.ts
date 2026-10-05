import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";
import { createShopCheckout } from "@/lib/shop/payments";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const productId = String(body.productId || "");
    const email = String(body.email || "").trim().toLowerCase();
    if (!productId || !EMAIL.test(email)) {
      return NextResponse.json({ error: "Укажите товар и корректный email" }, { status: 400 });
    }

    const session = await auth();
    let userId: string | null = null;
    const sessionEmail = (session?.user as { email?: string } | undefined)?.email?.toLowerCase();
    if (sessionEmail && sessionEmail === email) {
      const db = await getDb();
      const user = await db.user.findUnique({ where: { email: sessionEmail }, select: { id: true } });
      userId = user?.id || null;
    }

    const result = await createShopCheckout({ productId, email, userId });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось создать платёж";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
