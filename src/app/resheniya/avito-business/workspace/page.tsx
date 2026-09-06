import type { Metadata } from "next";
import GuidedWorkspace from "../../saas-product/workspace/guided-workspace";
import { guidedAvitoSolution } from "../../avito-guided-data";

export const metadata: Metadata = {
  title: "Запустить AI-магазин на Авито — рабочая зона готового решения",
  description: "Оплата из РФ, локальное окружение, анализ ниши, копирайтинг, Avito Photo Lab, XML-фид и AI-автоответы.",
  robots: { index: false, follow: true },
};

export default function AvitoBusinessWorkspacePage() {
  return (
    <GuidedWorkspace
      solution={guidedAvitoSolution}
      overviewHref="/resheniya/avito-business"
      storageKey="proektmap:resheniya:avito-business-guided:v3-setup"
      finalCta="Магазин опубликован — завершить маршрут"
    />
  );
}
