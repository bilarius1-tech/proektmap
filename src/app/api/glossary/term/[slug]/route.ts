import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.pathname.split("/").pop() || "";
  const db = await getDb();
  const term = await db.glossaryTerm.findUnique({
    where: { slug },
    select: {
      title: true, slug: true, shortDescription: true, difficulty: true,
      relatedPatterns: true, relatedPrompts: true, relatedMcp: true,
      relatedTerms: true,
    },
  });
  if (!term) return NextResponse.json({ term: null }, { status: 404 });
  return NextResponse.json({ term });
}
