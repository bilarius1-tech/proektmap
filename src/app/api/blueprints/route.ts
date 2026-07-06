import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: { stages: { orderBy: { sortOrder: "asc" }, include: { stage: true } } },
  });
  return NextResponse.json(blueprints);
}
