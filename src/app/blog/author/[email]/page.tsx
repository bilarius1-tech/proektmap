import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import AuthorPageClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  return { title: `${email} — Блог автора — Карта роста` };
}

export default async function AuthorPage({ params }: { params: Promise<{ email: string }> }) {
  const { email } = await params;
  const db = await getDb();
  const author = await db.user.findUnique({ where: { email: decodeURIComponent(email).toLowerCase() } });
  if (!author) notFound();

  const posts = await db.blogPost.findMany({
    where: { authorId: author.id, status: "published" },
    orderBy: { publishedAt: "desc" },
    include: { category: { select: { name: true, slug: true } } },
  });

  return <AuthorPageClient author={JSON.parse(JSON.stringify(author))} posts={JSON.parse(JSON.stringify(posts))} />;
}
