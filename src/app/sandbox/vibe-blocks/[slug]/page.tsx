import { notFound } from "next/navigation";
import { VIBE_KITS, getVibeKit } from "@/lib/vibe-blocks/data";
import VibeKitDetailClient from "./client";

export function generateStaticParams() {
  return VIBE_KITS.map((k) => ({ slug: k.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kit = getVibeKit(slug);
  if (!kit) return { title: "Не найдено" };
  return {
    title: `${kit.name} — вайб-блоки | ProektMap`,
    description: kit.tagline,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const kit = getVibeKit(slug);
  if (!kit) notFound();
  return <VibeKitDetailClient kit={kit} />;
}
