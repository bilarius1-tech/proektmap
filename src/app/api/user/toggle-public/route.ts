import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = await getDb();
  const user = await db.user.findUnique({ where: { email: (session.user as any).email?.toLowerCase() } });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });
  await db.user.update({ where: { id: user.id }, data: { publicProfile: !user.publicProfile } });
  return NextResponse.json({ ok: true, publicProfile: !user.publicProfile });
}
