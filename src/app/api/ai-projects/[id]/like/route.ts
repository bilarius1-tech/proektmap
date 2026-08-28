import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  if (!projectId) return NextResponse.json({ error: "Missing project id" }, { status: 400 });

  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Необходимо войти, чтобы поставить оценку" }, { status: 401 });
  }

  const db = await getDb();
  const email = (session.user as any).email?.toLowerCase();
  const user = await db.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const existingLike = await db.projectLike.findUnique({
    where: {
      userId_projectId: {
        userId: user.id,
        projectId,
      },
    },
  });

  if (existingLike) {
    // Unlike
    await db.$transaction([
      db.projectLike.delete({ where: { id: existingLike.id } }),
      db.aiProject.update({
        where: { id: projectId },
        data: { likesCount: { decrement: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: false });
  } else {
    // Like
    await db.$transaction([
      db.projectLike.create({
        data: {
          userId: user.id,
          projectId,
        },
      }),
      db.aiProject.update({
        where: { id: projectId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: true });
  }
}
