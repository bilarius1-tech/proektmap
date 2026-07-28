import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";

// GET — public: return impact stats for a post
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const post = await db.blogPost.findUnique({
    where: { id },
    select: { impactScore: true, viewCount: true, bookmarkCount: true, projectUseCount: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Check if current user has bookmarked/used
  const session = await auth();
  const userEmail = (session?.user as any)?.email || null;
  let userInteractions: string[] = [];
  if (userEmail) {
    const interactions = await db.blogInteraction.findMany({
      where: { postId: id, userId: userEmail },
      select: { type: true },
    });
    userInteractions = interactions.map((i: any) => i.type);
  }

  return NextResponse.json({
    impactScore: post.impactScore,
    viewCount: post.viewCount,
    bookmarkCount: post.bookmarkCount,
    projectUseCount: post.projectUseCount,
    userInteractions,
  });
}

function calcImpact(viewCount: number, bookmarkCount: number, projectUseCount: number) {
  return Math.min(100, Math.round(viewCount * 0.05 + bookmarkCount * 5 + projectUseCount * 10));
}

// POST — toggle bookmark or project_use (requires auth)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const userEmail = (session.user as any).email;
  const { type } = await req.json(); // "bookmark" | "project_use"

  if (!type || !["bookmark", "project_use"].includes(type)) {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const db = await getDb();

  // Toggle: if exists, remove; otherwise add
  const existing = await db.blogInteraction.findUnique({
    where: { postId_userId_type: { postId: id, userId: userEmail, type } },
  });

  if (existing) {
    await db.blogInteraction.delete({ where: { id: existing.id } });
  } else {
    await db.blogInteraction.create({
      data: { postId: id, userId: userEmail, type },
    });
  }

  // Recalculate counts
  const [bookmarkCount, projectUseCount] = await Promise.all([
    db.blogInteraction.count({ where: { postId: id, type: "bookmark" } }),
    db.blogInteraction.count({ where: { postId: id, type: "project_use" } }),
  ]);

  const post = await db.blogPost.findUnique({ where: { id }, select: { viewCount: true } });
  const impactScore = calcImpact(post!.viewCount, bookmarkCount, projectUseCount);

  await db.blogPost.update({
    where: { id },
    data: { impactScore, bookmarkCount, projectUseCount },
  });

  // Get updated user interactions
  const userInteractions = await db.blogInteraction.findMany({
    where: { postId: id, userId: userEmail },
    select: { type: true },
  });

  return NextResponse.json({
    impactScore,
    viewCount: post!.viewCount,
    bookmarkCount,
    projectUseCount,
    userInteractions: userInteractions.map((i: any) => i.type),
  });
}
