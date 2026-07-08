import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const db = await getDb();
  const feed = await db.blogFeed.create({ data });
  return NextResponse.json(feed);
}
