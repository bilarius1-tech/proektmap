import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import BillingClient from "./client";

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth");

  const db = await getDb();
  const userId = (session.user as any).id;
  const [user, settings] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.siteSettings.findUnique({ where: { id: "main" } }),
  ]);

  const isPro = user?.subscription === "pro"; // TODO: add subscription field
  const price = settings?.proPrice || 300;

  return <BillingClient isPro={false} price={price} userEmail={user?.email || ""} />;
}
