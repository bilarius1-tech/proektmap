import { getDb } from "@/lib/db";
import AiProjectsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AiProjectsPage() {
  const db = await getDb();
  const projects = await db.aiProject.findMany({ orderBy: { createdAt: "desc" } });
  return <AiProjectsClient projects={JSON.parse(JSON.stringify(projects))} />;
}
