import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Not logged in" }, { status: 401 });

  const userId = (session.user as any).id;
  const db = await getDb();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  if (user.lastLogin) {
    const lastDate = new Date(user.lastLogin).toISOString().slice(0, 10);
    if (lastDate === today) {
      return NextResponse.json({ streak: user.streak, xpGained: 0, alreadyClaimed: true });
    }
  }

  let newStreak = 1;
  if (user.lastLogin) {
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (new Date(user.lastLogin).toISOString().slice(0, 10) === yesterday.toISOString().slice(0, 10)) {
      newStreak = user.streak + 1;
    }
  }

  const bonus = newStreak >= 7 ? 15 : newStreak >= 3 ? 5 : 2;

  await db.user.update({
    where: { id: userId },
    data: { streak: newStreak, lastLogin: now, xp: { increment: bonus } },
  });

  return NextResponse.json({ streak: newStreak, xpGained: bonus, totalXp: user.xp + bonus, alreadyClaimed: false });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ loggedIn: false });
  const userId = (session.user as any).id;
  const db = await getDb();
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ loggedIn: false });

  const today = new Date().toISOString().slice(0, 10);
  const claimed = user.lastLogin ? new Date(user.lastLogin).toISOString().slice(0, 10) === today : false;

  return NextResponse.json({ loggedIn: true, streak: user.streak, xp: user.xp, level: user.level, claimed });
}
