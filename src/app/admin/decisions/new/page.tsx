import { getDb } from "@/lib/db";
import DecisionForm from "../form";

export default async function NewDecisionPage() {
  const db = await getDb();
  const stages = await db.stage.findMany({ orderBy: { sortOrder: "asc" } });
  return <DecisionForm stages={JSON.parse(JSON.stringify(stages))} />;
}
