import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL.test(email)) {
    return NextResponse.json({ error: "Укажите корректный email" }, { status: 400 });
  }

  const db = await getDb();
  const orders = await db.shopOrder.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { items: { select: { title: true } } },
  });

  return NextResponse.json({
    orders: orders.map((order) => ({
      token: order.publicToken,
      status: order.status,
      amount: order.amount,
      title: order.items[0]?.title || "Заказ",
      createdAt: order.createdAt,
    })),
  });
}
