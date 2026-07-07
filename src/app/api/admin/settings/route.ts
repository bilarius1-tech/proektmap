import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  await db.siteSettings.upsert({ where: { id: "main" }, create: { id: "main", ...data }, update: data });
  return NextResponse.json({ ok: true });
}
