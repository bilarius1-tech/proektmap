import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedPremiumLandingSolution } from "../../premium-landing-guided-data";

export const metadata: Metadata = {
  title: "Премиум-шаблон без AI-скуфа — рабочая зона",
  description:
    "8 шагов после онбординга: BRIEF, DESIGN.md, Skills, Next.js, сборка, polish, проверка из РФ, финиш.",
  robots: { index: false, follow: true },
};

export default function PremiumLandingWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedPremiumLandingSolution}
      overviewHref="/resheniya/premium-landing"
      storageKey="proektmap:resheniya:premium-landing-guided:v3-setup"
      finalCta="Шаблон готов — завершить маршрут"
    />
  );
}
