import { getDb } from "../src/lib/db/index";
import { SIDEBAR_SEED } from "../src/lib/nav/sidebar-seed";

/**
 * Досеивает в MenuItem только строки из SIDEBAR_SEED, которых ещё нет.
 * Название, ссылку, родителя, порядок и иконку уже существующих пунктов не трогает.
 * Чужие пункты не прячет. Живое меню — /admin/menu.
 */

async function main() {
  const db = await getDb();
  let created = 0;
  let kept = 0;

  for (const item of SIDEBAR_SEED) {
    const existing = await db.menuItem.findUnique({ where: { id: item.id } });
    if (existing) {
      kept += 1;
      console.log("keep", item.id, existing.label, existing.href);
      continue;
    }
    await db.menuItem.create({
      data: {
        id: item.id,
        label: item.label,
        href: item.href,
        sortOrder: item.sortOrder,
        location: "header",
        isActive: true,
        parentId: item.parentId,
        icon: item.icon,
      },
    });
    created += 1;
    console.log("create", item.id, item.parentId ?? "ROOT", item.href);
  }

  console.log(`done: created ${created}, kept ${kept}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
