import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db/index";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const db = await getDb();

  // Get project with blueprint and decisions
  const project = await db.project.findUnique({
    where: { id },
    include: {
      blueprint: {
        select: { id: true, title: true, slug: true, goal: true, totalXp: true, totalDecisions: true },
      },
      decisions: {
        include: {
          decision: {
            include: {
              stage: { select: { id: true, title: true, slug: true, sortOrder: true } },
            },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!project || project.userId !== (session.user as any).id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Group decisions by stage
  const stagesMap = new Map<string, {
    stageTitle: string;
    stageSlug: string;
    sortOrder: number;
    decisions: Array<{
      id: string;
      title: string;
      problem: string;
      why: string;
      recommended: string;
      content: string;
      tradeoffs: string;
      whenNotUse: string;
      mistakes: string;
      context: string;
      constraints: string;
      validation: string;
      iteration: string;
      promptTemplate: string;
      difficulty: string;
      xpReward: number;
      userChoice: string;
      userReason: string;
      status: string;
    }>;
  }>();

  for (const pd of project.decisions) {
    const stage = pd.decision.stage;
    if (!stagesMap.has(stage.id)) {
      stagesMap.set(stage.id, {
        stageTitle: stage.title,
        stageSlug: stage.slug,
        sortOrder: stage.sortOrder,
        decisions: [],
      });
    }
    stagesMap.get(stage.id)!.decisions.push({
      id: pd.decision.id,
      title: pd.decision.title,
      problem: pd.decision.problem,
      why: pd.decision.why,
      recommended: pd.decision.recommended,
      content: pd.decision.content,
      tradeoffs: pd.decision.tradeoffs,
      whenNotUse: pd.decision.whenNotUse,
      mistakes: pd.decision.mistakes,
      context: pd.decision.context,
      constraints: pd.decision.constraints,
      validation: pd.decision.validation,
      iteration: pd.decision.iteration,
      promptTemplate: pd.decision.promptTitle || "",
      difficulty: pd.decision.difficulty,
      xpReward: pd.decision.xpReward,
      userChoice: pd.userChoice,
      userReason: pd.userReason,
      status: pd.status,
    });
  }

  // Sort stages
  const stages = Array.from(stagesMap.values()).sort((a, b) => a.sortOrder - b.sortOrder);

  const brief = {
    project: {
      id: project.id,
      name: project.name,
      description: project.description,
      domain: project.domain,
      stack: project.stack,
      niche: project.niche,
      colors: project.colors,
      goals: project.goals,
      progress: project.progress,
      status: project.status,
      createdAt: project.createdAt,
    },
    blueprint: project.blueprint,
    stages,
    stats: {
      totalDecisions: project.decisions.length,
      completedDecisions: project.decisions.filter(d => d.status === "completed").length,
      skippedDecisions: project.decisions.filter(d => d.status === "skipped").length,
    },
  };

  return NextResponse.json(brief);
}
