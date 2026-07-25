import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ authenticated: false });

  const email = (session.user as any).email;
  let subscription = "free";
  let role = (session.user as any).role || "user";

  // Get fresh subscription from DB
  if (email) {
    const db = await getDb();
    const user = await db.user.findUnique({ where: { email }, select: { subscription: true, role: true } });
    if (user) {
      subscription = user.subscription;
      role = user.role;
    }
  }

  return NextResponse.json({
    authenticated: true,
    email,
    role,
    subscription,
  });
}
