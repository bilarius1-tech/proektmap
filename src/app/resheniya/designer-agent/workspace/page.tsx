import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedDesignerAgentSolution } from "../../designer-agent-guided-data";

export const metadata: Metadata = {
  title: "AI-агенты для дизайнера — рабочая зона готового решения",
  description:
    "Оплата из РФ, окружение, выбор Claude Code или Codex, MCP Figma, среда и наполнение, скиллы, живой прототип и аудит макетов.",
  robots: { index: false, follow: true },
};

export default function DesignerAgentWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedDesignerAgentSolution}
      overviewHref="/resheniya/designer-agent"
      storageKey="proektmap:resheniya:designer-agent-guided:v1"
      finalCta="Прототип и аудит готовы — завершить маршрут"
    />
  );
}
