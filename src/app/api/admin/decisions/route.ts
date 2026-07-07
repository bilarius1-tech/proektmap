import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Создать решение
export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  
  const decision = await db.decision.create({
    data: {
      stageId: data.stageId,
      title: data.title,
      slug: data.slug || data.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-zа-я0-9-]/g, ""),
      problem: data.problem || "",
      why: data.why || "",
      recommended: data.recommended || "",
      content: data.content || "",
      tradeoffs: data.tradeoffs || "",
      whenNotUse: data.whenNotUse || "",
      mistakes: data.mistakes || "",
      difficulty: data.difficulty || "easy",
      xpReward: data.xpReward || 15,
      timeEstimate: data.timeEstimate || "15 мин",
      promptTitle: data.promptTitle || null,
      promptTemplate: data.promptTemplate || null,
      sortOrder: data.sortOrder || 0,
    },
  });

  return NextResponse.json({ ok: true, decision });
}

// Обновить
export async function PUT(req: NextRequest) {
  const { id, ...data } = await req.json();
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  
  await db.decision.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

// Удалить
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const db = await getDb();
  await db.decision.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
