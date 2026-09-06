import type { Metadata } from "next";
import AiSkillsHubClient from "./hub-client";

export const metadata: Metadata = {
  title: "AI Engineering Skills — усиление агента в дизайне | ProektMap",
  description:
    "Библиотека Skills для AI-агента: Frontend Design, taste-skill, Web Design Guidelines, Impeccable. Где взять, как установить и как правильно писать запросы.",
  alternates: {
    canonical: "https://proektmap.ru/ai-skills",
  },
  openGraph: {
    title: "AI Engineering Skills | ProektMap",
    description:
      "Скилы, которые превращают AI из генератора кода в инженера. Design-кластер, Skill Graph, Recipe и Stack.",
    url: "https://proektmap.ru/ai-skills",
    siteName: "ProektMap",
    type: "website",
  },
};

export default function AiSkillsPage() {
  return <AiSkillsHubClient />;
}
