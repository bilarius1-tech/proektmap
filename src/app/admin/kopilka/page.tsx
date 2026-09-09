import { getDb } from "@/lib/db";
import AdminKopilkaClient from "./client";

export const dynamic = "force-dynamic";

export default async function AdminKopilkaPage() {
  const db = await getDb();
  const [categories, items] = await Promise.all([
    db.designBankCategory.findMany({ orderBy: { sortOrder: "asc" }, include: { _count: { select: { items: true } } } }),
    db.designBankItem.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: { category: { select: { id: true, title: true, slug: true, emoji: true } } },
    }),
  ]);

  return <AdminKopilkaClient categories={categories} items={items} />;
}
