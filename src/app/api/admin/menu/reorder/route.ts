import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { items } = await req.json();
  if (!items || !Array.isArray(items)) return NextResponse.json({ error: "items array required" }, { status: 400 });
  const db = await getDb();
  for (const item of items) {
    await db.menuItem.update({ where: { id: item.id }, data: { sortOrder: item.sortOrder } });
  }
  return NextResponse.json({ ok: true });
}
