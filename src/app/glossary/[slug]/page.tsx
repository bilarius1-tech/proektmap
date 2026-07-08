import { getDb } from "@/lib/db/index";
import { notFound } from "next/navigation";
import TermClient from "./client";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const term = await db.glossaryTerm.findUnique({ where: { slug } });
  if (!term) return {};
  return {
    title: `${term.term} — Глоссарий вайбкодера — Карта роста`,
    description: term.simpleExplanation || term.definition.slice(0, 160),
    openGraph: { title: term.term, description: term.simpleExplanation, type: "article" as const },
  };
}

export default async function TermPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = await getDb();
  const term = await db.glossaryTerm.findUnique({ where: { slug } });
  if (!term) notFound();

  const related = term.relatedTerms ? await db.glossaryTerm.findMany({
    where: { slug: { in: term.relatedTerms.split(",").map(s => s.trim()) } },
    select: { term: true, slug: true },
  }) : [];

  return <TermClient term={JSON.parse(JSON.stringify(term))} related={JSON.parse(JSON.stringify(related))} />;
}
