import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const blueprints = await db.blueprint.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    include: {
      stages: {
        orderBy: { sortOrder: "asc" },
        include: { stage: true },
      },
    },
  });
  return NextResponse.json(blueprints);
}
