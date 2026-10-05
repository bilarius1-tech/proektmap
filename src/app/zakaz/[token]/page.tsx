import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { syncShopOrderByToken } from "@/lib/shop/payments";
import OrderStatus from "./order-status";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export const metadata: Metadata = {
  title: "Заказ | ProektMap",
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: Props) {
  const { token } = await params;
  if (!/^[a-f0-9]{48}$/.test(token)) notFound();
  const order = await syncShopOrderByToken(token);
  if (!order) notFound();

  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "40px 20px 72px" }}>
      <OrderStatus
        token={token}
        initial={{
          status: order.status,
          amount: order.amount,
          email: order.email,
          items: order.items.map((item) => ({ title: item.title, priceRub: item.priceRub })),
        }}
      />
    </main>
  );
}
