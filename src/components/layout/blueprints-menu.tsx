import { getDb } from "@/lib/db";
import BlueprintsDropdown from "./blueprints-dropdown";

// Серверный компонент — всегда актуальный список Blueprint'ов из БД
export default async function BlueprintsMenu() {
  let blueprints: any[] = [];
  try {
    const db = await getDb();
    blueprints = await db.blueprint.findMany({
      where: { isPublished: true },
      orderBy: { sortOrder: "asc" },
      select: { id: true, title: true, slug: true, icon: true, difficulty: true },
    });
  } catch (e) {}

  return <BlueprintsDropdown blueprints={blueprints} />;
}
