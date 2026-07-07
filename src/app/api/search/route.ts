import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const db = await getDb();
  const query = q.toLowerCase();

  const [decisions, stages, prompts] = await Promise.all([
    db.decision.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { problem: { contains: query, mode: "insensitive" } },
          { recommended: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { stage: { select: { title: true, slug: true } } },
      take: 10,
    }),
    db.stage.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    }),
    db.prompt.findMany({
      where: {
        isActive: true,
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { content: { contains: query, mode: "insensitive" } },
          { tags: { contains: query } },
        ],
      },
      take: 5,
    }),
  ]);

  const results = [
    ...stages.map(s => ({ type: "stage", id: s.id, title: s.title, subtitle: s.description, slug: s.slug })),
    ...decisions.map(d => ({
      type: "decision", id: d.id, title: d.title,
      subtitle: d.stage?.title || "", slug: d.slug,
      stage: d.stage?.slug,
    })),
    ...prompts.map(p => ({ type: "prompt", id: p.id, title: p.title, subtitle: p.description, slug: p.slug })),
  ].slice(0, 15);

  return NextResponse.json({ results, query: q });
}
