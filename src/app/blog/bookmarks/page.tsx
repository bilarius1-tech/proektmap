import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import BookmarksClient from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Мои закладки — Карта роста" };

export default async function BookmarksPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth?callbackUrl=/blog/bookmarks");

  const userEmail = (session.user as any).email;
  const db = await getDb();

  const bookmarks = await db.blogInteraction.findMany({
    where: { userId: userEmail, type: "bookmark" },
    orderBy: { createdAt: "desc" },
    include: { post: { include: { category: { select: { name: true, slug: true } }, author: { select: { name: true, email: true } } } } },
    take: 50,
  });

  return <BookmarksClient bookmarks={JSON.parse(JSON.stringify(bookmarks))} />;
}
