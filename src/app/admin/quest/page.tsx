import { getDb } from "@/lib/db/index";
import QuestAdminClient from "./client";

export const dynamic = "force-dynamic";

export default async function QuestAdminPage() {
  const db = await getDb();
  const steps = await db.questStep.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <QuestAdminClient
      steps={JSON.parse(JSON.stringify(steps))}
    />
  );
}
