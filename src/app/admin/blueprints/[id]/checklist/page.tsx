import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import ChecklistClient from "./client";

export const dynamic = "force-dynamic";

const DEPTH_FIELDS = ["problem", "why", "context", "constraints", "recommended", "content", "tradeoffs", "whenNotUse", "mistakes", "validation", "iteration", "promptTemplate"];

export default async function ChecklistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();

  const bp = await db.blueprint.findUnique({
    where: { id },
    include: {
      stages: {
        include: {
          stage: {
            include: {
              decisions: { select: { id: true, title: true, slug: true, xpReward: true, timeEstimate: true, sortOrder: true, promptTemplate: true, problem: true, why: true, context: true, constraints: true, recommended: true, content: true, tradeoffs: true, whenNotUse: true, mistakes: true, validation: true, iteration: true } },
            },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!bp) notFound();

  const decisions = bp.stages.flatMap(bs => bs.stage.decisions);
  const stages = bp.stages.map(bs => bs.stage);

  // Auto-checks
  const autoChecks: Record<string, boolean> = {};

  // 1. All 12 fields filled in every decision
  autoChecks["1"] = decisions.every(d => DEPTH_FIELDS.every(f => (d as any)[f]?.trim()));

  // 9. Stages in logical order (sortOrder sequential)
  autoChecks["9"] = bp.stages.every((bs, i) => bs.sortOrder === i || bs.sortOrder > (bp.stages[i - 1]?.sortOrder || -1));

  // 10. 5-8 decisions per stage
  autoChecks["10"] = stages.every(s => s.decisions.length >= 5 && s.decisions.length <= 8);

  // 11. 30-50 decisions total
  autoChecks["11"] = decisions.length >= 30 && decisions.length <= 50;

  // 14. Progress visible (brief exists)
  autoChecks["14"] = true; // brief feature built

  // 15. Decisions can be skipped (feature exists)
  autoChecks["15"] = true;

  // 16. Brief builds dynamically (feature exists)
  autoChecks["16"] = true;

  // 17. SkillChips in 80%+ — check via DB
  let skillCoverage = 0;
  try {
    const totalDecs = await db.decision.count({ where: { stage: { blueprints: { some: { blueprintId: id } } } } });
    const skillsCount = await db.decision.count({
      where: { stage: { blueprints: { some: { blueprintId: id } } }, skills: { some: {} } },
    });
    skillCoverage = totalDecs > 0 ? Math.round((skillsCount / totalDecs) * 100) : 0;
  } catch {}
  autoChecks["17"] = skillCoverage >= 80;

  // 20. Time per decision indicated
  autoChecks["20"] = decisions.every(d => d.timeEstimate?.trim());

  // Count auto-passed
  const autoPassed = Object.values(autoChecks).filter(Boolean).length;
  const autoTotal = Object.keys(autoChecks).length;

  // Stats for display
  const stats = {
    totalDecisions: decisions.length,
    totalStages: stages.length,
    avgDecisionsPerStage: stages.length ? Math.round(decisions.length / stages.length) : 0,
    totalXp: bp.totalXp,
    fieldsFilledAvg: decisions.length
      ? Math.round(decisions.reduce((sum, d) => sum + DEPTH_FIELDS.filter(f => (d as any)[f]?.trim()).length, 0) / decisions.length)
      : 0,
    promptsWithVersions: decisions.filter(d => d.promptTemplate?.match(/\d+\.\d+/)).length,
    skillCoverage,
  };

  return (
    <ChecklistClient
      blueprint={{ id: bp.id, title: bp.title, slug: bp.slug }}
      stats={stats}
      autoChecks={autoChecks}
      autoStats={{ passed: autoPassed, total: autoTotal }}
      decisionsCount={decisions.length}
    />
  );
}
