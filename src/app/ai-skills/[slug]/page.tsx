import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AI_SKILLS, getAiSkill } from "@/lib/ai-skills";
import SkillDetailClient from "./skill-detail-client";

export function generateStaticParams() {
  return AI_SKILLS.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = getAiSkill(slug);
  if (!skill) {
    return { title: "Skill не найден | ProektMap" };
  }
  return {
    title: `${skill.title} — AI Skill (${skill.author}) | ProektMap`,
    description: `${skill.summary} Установка, вызов и как правильно писать запросы к агенту.`,
    alternates: {
      canonical: `https://proektmap.ru/ai-skills/${skill.slug}`,
    },
  };
}

export default async function AiSkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = getAiSkill(slug);
  if (!skill) notFound();
  return <SkillDetailClient skill={skill} />;
}
