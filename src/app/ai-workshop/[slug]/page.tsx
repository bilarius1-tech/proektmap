import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import AiProjectDetailClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const project = await db.aiProject.findUnique({ where: { slug } });
  if (!project) return { title: "Проект не найден — AI Цех" };

  return {
    title: `${project.title} — Портфолио вайбкодера | ProektMap`,
    description: project.description || `Кейс и AI-рецепт проекта ${project.title} в AI Цехе ProektMap.`,
    openGraph: {
      title: `${project.title} — AI Цех ProektMap`,
      description: project.description,
      images: project.screenshot ? [{ url: project.screenshot, width: 1200, height: 630 }] : [],
    },
  };
}

export default async function AiProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const session = await auth();

  const project = await db.aiProject.findUnique({
    where: { slug },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          status: true,
          headline: true,
          bio: true,
          skills: true,
          xp: true,
        },
      },
    },
  });

  if (!project) notFound();

  // Increment view count asynchronously
  await db.aiProject.update({
    where: { id: project.id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => {});

  // Check if current user has liked this project
  let currentUser: any = null;
  let hasLiked = false;

  if (session?.user?.email) {
    currentUser = await db.user.findUnique({
      where: { email: session.user.email.toLowerCase() },
      select: { id: true, email: true, name: true, role: true },
    });

    if (currentUser) {
      const existingLike = await db.projectLike.findUnique({
        where: {
          userId_projectId: {
            userId: currentUser.id,
            projectId: project.id,
          },
        },
      });
      hasLiked = !!existingLike;
    }
  }

  const techItems = (project.techStack || "").split(",").map((s) => s.trim()).filter(Boolean);
  const aiItems = (project.aiTools || "").split(",").map((s) => s.trim()).filter(Boolean);

  const matchingTools = aiItems.length > 0
    ? await db.aITool.findMany({
        where: { name: { in: aiItems }, isActive: true },
        select: { name: true, slug: true },
      })
    : [];
  const toolMap: Record<string, string> = {};
  for (const t of matchingTools) {
    toolMap[t.name.toLowerCase()] = t.slug;
  }

  const matchingSkills = techItems.length > 0
    ? await db.skill.findMany({
        where: { slug: { in: techItems.map((t) => t.toLowerCase().replace(/\s+/g, "-")) }, isPublished: true },
        select: { title: true, slug: true },
      })
    : [];
  const skillMap: Record<string, string> = {};
  for (const s of matchingSkills) {
    skillMap[s.title.toLowerCase()] = s.slug;
  }

  const related = await db.aiProject.findMany({
    where: { category: project.category, id: { not: project.id }, isPublished: true },
    take: 3,
    orderBy: { viewCount: "desc" },
    select: { id: true, title: true, slug: true, screenshot: true, category: true },
  });

  return (
    <AiProjectDetailClient
      project={JSON.parse(JSON.stringify(project))}
      authorUser={project.user ? JSON.parse(JSON.stringify(project.user)) : null}
      toolMap={toolMap}
      skillMap={skillMap}
      related={JSON.parse(JSON.stringify(related))}
      currentUser={currentUser ? JSON.parse(JSON.stringify(currentUser)) : null}
      initialHasLiked={hasLiked}
    />
  );
}
