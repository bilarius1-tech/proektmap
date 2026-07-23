import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: Request) {
  const { a, b } = await req.json();
  if (!a || !b) return NextResponse.json({ error: "a and b required" }, { status: 400 });
  const db = await getDb();
  const [stepA, stepB] = await Promise.all([
    db.questStep.findUnique({ where: { id: a } }),
    db.questStep.findUnique({ where: { id: b } }),
  ]);
  if (!stepA || !stepB) return NextResponse.json({ error: "Steps not found" }, { status: 404 });
  await Promise.all([
    db.questStep.update({ where: { id: a }, data: { sortOrder: stepB.sortOrder, step: stepB.step } }),
    db.questStep.update({ where: { id: b }, data: { sortOrder: stepA.sortOrder, step: stepA.step } }),
  ]);
  return NextResponse.json({ ok: true });
}
