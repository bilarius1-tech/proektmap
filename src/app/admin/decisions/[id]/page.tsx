import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import DecisionForm from "../form";

export default async function EditDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const [decision, stages] = await Promise.all([
    db.decision.findUnique({ where: { id } }),
    db.stage.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!decision) notFound();
  return <DecisionForm stages={JSON.parse(JSON.stringify(stages))} initial={JSON.parse(JSON.stringify(decision))} />;
}
