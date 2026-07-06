import { db } from "@/lib/db";
<<<<<<< HEAD
export const dynamic = "force-dynamic";
=======
>>>>>>> cdf468cc (feat: динамический роутинг + главная-дашборд)
import { notFound } from "next/navigation";
import BlueprintPageClient from "./client";

export default async function BlueprintPage({ params }: { params: Promise<{ blueprint: string }> }) {
  const { blueprint: slug } = await params;

  const bp = await db.blueprint.findUnique({
    where: { slug },
    include: {
      stages: {
        orderBy: { sortOrder: "asc" },
        include: {
          stage: {
            include: {
              cards: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
    },
  });

  if (!bp) notFound();

  return <BlueprintPageClient blueprint={JSON.parse(JSON.stringify(bp))} />;
}
