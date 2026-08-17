import type { Metadata } from "next";
import SolutionWorkspace from "./workspace";

export const metadata: Metadata = {
  title: "Рабочая зона SaaS-маршрута",
  description: "Интерактивный UX-прототип выполнения готового AI-решения: решение, действие, артефакт и проверка.",
  robots: { index: false, follow: true },
};

export default function SaasWorkspacePage() {
  return <SolutionWorkspace />;
}
