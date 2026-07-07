import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await getDb();
  const favorites = await db.favorite.findMany({
    where: { userId: (session.user as any).id },
    include: { decision: { include: { stage: { select: { title: true, slug: true } } } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(favorites);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { decisionId } = await req.json();
  const db = await getDb();
  const userId = (session.user as any).id;

  const exists = await db.favorite.findUnique({ where: { userId_decisionId: { userId, decisionId } } });
  if (exists) return NextResponse.json(exists);

  const favorite = await db.favorite.create({ data: { userId, decisionId } });
  return NextResponse.json(favorite);
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { decisionId } = await req.json();
  const db = await getDb();
  const userId = (session.user as any).id;

  await db.favorite.deleteMany({ where: { userId, decisionId } });
  return NextResponse.json({ ok: true });
}
