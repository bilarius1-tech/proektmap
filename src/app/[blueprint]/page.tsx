import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import BlueprintPageClient from "./client";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getProjectContext, buildUserContext } from "@/lib/project-context";

export async function generateMetadata({ params }: { params: Promise<{ blueprint: string }> }): Promise<Metadata> {
  const { blueprint: slug } = await params;
  try {
    const db = await getDb();
    const bp = await db.blueprint.findUnique({ where: { slug }, select: { title: true, description: true } });
    if (!bp) return {};
    return {
      title: `${bp.title} — Карта роста`,
      description: bp.description || `Пройдите путь создания ${bp.title.toLowerCase()} с AI-консультантом.`,
    };
  } catch { return {}; }
}

export default async function BlueprintPage({
  params,
  searchParams,
}: {
  params: Promise<{ blueprint: string }>;
  searchParams: Promise<{ project?: string; pattern?: string; from?: string; demo?: string }>;
}) {
  const { blueprint: slug } = await params;
  const { project: projectId, pattern: patternSlug, from: fromPage, demo: isDemo } = await searchParams;
  const db = await getDb();

  const bp = await db.blueprint.findUnique({
    where: { slug },
    include: { stages: { orderBy: { sortOrder: "asc" }, include: { stage: { include: { decisions: { orderBy: { sortOrder: "asc" } } } } } } },
  });
  if (!bp) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isPro = isLoggedIn && ((session.user as any).subscription === "pro" || (session.user as any).role === "admin");

  // Load user's project if specified
  let projectContext = null;
  let userProjects: any[] = [];
  if (isLoggedIn && projectId) {
    projectContext = await getProjectContext(projectId);
  }
  if (isLoggedIn) {
    userProjects = await db.project.findMany({
      where: { userId: (session.user as any).id, blueprintId: bp.id },
      select: { id: true, name: true, progress: true, status: true },
      orderBy: { createdAt: "desc" },
    });
  }

  const userContext = buildUserContext(projectContext || { id: "", name: "", description: "", domain: "", stack: "", niche: "", colors: "", goals: "", blueprintTitle: "" });

  // Load pattern context if ?pattern=xxx
  let pattern = null;
  if (patternSlug) {
    pattern = await db.buildPattern.findUnique({ where: { slug: patternSlug } });
  }

  const glossaryTerms = await db.glossaryTerm.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" }, take: 12 });
  return (
    <BlueprintPageClient
      blueprint={JSON.parse(JSON.stringify(bp))} glossaryTerms={JSON.parse(JSON.stringify(glossaryTerms))}
      isLoggedIn={isLoggedIn}
      isPro={isPro}
      projectContext={JSON.parse(JSON.stringify(projectContext))}
      userProjects={JSON.parse(JSON.stringify(userProjects))}
      userContext={userContext}
      pattern={pattern ? JSON.parse(JSON.stringify(pattern)) : null}
      fromPage={fromPage || null}
      isDemo={isDemo === "true"}
    />
  );
}
