import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  if (!data.title || !data.summary) return NextResponse.json({ error: "title and summary required" }, { status: 400 });

  const db: any = await getDb();
  const slug = data.title.toLowerCase().replace(/[^a-zа-я0-9]+/g, "-").replace(/^-|-$/g, "").replace(/--+/g, "-").slice(0, 60).replace(/-$/,"") + "-" + Date.now().toString(36);

  const solution = await db.solution.create({
    data: {
      title: data.title,
      slug,
      description: data.description || "",
      productType: data.productType || "",
      complexity: data.complexity || 5,
      mvpDays: data.mvpDays || "",
      monetization: data.monetization || "",
      costDev: data.costDev || "",
      costAi: data.costAi || "",
      costServer: data.costServer || "",
      summary: data.summary,
      stack: JSON.stringify(data.stack || []),
      entities: JSON.stringify(data.entities || []),
      plan: JSON.stringify(data.plan || []),
      skills: JSON.stringify(data.skills || []),
      mistakes: JSON.stringify(data.mistakes || []),
      authorId: (session.user as any).id,
      authorName: (session.user as any).name || (session.user as any).email || "",
      isPublished: true,
    },
  });

  return NextResponse.json({ slug: solution.slug });
}
