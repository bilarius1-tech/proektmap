import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = (session.user as any).id;
  const { entityType, entitySlug } = await req.json();
  const db = await getDb();
  await db.userCollection.deleteMany({ where: { userId, entityType, entitySlug } });
  return NextResponse.json({ ok: true });
}
