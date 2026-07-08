import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.length < 2) return NextResponse.json({ results: [] });

  const db = await getDb();
  const posts = await db.blogPost.findMany({
    where: {
      status: "published",
      OR: [
        { title: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { excerpt: { contains: q, mode: "insensitive" } },
        { tags: { contains: q } },
      ],
    },
    select: { id: true, title: true, slug: true, excerpt: true },
    orderBy: { publishedAt: "desc" },
    take: 10,
  });

  const results = posts.map(p => ({
    id: p.id, title: p.title, slug: p.slug, subtitle: (p.excerpt || "").slice(0, 120),
  }));

  return NextResponse.json({ results });
}
