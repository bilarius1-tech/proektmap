import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = await getDb();
  const models = await db.aIModel.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ models });
}
