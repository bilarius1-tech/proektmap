import { getDb } from "@/lib/db/index";
import BlueprintsAdmin from "./client";

export const dynamic = "force-dynamic";

export default async function BlueprintsAdminPage() {
  const db: any = await getDb();
  const blueprints = await db.blueprint.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      stages: {
        orderBy: { sortOrder: "asc" },
        include: {
          stage: {
            include: {
              decisions: { orderBy: { sortOrder: "asc" } },
            },
          },
        },
      },
    },
  });

  return <BlueprintsAdmin data={JSON.parse(JSON.stringify(blueprints))} />;
}
