import { NextResponse } from "next/server";
import { syncShopOrderByToken } from "@/lib/shop/payments";

export async function GET(_req: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  if (!/^[a-f0-9]{48}$/.test(token)) {
    return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  }
  const order = await syncShopOrderByToken(token);
  if (!order) return NextResponse.json({ error: "Заказ не найден" }, { status: 404 });
  return NextResponse.json({
    status: order.status,
    amount: order.amount,
    email: order.email,
    items: order.items.map((item) => ({
      title: item.title,
      priceRub: item.priceRub,
      kind: item.kind,
    })),
  });
}
