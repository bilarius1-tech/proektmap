import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import StageForm from "../form";
export default async function EditStage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const st = await db.stage.findUnique({ where: { id } });
  if (!st) notFound();
  return <StageForm initial={JSON.parse(JSON.stringify(st))} />;
}
