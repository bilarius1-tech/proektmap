import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const slug = data.name.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
  const db = await getDb();
  const maxSort = await db.promptCategory.aggregate({ _max: { sortOrder: true } });
  const v = await db.promptCategory.create({ data: { ...data, slug, sortOrder: (maxSort._max.sortOrder || 0) + 1 } });
  return NextResponse.json(v);
}
