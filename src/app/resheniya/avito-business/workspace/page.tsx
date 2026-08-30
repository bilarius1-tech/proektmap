import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedAvitoSolution } from "../../avito-guided-data";

export const metadata: Metadata = {
  title: "Запустить AI-магазин на Авито — рабочая зона готового решения",
  description: "7 готовых шагов: анализ ниши, копирайтинг, Avito Photo Lab, сборка XML-фида и запуск AI-автоответов.",
  robots: { index: false, follow: true },
};

export default function AvitoBusinessWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedAvitoSolution}
      overviewHref="/resheniya/avito-business"
      storageKey="proektmap:resheniya:avito-business-guided:v1"
      finalCta="Магазин опубликован — завершить маршрут"
    />
  );
}
