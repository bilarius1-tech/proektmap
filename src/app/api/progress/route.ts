import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

async function ensureDemoProject(db: any) {
  let project = await db.project.findFirst({ where: { id: "demo" } });
  if (!project) {
    // Найти первый blueprint
    const bp = await db.blueprint.findFirst({ where: { isPublished: true } });
    if (!bp) throw new Error("No published blueprint");
    
    // Найти или создать demo user
    let user = await db.user.findFirst({ where: { email: "demo@proektmap.ru" } });
    if (!user) {
      user = await db.user.create({ data: { email: "demo@proektmap.ru", name: "Демо" } });
    }
    
    project = await db.project.create({
      data: { id: "demo", userId: user.id, blueprintId: bp.id },
    });
  }
  return project;
}

export async function POST(req: NextRequest) {
  try {
    const { decisionId, status } = await req.json();
    if (!decisionId) return NextResponse.json({ error: "decisionId required" }, { status: 400 });

    const db = await getDb();
    await ensureDemoProject(db);

    await db.projectDecision.upsert({
      where: { projectId_decisionId: { projectId: "demo", decisionId } },
      create: { projectId: "demo", decisionId, status: status || "done", completedAt: new Date() },
      update: { status: status || "done", completedAt: status === "done" ? new Date() : null },
    });

    const decision = await db.decision.findUnique({ where: { id: decisionId } });
    return NextResponse.json({ ok: true, xpGained: decision?.xpReward || 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const db = await getDb();
  await ensureDemoProject(db).catch(() => {});
  
  const progress = await db.projectDecision.findMany({
    where: { projectId: "demo", status: "done" },
    include: { decision: { select: { id: true, title: true, xpReward: true } } },
  });

  const totalXp = progress.reduce((s, p) => s + p.decision.xpReward, 0);
  return NextResponse.json({
    completed: progress.map(p => p.decisionId),
    totalXp,
    count: progress.length,
  });
}
