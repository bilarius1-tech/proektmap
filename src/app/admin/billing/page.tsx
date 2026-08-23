import { getDb } from "@/lib/db/index";
import BillingClient from "./client";
export const dynamic = "force-dynamic";
export default async function BillingPage() {
  const db = await getDb();
  const users = await db.user.findMany({ orderBy: { createdAt: "desc" } });
  const subscriptions = await db.subscription.findMany({ orderBy: { createdAt: "desc" }, include: { payments: { select: { id: true, amount: true, status: true, createdAt: true } } } });
  const payments = await db.payment.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return <BillingClient users={JSON.parse(JSON.stringify(users))} subscriptions={JSON.parse(JSON.stringify(subscriptions))} payments={JSON.parse(JSON.stringify(payments))} />;
}
