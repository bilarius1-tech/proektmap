import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";

export async function GET() {
  try {
    const db = await getDb();
    const comments = await db.blogComment.findMany({
      where: { status: "approved" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true, authorName: true, content: true, createdAt: true,
        post: { select: { slug: true, title: true } },
      },
    });
    return NextResponse.json({ comments });
  } catch {
    return NextResponse.json({ comments: [] });
  }
}
