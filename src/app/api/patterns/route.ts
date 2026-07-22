import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const patterns = await db.buildPattern.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ patterns });
}
