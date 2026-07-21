import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const servers = await db.mCPServer.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ servers });
}
