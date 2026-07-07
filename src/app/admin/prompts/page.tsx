import { getDb } from "@/lib/db/index";
import AdminPromptsClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminPromptsPage() {
  const db = await getDb(); const prompts = await db.prompt.findMany({ orderBy: [{ category: "asc" }, { title: "asc" }] });
  return <AdminPromptsClient prompts={JSON.parse(JSON.stringify(prompts))} />;
}
