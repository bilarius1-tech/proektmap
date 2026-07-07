import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function POST(req: NextRequest) {
  const data = await req.json();
  const slug = data.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
  const db = await getDb();
  const prompt = await db.prompt.create({ data: { ...data, slug } });
  return NextResponse.json(prompt);
}
