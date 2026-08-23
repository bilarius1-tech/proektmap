import { getDb } from "@/lib/db/index";
import { auth } from "@/lib/auth";
import SuggestClient from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Предложить статью — Карта роста" };

export default async function SuggestPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth?callbackUrl=/blog/suggest");

  const db = await getDb();
  const categories = await db.blogCategory.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });

  return <SuggestClient categories={JSON.parse(JSON.stringify(categories))} />;
}
