import type { Metadata } from "next";
import GuidedSaasWorkspace from "./guided-workspace";

export const metadata: Metadata = {
  title: "Создать SaaS — готовый инженерный маршрут",
  description: "12 готовых шагов: Cursor, AI-модели, GitHub, Next.js, PostgreSQL, авторизация, AI, ЮKassa и deploy на VPS.",
  robots: { index: false, follow: true },
};

export default function SaasWorkspacePage() {
  return <GuidedSaasWorkspace />;
}
