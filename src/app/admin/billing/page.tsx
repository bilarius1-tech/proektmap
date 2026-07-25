import { getDb } from "@/lib/db/index";
import BillingClient from "./client";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const db = await getDb();
  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });
  return <BillingClient users={JSON.parse(JSON.stringify(users))} />;
}
