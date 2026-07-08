import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();

  await db.user.update({ where: { email }, data });
  return NextResponse.json({ ok: true });
}
