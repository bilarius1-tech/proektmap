import { getDb } from "@/lib/db";
import RussianAIAdmin from "./client";
export default async function Page() {
  const db = await getDb();
  const projects = await db.russianAIProject.findMany({ orderBy: { sortOrder: "asc" } });
  return <RussianAIAdmin data={JSON.parse(JSON.stringify(projects))} />;
}
