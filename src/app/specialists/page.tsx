import { getDb } from "@/lib/db/index";
import SpecialistsClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Специалисты — Карта роста", description: "Вайбкодеры, AI-инженеры, разработчики. Портфолио, статьи, рейтинг." };

export default async function SpecialistsPage() {
  const db = await getDb();
  const users = await db.user.findMany({
    where: { publicProfile: true },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      bio: true,
      headline: true,
      telegram: true,
      github: true,
      status: true,
      skills: true,
      xp: true,
      level: true,
      website: true,
      _count: {
        select: {
          posts: { where: { status: "published" } },
          aiProjects: { where: { isPublished: true, moderationStatus: "approved" } },
        },
      },
    },
    orderBy: { xp: "desc" },
  });

  const specialists = users.map((u) => ({
    ...u,
    projectsCount: u._count?.aiProjects || 0,
    articles: u._count?.posts || 0,
    rating: u.xp + (u._count?.aiProjects || 0) * 100 + (u._count?.posts || 0) * 50,
  })).sort((a, b) => b.rating - a.rating);

  return <SpecialistsClient specialists={JSON.parse(JSON.stringify(specialists))} />;
}
