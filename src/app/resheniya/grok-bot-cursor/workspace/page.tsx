import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedGrokBotCursorSolution } from "../../grok-bot-cursor-guided-data";

export const metadata: Metadata = {
  title: "Grok Bot → Cursor — рабочая зона готового решения",
  description:
    "Оплата из РФ, рабочее место, два контура, устав продюсера, бриф, skill и handoff в Cursor без авто-PR.",
  robots: { index: false, follow: true },
};

export default function GrokBotCursorWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedGrokBotCursorSolution}
      overviewHref="/resheniya/grok-bot-cursor"
      storageKey="proektmap:resheniya:grok-bot-cursor-guided:v1"
      finalCta="Контур собран — завершить маршрут"
    />
  );
}
