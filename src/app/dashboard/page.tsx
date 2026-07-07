import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";
import DashboardClient from "./client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return null;

  const db = await getDb();
  const user = await db.user.findUnique({
    where: { email: (session.user as any).email?.toLowerCase() || "" },
    select: { id: true, name: true, email: true, role: true, subscription: true, xp: true, level: true, streak: true }
  });

  if (!user) return null;

  return (
    <DashboardClient
      user={JSON.parse(JSON.stringify(user))}
      isAdmin={user.role === "admin"}
      isPro={user.subscription === "pro" || user.role === "admin"}
    />
  );
}
