import { getDb } from "@/lib/db";
import { notFound } from "next/navigation";
import BPForm from "../form";
export default async function EditBP({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = await getDb();
  const bp = await db.blueprint.findUnique({ where: { id } });
  if (!bp) notFound();
  return <BPForm initial={JSON.parse(JSON.stringify(bp))} />;
}
