import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const db: any = await getDb();
  await db.decision.update({
    where: { id: data.id },
    data: {
      title: data.title,
      problem: data.problem,
      why: data.why,
      recommended: data.recommended,
      promptTemplate: data.promptTemplate,
      skillsRequired: data.skillsRequired,
      content: data.content,
      mistakes: data.mistakes,
      xpReward: data.xpReward,
    },
  });

  return NextResponse.json({ ok: true });
}
