import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const skills = await db.skill.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const slug = data.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "");
  const db = await getDb();
  const skill = await db.skill.create({ data: { ...data, slug } });
  return NextResponse.json(skill);
}
