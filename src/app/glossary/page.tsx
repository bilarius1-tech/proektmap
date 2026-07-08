import { getDb } from "@/lib/db/index";
import GlossaryClient from "./client";

export const dynamic = "force-dynamic";
export const metadata = { title: "Глоссарий вайбкодера — Карта роста", description: "Словарь терминов AI-инженера. Prompt, MCP, RAG, Agent и ещё 37 терминов с живыми примерами." };

export default async function GlossaryPage() {
  const db = await getDb();
  const terms = await db.glossaryTerm.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } });
  return <GlossaryClient terms={JSON.parse(JSON.stringify(terms))} />;
}
