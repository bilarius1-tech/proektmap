import { auth } from "@/lib/auth";
import BillingClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Оплата — Карта роста" };

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user) return null;
  const isAdmin = (session.user as any).role === "admin";
  const isPro = (session.user as any).subscription === "pro" || isAdmin;

  return <BillingClient isPro={isPro} isAdmin={isAdmin} />;
}
