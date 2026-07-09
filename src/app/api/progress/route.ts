import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ completed: [] });
  const db = await getDb();
  const projectId = "demo";
  const decisions = await db.projectDecision.findMany({ where: { projectId, status: "done" } });
  return NextResponse.json({
    completed: decisions.map(d => d.decisionId),
    decisions: JSON.parse(JSON.stringify(decisions)),
    totalXp: decisions.length * 10,
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { decisionId, status, projectId: pid, userChoice, userReason } = await req.json();
  const projectId = pid || "demo";
  const db = await getDb();

  const data: any = { status };
  if (userChoice) data.userChoice = userChoice;
  if (userReason) data.userReason = userReason;
  if (status === "done") data.completedAt = new Date();

  await db.projectDecision.upsert({
    where: { projectId_decisionId: { projectId, decisionId } },
    create: { projectId, decisionId, ...data },
    update: data,
  });

  return NextResponse.json({ xpGained: status === "done" ? 10 : -10 });
}
