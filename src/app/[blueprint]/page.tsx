import { getDb } from "@/lib/db";
export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import BlueprintPageClient from "./client";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ blueprint: string }> }): Promise<Metadata> {
  const { blueprint: slug } = await params;
  try {
    const db = await getDb();
    const bp = await db.blueprint.findUnique({ where: { slug }, select: { title: true, description: true } });
    if (!bp) return {};
    return {
      title: `${bp.title} — Карта роста`,
      description: bp.description || `Пройдите путь создания ${bp.title.toLowerCase()} с AI-консультантом.`,
    };
  } catch { return {}; }
}

export default async function BlueprintPage({ params }: { params: Promise<{ blueprint: string }> }) {
  const { blueprint: slug } = await params;
  const db = await getDb();
  const bp = await db.blueprint.findUnique({
    where: { slug },
    include: { stages: { orderBy: { sortOrder: "asc" }, include: { stage: { include: { decisions: { orderBy: { sortOrder: "asc" } } } } } } },
  });
  if (!bp) notFound();

  const session = await auth();
  const isLoggedIn = !!session?.user;
  const isPro = isLoggedIn && ((session.user as any).subscription === "pro" || (session.user as any).role === "admin");

  return (
    <BlueprintPageClient
      blueprint={JSON.parse(JSON.stringify(bp))}
      isLoggedIn={isLoggedIn}
      isPro={isPro}
    />
  );
}
