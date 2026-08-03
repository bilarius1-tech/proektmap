import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
export async function POST(req: NextRequest) {
  const { userId, amount, method, status } = await req.json();
  const db = await getDb();
  const payment = await db.payment.create({ data: { userId, amount, method: method || "manual", status: status || "completed" } });
  return NextResponse.json({ ok: true, payment });
}
