import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";
import FavoritesClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Избранное — Карта роста" };

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user) return null;

  const db = await getDb();
  const favorites = await db.favorite.findMany({
    where: { userId: (session.user as any).id },
    include: { decision: { include: { stage: { select: { title: true, slug: true } } } } },
    orderBy: { createdAt: "desc" },
  });

  return <FavoritesClient favorites={JSON.parse(JSON.stringify(favorites))} />;
}
