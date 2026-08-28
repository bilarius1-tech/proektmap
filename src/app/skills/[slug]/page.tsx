import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CAPABILITY_SKILLS } from "../skills-data";
import SkillDetailClient from "./skill-detail-client";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const skill = CAPABILITY_SKILLS.find((s) => s.slug === slug);
  if (!skill) {
    return { title: "Навык не найден — ProektMap" };
  }

  return {
    title: `${skill.title} (${skill.level}) — Карта способностей ProektMap`,
    description: `${skill.power} Ступени мастерства, связанные термины глоссария и подтверждение артефактами.`,
    alternates: { canonical: `https://proektmap.ru/skills/${skill.slug}` },
  };
}

export default async function SkillDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const skill = CAPABILITY_SKILLS.find((s) => s.slug === slug);

  if (!skill) {
    notFound();
  }

  return (
    <main style={{ background: "var(--color-bg-primary, #fafafa)", minHeight: "100vh" }}>
      <SkillDetailClient skill={skill} />
    </main>
  );
}
