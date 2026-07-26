import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ skills: [], totalXp: 0 });
  const userId = (session.user as any).id;
  const db: any = await getDb();

  const projects = await db.project.findMany({ where: { userId }, select: { id: true } });
  const projectIds = projects.map((p: any) => p.id);
  const progress = await db.projectDecision.findMany({ where: { projectId: { in: projectIds }, status: "completed" }, select: { decisionId: true } });
  const decisionIds = [...new Set(progress.map((p: any) => p.decisionId))];

  const decisions = await db.decision.findMany({ where: { id: { in: decisionIds } }, select: { skillsRequired: true } });

  const skillTerms = await db.glossaryTerm.findMany({ where: { isSkill: true }, select: { slug: true, term: true, skillWeight: true } });
  const skillMap: Record<string, { term: string; weight: number }> = {};
  for (const s of skillTerms) skillMap[s.slug] = { term: s.term, weight: s.skillWeight };

  const xp: Record<string, number> = {};
  for (const d of decisions) {
    try { JSON.parse(d.skillsRequired).forEach((slug: string) => { if (skillMap[slug]) xp[slug] = (xp[slug] || 0) + skillMap[slug].weight; }); } catch {}
  }

  const skills = skillTerms.map((s: any) => ({ slug: s.slug, term: s.term, xp: xp[s.slug] || 0, weight: s.skillWeight })).sort((a: any, b: any) => b.xp - a.xp).slice(0, 15);
  return NextResponse.json({ skills, totalXp: Object.values(xp).reduce((a: number, b: number) => a + b, 0) });
}
