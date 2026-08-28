import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import ProfileClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const db = await getDb();
  const user = await db.user.findFirst({
    where: { OR: [{ id }, { email: id?.includes("@") ? id.toLowerCase() : undefined }] },
    select: { name: true, email: true, bio: true, headline: true, publicProfile: true },
  });
  if (!user || !user.publicProfile) return { title: "Профиль не найден" };
  const name = user.name || user.email.split("@")[0];
  return {
    title: `${name} (${user.headline || "Вайбкодер"}) — Портфолио на ProektMap`,
    description: user.bio || `Портфолио AI-проектов и работ ${name} на платформе ProektMap.`,
  };
}

export default async function ProfilePage({ params }: any) {
  const { id } = await params;
  const db = await getDb();
  const session = await auth();

  const user = await db.user.findFirst({
    where: { OR: [{ id }, { email: id?.includes("@") ? id.toLowerCase() : undefined }] },
    include: {
      subscriptions: { where: { status: "active" }, orderBy: { createdAt: "desc" }, take: 1 },
      aiProjects: {
        where: { isPublished: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      },
      posts: {
        where: { status: "published" },
        orderBy: { publishedAt: "desc" },
        include: { category: { select: { name: true } } },
      },
    },
  });

  if (!user) notFound();

  // If user has direct aiProjects OR projects linked via authorName matching
  let aiProjects = user.aiProjects || [];
  if (aiProjects.length === 0) {
    const matchingProjects = await db.aiProject.findMany({
      where: {
        OR: [
          { userId: user.id },
          { authorName: user.name || "" },
        ],
        isPublished: true,
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
    aiProjects = matchingProjects;
  }

  const isOwner = session?.user?.email?.toLowerCase() === user.email.toLowerCase();
  const activeSub = user.subscriptions?.[0] || null;

  return (
    <ProfileClient
      user={JSON.parse(JSON.stringify(user))}
      aiProjects={JSON.parse(JSON.stringify(aiProjects))}
      posts={JSON.parse(JSON.stringify(user.posts || []))}
      isOwner={isOwner}
      activeSub={activeSub ? JSON.parse(JSON.stringify(activeSub)) : null}
    />
  );
}
