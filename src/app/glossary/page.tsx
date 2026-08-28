import { getDb } from "@/lib/db/index";
import GlossaryClient from "./client";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Глоссарий жаргона вайбкодинга и ИИ-разработки — ProektMap",
  description: "Словарь сленга и терминов вайбкодинга: ИИ-слоп, Война Z-индексов, Промпт-дрейф, Петля, Зомби-код, MCP, RAG и рой агентов с живыми примерами из чатов.",
  alternates: { canonical: "https://proektmap.ru/glossary" },
};

export default async function GlossaryPage() {
  const db = await getDb();
  const terms = await db.glossaryTerm.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <main style={{ background: "var(--color-bg-primary, #fafafa)", minHeight: "100vh" }}>
      <GlossaryClient terms={JSON.parse(JSON.stringify(terms))} />
    </main>
  );
}
