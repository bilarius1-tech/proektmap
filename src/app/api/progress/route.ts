import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

// Сохранить прогресс по решению
export async function POST(req: NextRequest) {
  const { decisionId, status } = await req.json();
  if (!decisionId) return NextResponse.json({ error: "decisionId required" }, { status: 400 });

  const db = await getDb();
  
  // Для MVP: сохраняем без привязки к пользователю
  const progress = await db.projectDecision.upsert({
    where: { projectId_decisionId: { projectId: "demo", decisionId } },
    create: { projectId: "demo", decisionId, status: status || "done", completedAt: new Date() },
    update: { status: status || "done", completedAt: new Date() },
  });

  // Считаем XP
  const decision = await db.decision.findUnique({ where: { id: decisionId } });
  const xpGained = decision?.xpReward || 0;

  return NextResponse.json({ ok: true, xpGained });
}

// Получить весь прогресс
export async function GET() {
  const db = await getDb();
  const progress = await db.projectDecision.findMany({
    where: { projectId: "demo" },
    include: { decision: { select: { id: true, title: true, xpReward: true } } },
  });

  const completed = progress.filter(p => p.status === "done");
  const totalXp = completed.reduce((s, p) => s + p.decision.xpReward, 0);

  return NextResponse.json({ completed: completed.map(p => p.decisionId), totalXp, count: completed.length });
}
