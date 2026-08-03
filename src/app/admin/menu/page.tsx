import { getDb } from "@/lib/db";
import MenuEditor from "./editor";

export default async function AdminMenuPage() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" }, select: { id: true, title: true, slug: true, sortOrder: true, isPublished: true, icon: true } });
  const allBlueprints = await db.blueprint.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true, slug: true, sortOrder: true, isPublished: true, icon: true } });

  const items = await db.menuItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: { children: { orderBy: { sortOrder: "asc" } } },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Меню</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>Управление главным меню и футером</p>
        </div>
      </div>
      <MenuEditor items={JSON.parse(JSON.stringify(items))} blueprints={JSON.parse(JSON.stringify(blueprints))} allBlueprints={JSON.parse(JSON.stringify(allBlueprints))} />
    </div>
  );
}
