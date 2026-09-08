import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCapsule, getCapsuleSlugs } from "@/lib/project-vault";
import VaultCapsuleView from "@/components/project-vault/vault-capsule-view";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCapsuleSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const capsule = getCapsule(slug);
  if (!capsule) return { title: "Капсула не найдена | Project Vault" };
  return {
    title: capsule.seoTitle,
    description: capsule.seoDescription,
    alternates: {
      canonical: `https://proektmap.ru/project-vault/${capsule.slug}`,
    },
    openGraph: {
      title: capsule.seoTitle,
      description: capsule.seoDescription,
      url: `https://proektmap.ru/project-vault/${capsule.slug}`,
      siteName: "ProektMap",
      type: "article",
    },
  };
}

export default async function ProjectVaultCapsulePage({ params }: PageProps) {
  const { slug } = await params;
  const capsule = getCapsule(slug);
  if (!capsule || capsule.status !== "published") notFound();

  return <VaultCapsuleView capsule={capsule} />;
}
