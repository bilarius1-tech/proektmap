import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const db = await getDb();
  const terms = await db.glossaryTerm.findMany({
    where: { isPublished: true },
    select: { term: true, slug: true, definition: true, simpleExplanation: true, level: true, category: true, relatedTerms: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ terms });
}
