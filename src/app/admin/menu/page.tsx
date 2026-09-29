import { getDb } from "@/lib/db";
import MenuEditor from "./editor";

export default async function AdminMenuPage() {
  const db = await getDb();
  const blueprints = await db.blueprint.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" }, select: { id: true, title: true, slug: true, sortOrder: true, isPublished: true, icon: true } });
  const allBlueprints = await db.blueprint.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, title: true, slug: true, sortOrder: true, isPublished: true, icon: true } });

  const items = await db.menuItem.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: "asc" },
    include: {
      children: {
        orderBy: { sortOrder: "asc" },
        include: { children: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-l)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2xs)" }}>Меню</h1>
          <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-s)" }}>
            Здесь вы сами правите левую колонку и футер. Сохранение сразу видно на сайте.
          </p>
        </div>
      </div>
      <div
        style={{
          marginBottom: "var(--space-m)",
          padding: "12px 14px",
          borderRadius: "var(--radius-m)",
          background: "rgba(15,184,128,0.1)",
          border: "1px solid rgba(15,184,128,0.25)",
          fontSize: "var(--text-s)",
          color: "var(--color-text-secondary)",
          lineHeight: 1.45,
        }}
      >
        Вкладка «Главное меню» — это левая колонка. Три уровня: корень, подпункт, подпункт подпункта.
        Иконка выбирается по имени из списка. «Карта» на сайте всегда стоит внизу колонки.
        Повторный синк из файла больше не затирает то, что сохранено здесь.
      </div>
      <MenuEditor items={JSON.parse(JSON.stringify(items))} blueprints={JSON.parse(JSON.stringify(blueprints))} allBlueprints={JSON.parse(JSON.stringify(allBlueprints))} />
    </div>
  );
}
