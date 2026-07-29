import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { productType, recommendedStack, expertRecommendation, options, idea } = await req.json();
  if (!productType) return NextResponse.json({ error: "Missing productType" }, { status: 400 });

  const db = await getDb();
  const userId = (session.user as any).id;

  const saved = [];
  for (const opt of (options || [])) {
    const slug = (opt.name || productType).toLowerCase()
      .replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "")
      .slice(0, 60) + "-" + Date.now().toString(36);
    const solution = await db.solution.create({
      data: {
        title: opt.name || productType,
        slug,
        description: opt.description || "",
        productType,
        complexity: opt.complexity || 5,
        mvpDays: opt.mvpDays || "",
        monetization: opt.monetization || "",
        costDev: opt.costDev || "",
        costAi: opt.costAi || "",
        costServer: opt.costServer || "",
        stack: JSON.stringify(opt.stack || []),
        entities: JSON.stringify(opt.entities || []),
        plan: JSON.stringify(opt.plan || []),
        skills: JSON.stringify(opt.skills || []),
        mistakes: JSON.stringify(opt.mistakes || []),
        summary: opt.summary || opt.description || "",
        authorId: userId,
        authorName: (session.user as any).name || "",
        isPublished: false,
      },
    });
    saved.push(solution);
  }

  return NextResponse.json({ ok: true, saved: saved.length });
}
