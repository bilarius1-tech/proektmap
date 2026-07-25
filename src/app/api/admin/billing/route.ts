import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const { userId, subscription, subscriptionExpiresAt } = await req.json();
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
  const db = await getDb();
  const data: any = { subscription };
  if (subscriptionExpiresAt) data.subscriptionExpiresAt = new Date(subscriptionExpiresAt);
  else data.subscriptionExpiresAt = null;
  await db.user.update({ where: { id: userId }, data });
  return NextResponse.json({ ok: true });
}
